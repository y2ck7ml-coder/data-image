// ===========================================
// 0. URL/엘리먼트/페이지 초기화
// ===========================================
const params = new URLSearchParams(location.search);
const chartId = params.get("id");
const chart = CHARTS.find((c) => c.id === chartId);

const tabsEl = document.getElementById("categoryTabs");
const mainEl = document.getElementById("chartDetail");

if (!chart) {
  renderTabs(null);
  mainEl.innerHTML = `
    <div class="detail-empty">
      <p>요청하신 차트를 찾을 수 없습니다.</p>
      <a href="index.html">목록으로 돌아가기</a>
    </div>
  `;
} else {
  document.title = `${chart.name} · Data Gallery`;
  renderTabs(chart.category);
  renderDetail();
  initBuilder();
}

// ===========================================
// 1. 카테고리 탭 + 상세 정보
// ===========================================
function renderTabs(activeCategory) {
  const categories = ["전체", ...new Set(CHARTS.map((c) => c.category))];
  tabsEl.innerHTML = categories
    .map(
      (cat) => `
        <button type="button" class="tab${cat === activeCategory ? " active" : ""}" data-category="${cat}">${cat}</button>
      `
    )
    .join("");

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    location.href = "index.html";
  });

  const active = tabsEl.querySelector(".tab.active");
  if (active) {
    active.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
  }
}

function renderDetail() {
  document.getElementById("chartName").textContent = chart.name;
  document.getElementById("chartTags").innerHTML = chart.tags
    .map((t) => `<span class="card-tag">${t}</span>`)
    .join("");
  document.getElementById("chartDescription").textContent = chart.description || "";
  document.getElementById("chartExamples").innerHTML = (chart.useCases || [])
    .map((ex) => `<li>${ex}</li>`)
    .join("");
}

// ===========================================
// 2. 빌더 초기화 / 폼 유틸
// ===========================================
function initBuilder() {
  document.getElementById("loadSampleBtn").addEventListener("click", loadSample);
  document.getElementById("renderBtn").addEventListener("click", renderChart);
  document.getElementById("resetBtn").addEventListener("click", resetToForm);
  document.getElementById("downloadBtn").addEventListener("click", downloadImage);

  document.getElementById("mixedModeToggle").addEventListener("change", handleMixToggle);
  document.getElementById("mixChartSelect").addEventListener("change", handleMixSelectChange);
  document.getElementById("mixRenderBtn").addEventListener("click", renderChartMixed);

  document.getElementById("unitSelect").addEventListener("change", () => handleUnitToggle(false));
  document.getElementById("mixUnitSelect").addEventListener("change", () => handleUnitToggle(true));
}

function handleUnitToggle(isMix) {
  const sel = document.getElementById(isMix ? "mixUnitSelect" : "unitSelect");
  const custom = document.getElementById(isMix ? "mixUnitCustom" : "unitCustom");
  if (sel.value === "custom") {
    custom.style.display = "";
    custom.focus();
  } else {
    custom.style.display = "none";
  }
}

function getUnit(isMix = false) {
  const sel = document.getElementById(isMix ? "mixUnitSelect" : "unitSelect");
  if (!sel) return "";
  if (sel.value === "custom") {
    const c = document.getElementById(isMix ? "mixUnitCustom" : "unitCustom");
    return c ? c.value.trim() : "";
  }
  return sel.value || "";
}

function loadSample() {
  const sampleLabels = chart.sampleData?.labels || [];
  const sampleValues = chart.sampleData?.datasets?.[0]?.data || [];
  document.querySelectorAll('[data-field="label"]').forEach((el, i) => {
    el.value = sampleLabels[i] ?? "";
  });
  document.querySelectorAll('[data-field="value"]').forEach((el, i) => {
    el.value = sampleValues[i] ?? "";
  });
}

function readForm() {
  const labelEls = document.querySelectorAll('[data-field="label"]');
  const valueEls = document.querySelectorAll('[data-field="value"]');
  const colorEls = document.querySelectorAll('[data-field="color"]');
  const rows = [];
  for (let i = 0; i < labelEls.length; i++) {
    rows.push({
      label: labelEls[i].value.trim(),
      value: valueEls[i].value,
      color: colorEls[i].value
    });
  }
  return rows;
}

// ===========================================
// 3. 차트 라우팅 + 렌더링
// ===========================================
let chartInstance = null;
let lastSVGString = null;

const CHART_TYPE_MAP = {
  bar: { type: "bar" },
  horizontalBar: { type: "bar", indexAxis: "y" },
  line: { type: "line" },
  pie: { type: "pie" },
  doughnut: { type: "doughnut" }
};

// chart.id → 렌더링 엔진 + 세부 타입
const CHART_RENDER_MAP = {
  // ----- Chart.js -----
  "bar-vertical":   { engine: "chartjs", type: "bar" },
  "bar-horizontal": { engine: "chartjs", type: "bar", indexAxis: "y" },
  "dot-plot":       { engine: "chartjs", type: "scatter" },
  radar:            { engine: "chartjs", type: "radar" },
  pyramid:          { engine: "chartjs", type: "bar", indexAxis: "y" },
  pie:              { engine: "chartjs", type: "pie" },
  doughnut:         { engine: "chartjs", type: "doughnut" },
  "stacked-bar":    { engine: "chartjs", type: "bar" },
  "stacked-area":   { engine: "chartjs", type: "line", fill: true },
  histogram:        { engine: "chartjs", type: "bar" },
  scatter:          { engine: "chartjs", type: "scatter" },
  bubble:           { engine: "chartjs", type: "bubble" },
  line:             { engine: "chartjs", type: "line" },
  "dual-axis":      { engine: "chartjs", type: "line" },
  "forecast-line":  { engine: "chartjs", type: "line" },
  area:             { engine: "chartjs", type: "line", fill: true },
  sparkline:        { engine: "chartjs", type: "line", minimal: true },
  "bubble-matrix":  { engine: "chartjs", type: "bubble" },
  "scatter-matrix": { engine: "chartjs", type: "scatter" },
  correlation:      { engine: "chartjs", type: "scatter" },
  "bubble-map":     { engine: "chartjs", type: "bubble" },

  // ----- SVG -----
  bullet:             { engine: "svg", type: "bullet" },
  waterfall:          { engine: "svg", type: "waterfall" },
  marimekko:          { engine: "svg", type: "marimekko" },
  boxplot:            { engine: "svg", type: "boxplot" },
  violin:             { engine: "svg", type: "violin" },
  heatmap:            { engine: "svg", type: "heatmap" },
  "chord-diagram":    { engine: "svg", type: "chord" },
  cascade:            { engine: "svg", type: "waterfall" },
  funnel:             { engine: "svg", type: "funnel" },
  gantt:              { engine: "svg", type: "gantt" },
  sankey:             { engine: "svg", type: "sankey" },
  "timeline-flow":    { engine: "svg", type: "timeline" },
  treemap:            { engine: "svg", type: "treemap" },
  "org-chart":        { engine: "svg", type: "orgchart" },
  "mind-map":         { engine: "svg", type: "network" },
  matrix:             { engine: "svg", type: "matrix" },
  sunburst:           { engine: "svg", type: "sunburst" },
  "choropleth-map":   { engine: "svg", type: "regions" },
  "heatmap-geo":      { engine: "svg", type: "heatmap" },
  "flow-map":         { engine: "svg", type: "flowmap" },
  candlestick:        { engine: "svg", type: "candlestick" },
  ohlc:               { engine: "svg", type: "ohlc" },
  "waterfall-finance":{ engine: "svg", type: "waterfall" },
  "bullet-finance":   { engine: "svg", type: "bullet" },
  "word-cloud":       { engine: "svg", type: "wordcloud" },
  "timeline-text":    { engine: "svg", type: "timeline" },
  "network-diagram":  { engine: "svg", type: "network" },
  sociogram:          { engine: "svg", type: "network" },
  waffle:             { engine: "svg", type: "waffle" },
  pictogram:          { engine: "svg", type: "pictogram" },
  "ratio-stack":      { engine: "svg", type: "ratio" },
  "square-pie":       { engine: "svg", type: "squarepie" },
  "combo-chart":      { engine: "svg", type: "combo" },
  "dashboard-card":   { engine: "svg", type: "dashcard" },
  gauge:              { engine: "svg", type: "gauge" },
  "bullet-bar":       { engine: "svg", type: "bulletbar" }
};

function renderChart() {
  // 폼 검증: label + value 둘 다 채워지고 value가 숫자인 행만 유효
  const rows = readForm();
  const valid = rows.filter(
    (r) => r.label !== "" && r.value !== "" && !isNaN(parseFloat(r.value))
  );
  if (valid.length === 0) {
    alert("데이터를 입력해주세요");
    return;
  }

  const labels = valid.map((r) => r.label);
  const numValues = valid.map((r) => parseFloat(r.value));
  const colors = valid.map((r) => r.color);

  const route = CHART_RENDER_MAP[chart.id] || { engine: "chartjs", type: "bar" };

  try {
    if (route.engine === "chartjs") {
      renderChartJS(route, labels, numValues, colors);
    } else {
      renderSVG(route.type, labels, numValues, colors);
    }
    switchToChartState();
  } catch (err) {
    console.error("차트 렌더링 실패:", err);
    showError("차트를 그릴 수 없습니다");
  }
}

function renderChartJS(route, labels, numValues, colors) {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  lastSVGString = null;

  // SVG 컨테이너 숨김
  const svgContainer = document.getElementById("chart-container");
  if (svgContainer) svgContainer.style.display = "none";

  const type = route.type;
  const isPieLike = type === "pie" || type === "doughnut" || type === "polarArea";
  const isRadar = type === "radar";
  const isLine = type === "line";
  const isBubble = type === "bubble";
  const isScatter = type === "scatter";

  let data;
  if (isBubble) {
    const max = Math.max(...numValues.map(Math.abs)) || 1;
    data = {
      datasets: [
        {
          label: chart.name,
          data: numValues.map((v, i) => ({
            x: i + 1,
            y: v,
            r: Math.max(6, Math.min(40, (Math.abs(v) / max) * 30 + 6))
          })),
          backgroundColor: colors.map((c) => c + "B3"),
          borderColor: colors,
          borderWidth: 1
        }
      ]
    };
  } else if (isScatter) {
    data = {
      datasets: [
        {
          label: chart.name,
          data: numValues.map((v, i) => ({ x: i + 1, y: v })),
          backgroundColor: colors,
          borderColor: colors,
          pointRadius: 7,
          pointHoverRadius: 9
        }
      ]
    };
  } else {
    const dataset = {
      label: chart.name,
      data: numValues,
      backgroundColor: isLine || isRadar ? colors[0] + "60" : colors,
      borderColor: isPieLike ? "#fff" : isLine || isRadar ? colors[0] : colors,
      borderWidth: isPieLike ? 2 : isLine || isRadar ? 3 : 1
    };
    if (isLine) {
      dataset.pointBackgroundColor = colors;
      dataset.fill = route.fill ?? false;
      if (route.minimal) {
        dataset.pointRadius = 2;
        dataset.borderWidth = 2;
      }
    }
    data = { labels, datasets: [dataset] };
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: isPieLike },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const unit = getUnit();
            const val = ctx.parsed?.y ?? ctx.parsed;
            return unit
              ? `${ctx.dataset.label}: ${val} ${unit}`
              : `${ctx.dataset.label}: ${val}`;
          }
        }
      }
    }
  };
  if (route.indexAxis) options.indexAxis = route.indexAxis;
  if (route.minimal) {
    options.scales = {
      x: { display: false },
      y: { display: false }
    };
    options.plugins.legend.display = false;
  } else if (!isPieLike && !isRadar) {
    options.scales = options.scales || {};
    options.scales.y = options.scales.y || {};
    options.scales.y.ticks = {
      callback: (val) => {
        const u = getUnit();
        return u ? `${val} ${u}` : val;
      }
    };
  }

  const canvas = document.getElementById("builderCanvas");
  chartInstance = new Chart(canvas, { type, data, options });

  canvas.style.opacity = "0";
  requestAnimationFrame(() => {
    canvas.style.opacity = "1";
  });
}

function renderSVG(svgType, labels, numValues, colors) {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  document.getElementById("builderCanvas").style.opacity = "0";
  const container = ensureChartContainer();
  container.style.display = "block";

  const svg = renderSVGChart(svgType, labels, numValues, colors);
  lastSVGString = svg;
  container.innerHTML = svg;
}

// 분기자: type 키로 SVG_RENDERERS 호출
function renderSVGChart(type, labels, data, colors) {
  const fn = SVG_RENDERERS[type] || SVG_RENDERERS.fallback;
  return _svgWrap(fn(labels, data, colors));
}

function ensureChartContainer() {
  let container = document.getElementById("chart-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "chart-container";
    container.style.cssText =
      "position: absolute; inset: 0; padding: 8px; box-sizing: border-box; display: none;";
    const wrap = document.querySelector(".builder-canvas");
    if (wrap) wrap.appendChild(container);
  }
  return container;
}

function showError(msg) {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  document.getElementById("builderCanvas").style.opacity = "0";
  const container = ensureChartContainer();
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.innerHTML = `<div style="color:#dc2626;font-size:14px;text-align:center;">${msg}</div>`;
  switchToChartState();
}

function switchToChartState() {
  document.getElementById("builderPlaceholder").style.display = "none";
  document.getElementById("formButtons").style.display = "none";
  document.getElementById("chartButtons").style.display = "flex";
}

// SVG 공통 helpers
function _svgWrap(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style="display:block">${inner}</svg>`;
}

function _esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ===========================================
// 4. SVG sub-renderers
// 각 함수: (labels, values, colors) → inner SVG 문자열
// ===========================================
const SVG_RENDERERS = {
  fallback(labels, values, colors) {
    return `<text x="200" y="115" text-anchor="middle" font-size="14" fill="#6b7280" font-family="sans-serif">${_esc(labels.join(", "))}</text>`;
  },

  heatmap(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const cellW = 360 / N;
    const startX = 20;
    let s = "";
    values.forEach((v, i) => {
      const opacity = 0.25 + 0.75 * (Math.abs(v) / max);
      const cx = startX + i * cellW;
      s += `<rect x="${cx + 3}" y="35" width="${cellW - 6}" height="110" fill="${colors[i]}" fill-opacity="${opacity}" rx="3"/>`;
      s += `<text x="${cx + cellW / 2}" y="100" text-anchor="middle" font-size="14" font-weight="700" fill="#1f2937" font-family="sans-serif">${v}</text>`;
      s += `<text x="${cx + cellW / 2}" y="170" text-anchor="middle" font-size="11" fill="#4b5563" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  treemap(labels, values, colors) {
    const total = values.reduce((sum, v) => sum + Math.abs(v), 0) || 1;
    const idx = values
      .map((v, i) => ({ v: Math.abs(v), orig: v, label: labels[i], color: colors[i] }))
      .sort((a, b) => b.v - a.v);
    const W = 380, H = 180, X = 10, Y = 25;
    let s = "";
    if (idx.length === 1) {
      const it = idx[0];
      s += `<rect x="${X}" y="${Y}" width="${W}" height="${H}" fill="${it.color}" stroke="#fff" stroke-width="2"/>`;
      s += `<text x="${X + W / 2}" y="${Y + H / 2 + 4}" text-anchor="middle" font-size="16" fill="#fff" font-weight="700" font-family="sans-serif">${_esc(it.label)} (${it.orig})</text>`;
      return s;
    }
    const firstShare = idx[0].v / total;
    const firstW = Math.max(120, Math.min(W * 0.65, W * firstShare * 1.6));
    s += `<rect x="${X}" y="${Y}" width="${firstW - 3}" height="${H}" fill="${idx[0].color}" stroke="#fff" stroke-width="2"/>`;
    s += `<text x="${X + firstW / 2}" y="${Y + H / 2}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(idx[0].label)}</text>`;
    s += `<text x="${X + firstW / 2}" y="${Y + H / 2 + 18}" text-anchor="middle" font-size="12" fill="#fff" font-family="sans-serif">${idx[0].orig}</text>`;
    const rest = idx.slice(1);
    const restTotal = rest.reduce((sum, r) => sum + r.v, 0) || 1;
    const restX = X + firstW;
    const restW = W - firstW;
    let curY = Y;
    rest.forEach((r) => {
      const h = (r.v / restTotal) * H;
      s += `<rect x="${restX}" y="${curY}" width="${restW}" height="${h - 2}" fill="${r.color}" stroke="#fff" stroke-width="2"/>`;
      if (h > 22) {
        s += `<text x="${restX + restW / 2}" y="${curY + h / 2 + 4}" text-anchor="middle" font-size="11" fill="#fff" font-weight="700" font-family="sans-serif">${_esc(r.label)} (${r.orig})</text>`;
      }
      curY += h;
    });
    return s;
  },

  funnel(labels, values, colors) {
    const N = values.length;
    const max = Math.max(...values.map(Math.abs)) || 1;
    const startY = 20, totalH = 180, rowH = totalH / N;
    const cx = 200, W = 320;
    let s = "";
    values.forEach((v, i) => {
      const wA = (Math.abs(v) / max) * W;
      const wB = i < N - 1 ? (Math.abs(values[i + 1]) / max) * W : wA * 0.5;
      const yTop = startY + i * rowH;
      const yBot = startY + (i + 1) * rowH - 3;
      const pts = `${cx - wA / 2},${yTop} ${cx + wA / 2},${yTop} ${cx + wB / 2},${yBot} ${cx - wB / 2},${yBot}`;
      s += `<polygon points="${pts}" fill="${colors[i]}"/>`;
      s += `<text x="${cx}" y="${(yTop + yBot) / 2 + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(labels[i])} · ${v}</text>`;
    });
    return s;
  },

  gantt(labels, values, colors) {
    const N = values.length;
    const max = Math.max(...values.map(Math.abs)) || 1;
    const W = 280;
    const startX = 90;
    const rowH = Math.min(28, (180 - (N - 1) * 6) / N);
    let s = "";
    values.forEach((v, i) => {
      const barW = Math.max(12, (Math.abs(v) / max) * W);
      const offset = (i % 3) * 18;
      const y = 25 + i * (rowH + 6);
      s += `<text x="80" y="${y + rowH / 2 + 4}" text-anchor="end" font-size="11" fill="#374151" font-family="sans-serif">${_esc(labels[i])}</text>`;
      s += `<rect x="${startX + offset}" y="${y}" width="${barW}" height="${rowH}" fill="${colors[i]}" rx="3"/>`;
      s += `<text x="${startX + offset + barW / 2}" y="${y + rowH / 2 + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${v}</text>`;
    });
    return s;
  },

  sankey(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const yStep = (180 / Math.max(1, N - 1));
    let s = "";
    values.forEach((v, i) => {
      const w = Math.max(6, (Math.abs(v) / max) * 32);
      const yS = 25 + i * yStep;
      const yE = 25 + (N - 1 - i) * yStep;
      s += `<path d="M 40,${yS} C 200,${yS} 200,${yE} 360,${yE}" stroke="${colors[i]}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-opacity="0.7"/>`;
    });
    values.forEach((v, i) => {
      const yS = 25 + i * yStep;
      s += `<text x="32" y="${yS + 4}" text-anchor="end" font-size="11" fill="#374151" font-family="sans-serif">${_esc(labels[i])}</text>`;
      s += `<text x="368" y="${yS + 4}" font-size="11" fill="#374151" font-family="sans-serif">${v}</text>`;
    });
    return s;
  },

  timeline(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const sx = 35, ex = 365, ly = 115;
    let s = "";
    s += `<line x1="${sx}" y1="${ly}" x2="${ex}" y2="${ly}" stroke="#cbd5e1" stroke-width="2"/>`;
    values.forEach((v, i) => {
      const x = sx + (i / Math.max(1, N - 1)) * (ex - sx);
      const above = i % 2 === 0;
      const size = 6 + (Math.abs(v) / max) * 10;
      s += `<circle cx="${x.toFixed(1)}" cy="${ly}" r="${size}" fill="${colors[i]}"/>`;
      const boxY = above ? ly - 55 : ly + 25;
      s += `<line x1="${x.toFixed(1)}" y1="${ly + (above ? -size : size)}" x2="${x.toFixed(1)}" y2="${above ? boxY + 25 : boxY}" stroke="${colors[i]}" stroke-width="1.5"/>`;
      s += `<rect x="${x - 35}" y="${boxY}" width="70" height="30" fill="#fff" stroke="${colors[i]}" rx="3"/>`;
      s += `<text x="${x.toFixed(1)}" y="${boxY + 13}" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937" font-family="sans-serif">${_esc(labels[i])}</text>`;
      s += `<text x="${x.toFixed(1)}" y="${boxY + 25}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${v}</text>`;
    });
    return s;
  },

  waterfall(labels, values, colors) {
    const N = values.length;
    let running = 0;
    const segs = values.map((v, i) => {
      const start = running;
      running += v;
      return { start, end: running, value: v, label: labels[i], color: colors[i] };
    });
    const allVals = segs.flatMap((sg) => [sg.start, sg.end]);
    const min = Math.min(0, ...allVals);
    const max = Math.max(0, ...allVals);
    const range = max - min || 1;
    const sx = 35, W = 330, yBase = 195, H = 165;
    const segW = W / N;
    const scaleY = (v) => yBase - ((v - min) / range) * H;
    let s = "";
    if (min < 0 && max > 0) {
      s += `<line x1="${sx}" y1="${scaleY(0).toFixed(1)}" x2="${sx + W}" y2="${scaleY(0).toFixed(1)}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,2"/>`;
    }
    segs.forEach((sg, i) => {
      const x = sx + segW * i + 6;
      const top = scaleY(Math.max(sg.start, sg.end));
      const bot = scaleY(Math.min(sg.start, sg.end));
      const h = Math.max(2, bot - top);
      // 마지막 막대는 baseline부터 누적 결과까지 → 강조색
      const isLast = i === N - 1;
      const fill = isLast ? colors[i] : sg.value >= 0 ? colors[i] : "#dc2626";
      s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(segW - 12).toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}"/>`;
      if (i < N - 1) {
        const xRight = x + segW - 12;
        const xNext = sx + segW * (i + 1) + 6;
        const yLine = scaleY(sg.end);
        s += `<line x1="${xRight.toFixed(1)}" y1="${yLine.toFixed(1)}" x2="${xNext.toFixed(1)}" y2="${yLine.toFixed(1)}" stroke="#94a3b8" stroke-width="0.8" stroke-dasharray="2,2"/>`;
      }
      s += `<text x="${(x + (segW - 12) / 2).toFixed(1)}" y="${yBase + 16}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif">${_esc(sg.label)}</text>`;
      s += `<text x="${(x + (segW - 12) / 2).toFixed(1)}" y="${(top - 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#1f2937" font-family="sans-serif">${sg.value > 0 ? "+" : ""}${sg.value}</text>`;
    });
    return s;
  },

  bullet(labels, values, colors) {
    const target = Math.max(...values);
    const actual = values[0] || 0;
    const max = Math.max(target, ...values) * 1.2 || 1;
    const sx = 50, W = 300, y = 75, H = 75;
    const scaleX = (v) => sx + (v / max) * W;
    let s = "";
    s += `<rect x="${sx}" y="${y}" width="${W}" height="${H}" fill="#e5e7eb"/>`;
    if (values.length >= 2) {
      const mid = values[1];
      s += `<rect x="${sx}" y="${y}" width="${(scaleX(mid) - sx).toFixed(1)}" height="${H}" fill="#d1d5db"/>`;
    }
    const barW = scaleX(actual) - sx;
    s += `<rect x="${sx}" y="${y + 22}" width="${barW.toFixed(1)}" height="${H - 44}" fill="${colors[0]}"/>`;
    s += `<line x1="${scaleX(target).toFixed(1)}" y1="${y - 6}" x2="${scaleX(target).toFixed(1)}" y2="${y + H + 6}" stroke="#111827" stroke-width="3"/>`;
    s += `<text x="${scaleX(target).toFixed(1)}" y="${y - 12}" text-anchor="middle" font-size="11" fill="#111827" font-family="sans-serif">목표 ${target}</text>`;
    s += `<text x="${(sx + W / 2).toFixed(1)}" y="${y + H + 26}" text-anchor="middle" font-size="12" fill="#374151" font-family="sans-serif">${_esc(labels[0])}: ${actual}</text>`;
    return s;
  },

  bulletbar(labels, values, colors) {
    const max = Math.max(...values) * 1.3 || 1;
    const target = Math.max(...values);
    const sx = 90, W = 270;
    const N = values.length;
    const rowH = Math.min(28, (180 - (N - 1) * 6) / N);
    let s = "";
    values.forEach((v, i) => {
      const y = 25 + i * (rowH + 6);
      s += `<text x="80" y="${y + rowH / 2 + 4}" text-anchor="end" font-size="11" fill="#374151" font-family="sans-serif">${_esc(labels[i])}</text>`;
      s += `<rect x="${sx}" y="${y}" width="${W}" height="${rowH}" fill="#e5e7eb"/>`;
      const barW = (v / max) * W;
      s += `<rect x="${sx}" y="${y + 6}" width="${Math.max(2, barW).toFixed(1)}" height="${rowH - 12}" fill="${colors[i]}"/>`;
      const tx = sx + (target / max) * W;
      s += `<line x1="${tx.toFixed(1)}" y1="${y - 3}" x2="${tx.toFixed(1)}" y2="${y + rowH + 3}" stroke="#111827" stroke-width="2"/>`;
      s += `<text x="${(sx + barW + 6).toFixed(1)}" y="${y + rowH / 2 + 4}" font-size="11" fill="#374151" font-family="sans-serif">${v}</text>`;
    });
    return s;
  },

  marimekko(labels, values, colors) {
    const total = values.reduce((sum, v) => sum + Math.abs(v), 0) || 1;
    const maxV = Math.max(...values.map(Math.abs)) || 1;
    const W = 360, H = 180, sx = 20, sy = 20;
    let x = sx;
    let s = "";
    values.forEach((v, i) => {
      const colW = (Math.abs(v) / total) * W;
      const h = (Math.abs(v) / maxV) * H;
      s += `<rect x="${x.toFixed(1)}" y="${(sy + (H - h)).toFixed(1)}" width="${(colW - 3).toFixed(1)}" height="${h.toFixed(1)}" fill="${colors[i]}"/>`;
      s += `<text x="${(x + colW / 2).toFixed(1)}" y="${sy + H + 18}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif">${_esc(labels[i])} (${v})</text>`;
      x += colW;
    });
    return s;
  },

  boxplot(labels, values, colors) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    const min = sorted[0];
    const max = sorted[n - 1];
    const median = sorted[Math.floor(n / 2)];
    const q1 = sorted[Math.floor(n / 4)];
    const q3 = sorted[Math.floor((3 * n) / 4)];
    const range = max - min || 1;
    const sx = 50, ex = 350, y = 80, h = 60;
    const scaleX = (v) => sx + ((v - min) / range) * (ex - sx);
    const color = colors[0];
    let s = "";
    s += `<line x1="${scaleX(min).toFixed(1)}" y1="${y + h / 2}" x2="${scaleX(max).toFixed(1)}" y2="${y + h / 2}" stroke="${color}" stroke-width="1.5"/>`;
    s += `<line x1="${scaleX(min).toFixed(1)}" y1="${y + 12}" x2="${scaleX(min).toFixed(1)}" y2="${y + h - 12}" stroke="${color}" stroke-width="2"/>`;
    s += `<line x1="${scaleX(max).toFixed(1)}" y1="${y + 12}" x2="${scaleX(max).toFixed(1)}" y2="${y + h - 12}" stroke="${color}" stroke-width="2"/>`;
    s += `<rect x="${scaleX(q1).toFixed(1)}" y="${y}" width="${(scaleX(q3) - scaleX(q1)).toFixed(1)}" height="${h}" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="2"/>`;
    s += `<line x1="${scaleX(median).toFixed(1)}" y1="${y}" x2="${scaleX(median).toFixed(1)}" y2="${y + h}" stroke="${color}" stroke-width="2.5"/>`;
    values.forEach((v) => {
      s += `<circle cx="${scaleX(v).toFixed(1)}" cy="${y + h / 2}" r="3" fill="${color}"/>`;
    });
    s += `<text x="200" y="180" text-anchor="middle" font-size="11" fill="#6b7280" font-family="sans-serif">min: ${min} · Q1: ${q1} · 중앙값: ${median} · Q3: ${q3} · max: ${max}</text>`;
    return s;
  },

  violin(labels, values, colors) {
    const cx = 200, topY = 30, botY = 190;
    const color = colors[0];
    const maxW = 80;
    const steps = 24;
    let pathR = `M ${cx},${topY}`;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const y = topY + t * (botY - topY);
      const x = Math.exp(-Math.pow((t - 0.5) * 3.2, 2)) * maxW;
      pathR += ` L ${(cx + x).toFixed(2)},${y.toFixed(2)}`;
    }
    let pathL = "";
    for (let i = steps - 1; i >= 0; i--) {
      const t = i / steps;
      const y = topY + t * (botY - topY);
      const x = Math.exp(-Math.pow((t - 0.5) * 3.2, 2)) * maxW;
      pathL += ` L ${(cx - x).toFixed(2)},${y.toFixed(2)}`;
    }
    let s = "";
    s += `<path d="${pathR}${pathL} Z" fill="${color}" fill-opacity="0.4" stroke="${color}" stroke-width="2"/>`;
    s += `<line x1="${cx}" y1="${topY}" x2="${cx}" y2="${botY}" stroke="${color}" stroke-width="1"/>`;
    const max = Math.max(...values.map(Math.abs)) || 1;
    values.forEach((v, i) => {
      const y = topY + (Math.abs(v) / max) * (botY - topY);
      s += `<circle cx="${cx}" cy="${y.toFixed(2)}" r="4" fill="${colors[i]}"/>`;
    });
    s += `<text x="${cx}" y="${botY + 18}" text-anchor="middle" font-size="11" fill="#6b7280" font-family="sans-serif">N = ${values.length}</text>`;
    return s;
  },

  waffle(labels, values, colors) {
    const total = values.reduce((sum, v) => sum + Math.abs(v), 0) || 1;
    let cumulative = 0;
    const thresholds = values.map((v) => {
      cumulative += (Math.abs(v) / total) * 100;
      return cumulative;
    });
    const cell = 14;
    const gap = 2;
    const gridW = 10 * cell + 9 * gap;
    const sx = 200 - gridW / 2;
    const sy = 20;
    let s = "";
    for (let i = 0; i < 100; i++) {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const pct = i + 1;
      let color = "#f3f4f6";
      for (let j = 0; j < thresholds.length; j++) {
        if (pct <= thresholds[j]) {
          color = colors[j];
          break;
        }
      }
      s += `<rect x="${sx + col * (cell + gap)}" y="${sy + row * (cell + gap)}" width="${cell}" height="${cell}" fill="${color}" rx="1"/>`;
    }
    // Legend
    const legY = sy + 10 * (cell + gap) + 8;
    values.forEach((v, i) => {
      const lx = sx + i * 70;
      s += `<rect x="${lx}" y="${legY}" width="10" height="10" fill="${colors[i]}"/>`;
      s += `<text x="${lx + 14}" y="${legY + 9}" font-size="10" fill="#374151" font-family="sans-serif">${_esc(labels[i])} ${((v / total) * 100).toFixed(0)}%</text>`;
    });
    return s;
  },

  gauge(labels, values, colors) {
    const val = values[0] || 0;
    const max = Math.max(...values, 100);
    const ratio = Math.max(0, Math.min(1, Math.abs(val) / max));
    const cx = 200, cy = 145, r = 90;
    let s = "";
    s += `<path d="M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}" stroke="#e5e7eb" stroke-width="22" fill="none"/>`;
    const angle = Math.PI * ratio;
    const endX = cx - r * Math.cos(angle);
    const endY = cy - r * Math.sin(angle);
    const largeArc = ratio > 0.5 ? 1 : 0;
    s += `<path d="M ${cx - r},${cy} A ${r},${r} 0 ${largeArc} 1 ${endX.toFixed(2)},${endY.toFixed(2)}" stroke="${colors[0]}" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    const nX = cx - (r - 12) * Math.cos(angle);
    const nY = cy - (r - 12) * Math.sin(angle);
    s += `<line x1="${cx}" y1="${cy}" x2="${nX.toFixed(2)}" y2="${nY.toFixed(2)}" stroke="#111827" stroke-width="3" stroke-linecap="round"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="7" fill="#111827"/>`;
    s += `<text x="${cx}" y="${cy + 32}" text-anchor="middle" font-size="28" font-weight="700" fill="#111827" font-family="sans-serif">${val}</text>`;
    s += `<text x="${cx}" y="${cy + 50}" text-anchor="middle" font-size="12" fill="#6b7280" font-family="sans-serif">${_esc(labels[0] || "값")}</text>`;
    return s;
  },

  wordcloud(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const positions = [
      { x: 200, y: 110 },
      { x: 100, y: 70 },
      { x: 300, y: 80 },
      { x: 140, y: 170 },
      { x: 290, y: 175 }
    ];
    let s = "";
    values.forEach((v, i) => {
      const p = positions[i % positions.length];
      const size = 14 + (Math.abs(v) / max) * 32;
      s += `<text x="${p.x}" y="${p.y}" text-anchor="middle" font-size="${size.toFixed(1)}" font-weight="700" fill="${colors[i]}" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  sunburst(labels, values, colors) {
    const total = values.reduce((sum, v) => sum + Math.abs(v), 0) || 1;
    const cx = 200, cy = 115, rIn = 30, rOut = 90;
    let startAng = -Math.PI / 2;
    let s = `<circle cx="${cx}" cy="${cy}" r="${rIn - 1}" fill="#fff" stroke="#e5e7eb" stroke-width="1"/>`;
    values.forEach((v, i) => {
      const sweep = (Math.abs(v) / total) * 2 * Math.PI;
      const endAng = startAng + sweep;
      const largeArc = sweep > Math.PI ? 1 : 0;
      const x1 = cx + rOut * Math.cos(startAng);
      const y1 = cy + rOut * Math.sin(startAng);
      const x2 = cx + rOut * Math.cos(endAng);
      const y2 = cy + rOut * Math.sin(endAng);
      const x3 = cx + rIn * Math.cos(endAng);
      const y3 = cy + rIn * Math.sin(endAng);
      const x4 = cx + rIn * Math.cos(startAng);
      const y4 = cy + rIn * Math.sin(startAng);
      s += `<path d="M ${x1.toFixed(2)},${y1.toFixed(2)} A ${rOut},${rOut} 0 ${largeArc} 1 ${x2.toFixed(2)},${y2.toFixed(2)} L ${x3.toFixed(2)},${y3.toFixed(2)} A ${rIn},${rIn} 0 ${largeArc} 0 ${x4.toFixed(2)},${y4.toFixed(2)} Z" fill="${colors[i]}" stroke="#fff" stroke-width="1.5"/>`;
      const midAng = (startAng + endAng) / 2;
      const lx = cx + (rOut + 16) * Math.cos(midAng);
      const ly = cy + (rOut + 16) * Math.sin(midAng);
      s += `<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif">${_esc(labels[i])}</text>`;
      startAng = endAng;
    });
    return s;
  },

  orgchart(labels, values, colors) {
    const N = values.length;
    if (N === 0) return "";
    let s = "";
    const topCX = 200, topY = 45;
    s += `<rect x="${topCX - 55}" y="${topY - 22}" width="110" height="44" fill="${colors[0]}" rx="5"/>`;
    s += `<text x="${topCX}" y="${topY - 2}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(labels[0])}</text>`;
    s += `<text x="${topCX}" y="${topY + 14}" text-anchor="middle" font-size="11" fill="#fff" font-family="sans-serif">${values[0]}</text>`;
    if (N > 1) {
      const Nb = N - 1;
      const yBot = 165;
      const spanW = 340;
      for (let i = 0; i < Nb; i++) {
        const bx = 30 + (spanW / Math.max(1, Nb)) * (i + 0.5);
        s += `<line x1="${topCX}" y1="${topY + 22}" x2="${bx.toFixed(1)}" y2="${yBot - 22}" stroke="#9ca3af" stroke-width="1.5"/>`;
        s += `<rect x="${(bx - 45).toFixed(1)}" y="${yBot - 22}" width="90" height="44" fill="${colors[i + 1]}" rx="5"/>`;
        s += `<text x="${bx.toFixed(1)}" y="${yBot - 2}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(labels[i + 1])}</text>`;
        s += `<text x="${bx.toFixed(1)}" y="${yBot + 14}" text-anchor="middle" font-size="11" fill="#fff" font-family="sans-serif">${values[i + 1]}</text>`;
      }
    }
    return s;
  },

  network(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const cx = 200, cy = 115, r = 75;
    const pos = [];
    for (let i = 0; i < N; i++) {
      const ang = -Math.PI / 2 + (i / N) * 2 * Math.PI;
      pos.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
    }
    let s = "";
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        s += `<line x1="${pos[i].x.toFixed(2)}" y1="${pos[i].y.toFixed(2)}" x2="${pos[j].x.toFixed(2)}" y2="${pos[j].y.toFixed(2)}" stroke="#cbd5e1" stroke-width="1"/>`;
      }
    }
    values.forEach((v, i) => {
      const size = 14 + (Math.abs(v) / max) * 16;
      s += `<circle cx="${pos[i].x.toFixed(2)}" cy="${pos[i].y.toFixed(2)}" r="${size}" fill="${colors[i]}"/>`;
      s += `<text x="${pos[i].x.toFixed(2)}" y="${(pos[i].y + 4).toFixed(2)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  matrix(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    let s = "";
    s += `<rect x="20" y="20" width="180" height="90" fill="#fef3f2" stroke="#e5e7eb"/>`;
    s += `<rect x="200" y="20" width="180" height="90" fill="#f0f9ff" stroke="#e5e7eb"/>`;
    s += `<rect x="20" y="110" width="180" height="90" fill="#fefce8" stroke="#e5e7eb"/>`;
    s += `<rect x="200" y="110" width="180" height="90" fill="#f0fdf4" stroke="#e5e7eb"/>`;
    s += `<line x1="200" y1="20" x2="200" y2="200" stroke="#9ca3af" stroke-width="1.5"/>`;
    s += `<line x1="20" y1="110" x2="380" y2="110" stroke="#9ca3af" stroke-width="1.5"/>`;
    values.forEach((v, i) => {
      const t = N > 1 ? i / (N - 1) : 0.5;
      const x = 35 + t * 330;
      const y = 35 + (1 - Math.abs(v) / max) * 150;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${colors[i]}" stroke="#fff" stroke-width="2"/>`;
      s += `<text x="${x.toFixed(1)}" y="${(y + 24).toFixed(1)}" text-anchor="middle" font-size="11" fill="#1f2937" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  chord(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const cx = 200, cy = 115, r = 85;
    const pos = [];
    for (let i = 0; i < N; i++) {
      const ang = -Math.PI / 2 + (i / N) * 2 * Math.PI;
      pos.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
    }
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="2"/>`;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const w = ((Math.abs(values[i]) + Math.abs(values[j])) / (max * 2)) * 5 + 1;
        s += `<path d="M ${pos[i].x.toFixed(2)},${pos[i].y.toFixed(2)} Q ${cx},${cy} ${pos[j].x.toFixed(2)},${pos[j].y.toFixed(2)}" stroke="${colors[i]}" stroke-width="${w.toFixed(2)}" fill="none" stroke-opacity="0.5"/>`;
      }
    }
    pos.forEach((p, i) => {
      s += `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="9" fill="${colors[i]}"/>`;
      const ang = Math.atan2(p.y - cy, p.x - cx);
      const lx = cx + (r + 20) * Math.cos(ang);
      const ly = cy + (r + 20) * Math.sin(ang);
      s += `<text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" font-size="11" fill="#374151" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  regions(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const shapes = [
      "30,30 120,20 160,90 130,170 50,180 20,100",
      "180,20 290,30 320,110 280,200 200,180 170,90",
      "330,30 390,80 380,170 320,210 290,120",
      "30,200 120,180 160,250 60,280",
      "180,200 290,210 340,250 240,290"
    ];
    let s = "";
    values.forEach((v, i) => {
      if (i >= shapes.length) return;
      const op = 0.35 + 0.65 * (Math.abs(v) / max);
      s += `<polygon points="${shapes[i]}" fill="${colors[i]}" fill-opacity="${op}" stroke="#fff" stroke-width="2"/>`;
      const coords = shapes[i].split(" ").map((p) => p.split(",").map(Number));
      const cx = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const cy = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
      s += `<text x="${cx.toFixed(0)}" y="${cy.toFixed(0)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(labels[i])}</text>`;
      s += `<text x="${cx.toFixed(0)}" y="${(cy + 14).toFixed(0)}" text-anchor="middle" font-size="10" fill="#fff" font-family="sans-serif">${v}</text>`;
    });
    return s;
  },

  flowmap(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const positions = [
      [60, 70], [150, 40], [280, 55], [340, 130], [200, 175], [80, 175], [320, 175]
    ];
    let s = `<rect x="10" y="10" width="380" height="205" fill="#f0fdf4" rx="6"/>`;
    if (N >= 2) {
      const [x0, y0] = positions[0];
      for (let i = 1; i < N; i++) {
        const [x1, y1] = positions[i % positions.length];
        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2 - 30;
        const w = 1 + (Math.abs(values[i]) / max) * 4;
        s += `<path d="M ${x0},${y0} Q ${mx},${my} ${x1},${y1}" stroke="${colors[i]}" stroke-width="${w}" fill="none" stroke-opacity="0.7"/>`;
        const ang = Math.atan2(y1 - my, x1 - mx);
        const aLx = x1 - 10 * Math.cos(ang - 0.4);
        const aLy = y1 - 10 * Math.sin(ang - 0.4);
        const aRx = x1 - 10 * Math.cos(ang + 0.4);
        const aRy = y1 - 10 * Math.sin(ang + 0.4);
        s += `<polygon points="${x1},${y1} ${aLx.toFixed(1)},${aLy.toFixed(1)} ${aRx.toFixed(1)},${aRy.toFixed(1)}" fill="${colors[i]}"/>`;
      }
    }
    for (let i = 0; i < N && i < positions.length; i++) {
      const [px, py] = positions[i];
      s += `<circle cx="${px}" cy="${py}" r="5" fill="${colors[i]}" stroke="#fff" stroke-width="2"/>`;
      s += `<text x="${px}" y="${py - 10}" text-anchor="middle" font-size="10" font-weight="700" fill="#1f2937" font-family="sans-serif">${_esc(labels[i])}</text>`;
    }
    return s;
  },

  candlestick(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const sx = 50, W = 300, yBase = 195;
    const spacing = W / N;
    let s = "";
    values.forEach((v, i) => {
      const x = sx + spacing * (i + 0.5);
      const h = (Math.abs(v) / max) * 145;
      const top = yBase - h;
      const prev = i > 0 ? values[i - 1] : v;
      const rising = v >= prev;
      const color = rising ? "#16a34a" : "#dc2626";
      s += `<line x1="${x.toFixed(1)}" y1="${(top - 8).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(yBase + 6).toFixed(1)}" stroke="${color}" stroke-width="1.5"/>`;
      const bH = Math.max(10, h * 0.55);
      const bTop = rising ? top + 5 : top + (h - bH) / 2;
      s += `<rect x="${(x - 10).toFixed(1)}" y="${bTop.toFixed(1)}" width="20" height="${bH.toFixed(1)}" fill="${color}"/>`;
      s += `<text x="${x.toFixed(1)}" y="${yBase + 18}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  ohlc(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const sx = 50, W = 300, yBase = 195;
    const spacing = W / N;
    let s = "";
    values.forEach((v, i) => {
      const x = sx + spacing * (i + 0.5);
      const h = (Math.abs(v) / max) * 145;
      const top = yBase - h;
      const color = colors[i];
      s += `<line x1="${x.toFixed(1)}" y1="${(top - 6).toFixed(1)}" x2="${x.toFixed(1)}" y2="${yBase.toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
      s += `<line x1="${(x - 8).toFixed(1)}" y1="${(top + h * 0.3).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(top + h * 0.3).toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
      s += `<line x1="${x.toFixed(1)}" y1="${(top + h * 0.7).toFixed(1)}" x2="${(x + 8).toFixed(1)}" y2="${(top + h * 0.7).toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
      s += `<text x="${x.toFixed(1)}" y="${yBase + 16}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    return s;
  },

  pictogram(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const sx = 40, totalW = 320;
    const spacing = totalW / N;
    let s = "";
    values.forEach((v, i) => {
      const x = sx + spacing * (i + 0.5);
      const intensity = Math.abs(v) / max;
      const sz = 35 + intensity * 30;
      const color = colors[i];
      s += `<circle cx="${x.toFixed(1)}" cy="40" r="${(sz * 0.28).toFixed(1)}" fill="${color}"/>`;
      s += `<path d="M ${(x - sz * 0.42).toFixed(1)},${(40 + sz * 0.95).toFixed(1)} Q ${(x - sz * 0.42).toFixed(1)},${(40 + sz * 0.5).toFixed(1)} ${x.toFixed(1)},${(40 + sz * 0.5).toFixed(1)} Q ${(x + sz * 0.42).toFixed(1)},${(40 + sz * 0.5).toFixed(1)} ${(x + sz * 0.42).toFixed(1)},${(40 + sz * 0.95).toFixed(1)} Z" fill="${color}"/>`;
      s += `<text x="${x.toFixed(1)}" y="${(45 + sz + 22).toFixed(1)}" text-anchor="middle" font-size="11" fill="#374151" font-family="sans-serif">${_esc(labels[i])}</text>`;
      s += `<text x="${x.toFixed(1)}" y="${(45 + sz + 38).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="${color}" font-family="sans-serif">${v}</text>`;
    });
    return s;
  },

  ratio(labels, values, colors) {
    const total = values.reduce((sum, v) => sum + Math.abs(v), 0) || 1;
    const sx = 30, ex = 370, y = 75, h = 60;
    let curX = sx;
    let s = "";
    values.forEach((v, i) => {
      const w = (Math.abs(v) / total) * (ex - sx);
      s += `<rect x="${curX.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" fill="${colors[i]}"/>`;
      if (w > 30) {
        s += `<text x="${(curX + w / 2).toFixed(1)}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" font-family="sans-serif">${((Math.abs(v) / total) * 100).toFixed(0)}%</text>`;
      }
      curX += w;
    });
    let lx = sx;
    values.forEach((v, i) => {
      s += `<rect x="${lx}" y="155" width="10" height="10" fill="${colors[i]}"/>`;
      s += `<text x="${lx + 14}" y="164" font-size="11" fill="#374151" font-family="sans-serif">${_esc(labels[i])} (${v})</text>`;
      lx += 70;
    });
    return s;
  },

  squarepie(labels, values, colors) {
    const total = values.reduce((sum, v) => sum + Math.abs(v), 0) || 1;
    const items = values
      .map((v, i) => ({ v: Math.abs(v), orig: v, label: labels[i], color: colors[i] }))
      .sort((a, b) => b.v - a.v);
    let x = 20, y = 20;
    let rowMaxH = 0;
    let s = "";
    items.forEach((it) => {
      const side = Math.max(35, Math.sqrt(it.v / total) * 200);
      if (x + side > 380) {
        x = 20;
        y += rowMaxH + 6;
        rowMaxH = 0;
      }
      s += `<rect x="${x.toFixed(1)}" y="${y}" width="${side.toFixed(1)}" height="${side.toFixed(1)}" fill="${it.color}" stroke="#fff" stroke-width="2"/>`;
      if (side > 40) {
        s += `<text x="${(x + side / 2).toFixed(1)}" y="${y + side / 2 + 4}" text-anchor="middle" font-size="${Math.min(14, side / 6).toFixed(1)}" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(it.label)}</text>`;
      }
      x += side + 6;
      if (side > rowMaxH) rowMaxH = side;
    });
    return s;
  },

  combo(labels, values, colors) {
    const max = Math.max(...values.map(Math.abs)) || 1;
    const N = values.length;
    const sx = 40, W = 320, yBase = 195, H = 160;
    const slot = W / N;
    const barW = slot * 0.55;
    let s = "";
    const points = [];
    values.forEach((v, i) => {
      const cx = sx + slot * (i + 0.5);
      const h = (Math.abs(v) / max) * H;
      const y = yBase - h;
      s += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" fill="${colors[i]}" fill-opacity="0.55"/>`;
      points.push({ x: cx, y });
      s += `<text x="${cx.toFixed(1)}" y="${yBase + 16}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${_esc(labels[i])}</text>`;
    });
    const poly = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    s += `<polyline points="${poly}" stroke="#dc2626" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    points.forEach((p) => {
      s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#dc2626"/>`;
    });
    return s;
  },

  dashcard(labels, values, colors) {
    const big = values[0] ?? "—";
    const bigLabel = labels[0] || "값";
    const accent = colors[0];
    let s = "";
    s += `<rect x="15" y="15" width="370" height="195" fill="#f9fafb" stroke="${accent}" stroke-width="2" rx="10"/>`;
    s += `<text x="40" y="55" font-size="14" fill="#6b7280" font-family="sans-serif">${_esc(bigLabel)}</text>`;
    s += `<text x="40" y="115" font-size="46" font-weight="700" fill="${accent}" font-family="sans-serif">${big}</text>`;
    const rest = values.slice(1);
    if (rest.length > 0) {
      const mx = Math.max(...rest.map(Math.abs)) || 1;
      const mn = Math.min(...rest);
      const range = mx - mn || 1;
      const px = (i) => 40 + i * (320 / Math.max(1, rest.length - 1));
      const py = (v) => 190 - ((v - mn) / range) * 50;
      const points = rest.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
      s += `<polyline points="${points}" stroke="${colors[1] || accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      rest.forEach((v, i) => {
        s += `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="2.5" fill="${colors[i + 1] || accent}"/>`;
      });
    }
    return s;
  }
};

// ===========================================
// 5. UI 상태 전환
// ===========================================
function resetToForm() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  lastSVGString = null;
  document.getElementById("builderCanvas").style.opacity = "0";
  const svgContainer = document.getElementById("chart-container");
  if (svgContainer) {
    svgContainer.style.display = "none";
    svgContainer.innerHTML = "";
  }
  document.getElementById("builderPlaceholder").style.display = "flex";
  document.getElementById("formButtons").style.display = "flex";
  document.getElementById("chartButtons").style.display = "none";
}

function downloadImage() {
  if (chartInstance) {
    const link = document.createElement("a");
    link.download = `${chart.id}.png`;
    link.href = chartInstance.toBase64Image();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  if (lastSVGString) {
    const blob = new Blob([lastSVGString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 450;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.download = `${chart.id}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    img.onerror = function () {
      console.error("SVG → PNG 변환 실패");
      alert("이미지 저장에 실패했습니다");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }
}

// ===========================================
// 6. 복합 차트 모드
// ===========================================
function handleMixToggle() {
  const checked = document.getElementById("mixedModeToggle").checked;
  const settings = document.getElementById("mixedSettings");
  if (checked) {
    settings.style.display = "flex";
    populateMixDropdown();
  } else {
    settings.style.display = "none";
    document.getElementById("mixForm").style.display = "none";
    document.getElementById("mixButtonRow").style.display = "none";
  }
}

function populateMixDropdown() {
  const select = document.getElementById("mixChartSelect");
  const notice = document.getElementById("mixIncompatibleNotice");
  select.innerHTML = '<option value="">선택해주세요</option>';

  const compat = chart.compatibleWith || [];
  if (compat.length === 0) {
    select.disabled = true;
    notice.textContent = "이 차트는 단독 사용만 가능합니다.";
    notice.style.display = "block";
    return;
  }

  const candidates = CHARTS.filter((c) => {
    if (c.id === chart.id) return false;
    const route = CHART_RENDER_MAP[c.id];
    if (!route || route.engine !== "chartjs") return false;
    return compat.includes(route.type);
  });

  if (candidates.length === 0) {
    select.disabled = true;
    notice.textContent = "호환 가능한 차트가 없습니다.";
    notice.style.display = "block";
    return;
  }

  select.disabled = false;
  notice.style.display = "none";
  candidates.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.category})`;
    select.appendChild(opt);
  });
}

function handleMixSelectChange() {
  const selectedId = document.getElementById("mixChartSelect").value;
  const form = document.getElementById("mixForm");
  const btnRow = document.getElementById("mixButtonRow");
  if (selectedId) {
    form.style.display = "";
    btnRow.style.display = "flex";
  } else {
    form.style.display = "none";
    btnRow.style.display = "none";
  }
}

function readMixForm() {
  const labelEls = document.querySelectorAll('[data-mixfield="label"]');
  const valueEls = document.querySelectorAll('[data-mixfield="value"]');
  const colorEls = document.querySelectorAll('[data-mixfield="color"]');
  const rows = [];
  for (let i = 0; i < labelEls.length; i++) {
    rows.push({
      label: labelEls[i].value.trim(),
      value: valueEls[i].value,
      color: colorEls[i].value
    });
  }
  return rows;
}

function _buildMixedDataset(type, name, valid, options) {
  const values = valid.map((r) => parseFloat(r.value));
  const colors = valid.map((r) => r.color);
  if (type === "bubble") {
    const max = Math.max(...values.map(Math.abs)) || 1;
    return {
      type: "bubble",
      label: name,
      data: values.map((v, i) => ({
        x: i + 1,
        y: v,
        r: 6 + (Math.abs(v) / max) * 18
      })),
      backgroundColor: colors.map((c) => c + "B3"),
      borderColor: colors,
      borderWidth: 1
    };
  }
  if (type === "scatter") {
    return {
      type: "scatter",
      label: name,
      data: values.map((v, i) => ({ x: i + 1, y: v })),
      backgroundColor: colors,
      borderColor: colors,
      pointRadius: 6
    };
  }
  if (type === "line") {
    return {
      type: "line",
      label: name,
      data: values,
      backgroundColor: colors[0] + "40",
      borderColor: colors[0],
      borderWidth: 3,
      pointBackgroundColor: colors,
      fill: options.fill || false,
      tension: 0.1
    };
  }
  // bar
  return {
    type: "bar",
    label: name,
    data: values,
    backgroundColor: colors,
    borderColor: colors,
    borderWidth: 1
  };
}

function renderChartMixed() {
  const selectedId = document.getElementById("mixChartSelect").value;
  if (!selectedId) {
    alert("섞을 차트를 선택해주세요");
    return;
  }

  const isValid = (r) => r.label !== "" && r.value !== "" && !isNaN(parseFloat(r.value));
  const primaryValid = readForm().filter(isValid);
  const secondaryValid = readMixForm().filter(isValid);

  if (primaryValid.length === 0) {
    alert("기본 차트 데이터를 입력해주세요");
    return;
  }
  if (secondaryValid.length === 0) {
    alert("추가 차트 데이터를 입력해주세요");
    return;
  }

  const primaryRoute = CHART_RENDER_MAP[chart.id] || { type: "bar" };
  const secRoute = CHART_RENDER_MAP[selectedId];
  if (!secRoute || secRoute.engine !== "chartjs") {
    alert("이 차트는 복합으로 섞을 수 없습니다");
    return;
  }
  const secChart = CHARTS.find((c) => c.id === selectedId);

  try {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    lastSVGString = null;
    const svgContainer = document.getElementById("chart-container");
    if (svgContainer) svgContainer.style.display = "none";

    const labels = primaryValid.map((r) => r.label);
    const datasets = [
      _buildMixedDataset(primaryRoute.type, chart.name, primaryValid, primaryRoute),
      _buildMixedDataset(secRoute.type, secChart.name, secondaryValid, secRoute)
    ];

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: {
        legend: { display: true },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const unit = ctx.datasetIndex === 0 ? getUnit(false) : getUnit(true);
              const val = ctx.parsed?.y ?? ctx.parsed;
              return unit
                ? `${ctx.dataset.label}: ${val} ${unit}`
                : `${ctx.dataset.label}: ${val}`;
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (val) => {
              const u = getUnit(false);
              return u ? `${val} ${u}` : val;
            }
          }
        }
      }
    };
    if (primaryRoute.indexAxis) options.indexAxis = primaryRoute.indexAxis;

    const canvas = document.getElementById("builderCanvas");
    chartInstance = new Chart(canvas, {
      type: primaryRoute.type,
      data: { labels, datasets },
      options
    });

    canvas.style.opacity = "0";
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });
    switchToChartState();
  } catch (err) {
    console.error("복합 차트 렌더링 실패:", err);
    showError("차트를 그릴 수 없습니다");
  }
}

// ===========================================
// 7. 보안 유틸
// ===========================================

// 보안 유틸: 외부 저장소(localStorage/URL 파라미터 등)에서 읽은 문자열을 DOM에 넣기 전 이스케이프
function sanitize(str) {
  const div = document.createElement("div");
  div.textContent = String(str ?? "");
  return div.innerHTML;
}

// 보안 유틸: 광고/외부 링크 클릭 시 화이트리스트 URL만 새 창으로 열기
function safeRedirect(url) {
  const allowed = ["https://www.google.com"];
  if (typeof url === "string" && allowed.some((a) => url.startsWith(a))) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
