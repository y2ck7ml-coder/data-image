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
  applyInputTypeUI();
  document.getElementById("loadSampleBtn").addEventListener("click", loadSample);
  document.getElementById("renderBtn").addEventListener("click", renderChart);
  document.getElementById("resetBtn").addEventListener("click", resetToForm);

  document.getElementById("mixedModeToggle").addEventListener("change", handleMixToggle);
  document.getElementById("mixChartSelect").addEventListener("change", handleMixSelectChange);
  document.getElementById("mixRenderBtn").addEventListener("click", renderChartMixed);

  document.getElementById("unitSelect").addEventListener("change", () => handleUnitToggle(false));
  document.getElementById("mixUnitSelect").addEventListener("change", () => handleUnitToggle(true));

  // 내보내기 버튼
  const exp = document.getElementById("export-section");
  if (exp) {
    exp.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-export]");
      if (!btn) return;
      const kind = btn.dataset.export;
      if (kind === "jpg" || kind === "png") exportImage(kind);
      else if (kind === "svg") exportSVG();
      else if (kind === "sheets") exportGoogleSheets();
      else if (kind === "docs") exportGoogleDocs();
    });
  }
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
  // exampleData(차트별 맞춤 예시)가 있으면 우선 사용, 없으면 기존 sampleData
  const labels =
    chart.exampleData?.labels ||
    chart.sampleData?.labels ||
    [];
  const values =
    chart.exampleData?.values ||
    chart.sampleData?.datasets?.[0]?.data ||
    [];
  document.querySelectorAll('[data-field="label"]').forEach((el, i) => {
    el.value = labels[i] ?? "";
  });
  document.querySelectorAll('[data-field="value"]').forEach((el, i) => {
    el.value = values[i] ?? "";
  });
}

// 입력 색상 팔레트 (5행 기준)
const DEFAULT_COLORS = ["#2563EB", "#60A5FA", "#93C5FD", "#F59E0B", "#10B981"];

// inputType별 입력 스키마: 각 그래프 유형에 맞는 입력 필드 정의
// 'generic' 계열(numeric/ratio/timeseries/relational/flow/distribution/multiaxis)은
// 기존 label+value+color 구조를 유지하되 헤더 텍스트만 다르게 노출
const INPUT_TYPE_SCHEMAS = {
  numeric: {
    rowCount: 5,
    hint: "항목명과 수치를 입력하세요. (예: 1월 / 320)",
    fields: [
      { key: "label", label: "데이터 명칭", inputType: "text" },
      { key: "value", label: "숫자 데이터", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  ratio: {
    rowCount: 5,
    hint: "전체에서 차지하는 비율이나 수량을 입력하세요.",
    fields: [
      { key: "label", label: "항목 명칭", inputType: "text" },
      { key: "value", label: "비율 / 수량", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  timeseries: {
    rowCount: 5,
    hint: "시간 순서대로 날짜·기간과 그에 해당하는 수치를 입력하세요.",
    fields: [
      { key: "label", label: "날짜 / 기간", inputType: "text" },
      { key: "value", label: "수치", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  relational: {
    rowCount: 5,
    hint: "중심 주제에 연결되는 항목을 입력하세요. 비중은 노드 크기에 사용됩니다.",
    fields: [
      { key: "label", label: "노드 명칭", inputType: "text" },
      { key: "value", label: "비중 (선택)", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  flow: {
    rowCount: 5,
    hint: "흐름의 순서대로 단계명을 입력하세요. 수치는 단계의 크기/값입니다.",
    fields: [
      { key: "label", label: "단계 / 노드", inputType: "text" },
      { key: "value", label: "수치 (선택)", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  distribution: {
    rowCount: 5,
    hint: "구간이나 그룹별 빈도/측정값을 입력하세요.",
    fields: [
      { key: "label", label: "구간 / 그룹", inputType: "text" },
      { key: "value", label: "빈도 / 수치", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  multiaxis: {
    rowCount: 5,
    hint: "비교할 항목과 대표 수치를 5개 정도 입력하세요.",
    fields: [
      { key: "label", label: "항목 명칭", inputType: "text" },
      { key: "value", label: "주요 수치", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },

  // ===== 특화 입력 스키마 =====
  ohlc: {
    rowCount: 5,
    rowLabel: (i) => `${i + 1}번째 일자`,
    hint: "날짜와 시가/고가/저가/종가(OHLC) 4개 가격을 입력하세요.",
    fields: [
      { key: "date", label: "날짜", inputType: "text", placeholder: "예: 1/15" },
      { key: "open", label: "시가", inputType: "number" },
      { key: "high", label: "고가", inputType: "number" },
      { key: "low", label: "저가", inputType: "number" },
      { key: "close", label: "종가", inputType: "number" }
    ]
  },
  bollinger: {
    rowCount: 5,
    rowLabel: (i) => `${i + 1}번째 일자`,
    hint: "날짜와 종가/이동평균/상단·하단 밴드 값을 입력하세요.",
    fields: [
      { key: "date", label: "날짜", inputType: "text" },
      { key: "close", label: "종가", inputType: "number" },
      { key: "ma", label: "이동평균", inputType: "number" },
      { key: "upper", label: "상단 밴드", inputType: "number" },
      { key: "lower", label: "하단 밴드", inputType: "number" }
    ]
  },
  boxplot: {
    rowCount: 4,
    rowLabel: (i) => `그룹 ${i + 1}`,
    hint: "그룹별 최솟값/Q1/중앙값/Q3/최댓값을 입력하세요.",
    fields: [
      { key: "label", label: "그룹명", inputType: "text" },
      { key: "min", label: "최솟값", inputType: "number" },
      { key: "q1", label: "Q1", inputType: "number" },
      { key: "median", label: "중앙값", inputType: "number" },
      { key: "q3", label: "Q3", inputType: "number" },
      { key: "max", label: "최댓값", inputType: "number" }
    ]
  },
  qqplot: {
    rowCount: 8,
    rowLabel: (i) => `데이터 ${i + 1}`,
    hint: "이론값(X)과 실제 관측값(Y) 쌍을 여러 개 입력하세요.",
    fields: [
      { key: "x", label: "이론값(X)", inputType: "number" },
      { key: "y", label: "관측값(Y)", inputType: "number" }
    ]
  },
  heatmap: {
    rowCount: 9,
    rowLabel: (i) => `셀 ${i + 1}`,
    hint: "행/열 레이블과 셀 수치를 입력하세요. (최소 3×3)",
    fields: [
      { key: "row", label: "행 레이블", inputType: "text" },
      { key: "col", label: "열 레이블", inputType: "text" },
      { key: "value", label: "수치", inputType: "number" }
    ]
  },
  survival: {
    rowCount: 6,
    rowLabel: (i) => `시점 ${i + 1}`,
    hint: "시간 포인트와 생존율, 이벤트 발생 여부를 입력하세요.",
    fields: [
      { key: "time", label: "시간(개월)", inputType: "text" },
      { key: "rate", label: "생존율(%)", inputType: "number" },
      { key: "event", label: "이벤트(0/1)", inputType: "number" }
    ]
  },
  waterfall: {
    rowCount: 5,
    rowLabel: (i) => `항목 ${i + 1}`,
    hint: "항목명과 증감값(양수=증가, 음수=감소)을 입력하세요.",
    fields: [
      { key: "label", label: "항목명", inputType: "text" },
      { key: "value", label: "증감값", inputType: "number" },
      { key: "color", label: "색상", inputType: "color" }
    ]
  },
  lorenz: {
    rowCount: 6,
    rowLabel: (i) => `구간 ${i + 1}`,
    hint: "누적 인구 비율(%)과 그 시점의 누적 소득 비율(%)을 입력하세요.",
    fields: [
      { key: "popPct", label: "누적 인구 %", inputType: "number" },
      { key: "incomePct", label: "누적 소득 %", inputType: "number" }
    ]
  },
  curve: {
    rowCount: 6,
    rowLabel: (i) => `가격 ${i + 1}`,
    hint: "X축 값과 두 곡선(예: 수요·공급)의 Y값을 입력하세요.",
    fields: [
      { key: "x", label: "X축 값", inputType: "number" },
      { key: "y1", label: "곡선 1 (Y)", inputType: "number" },
      { key: "y2", label: "곡선 2 (Y)", inputType: "number" }
    ]
  },
  pyramid: {
    rowCount: 6,
    rowLabel: (i) => `연령대 ${i + 1}`,
    hint: "연령대와 남성/여성 수치를 입력하세요.",
    fields: [
      { key: "age", label: "연령대", inputType: "text" },
      { key: "male", label: "남성", inputType: "number" },
      { key: "female", label: "여성", inputType: "number" }
    ]
  },
  likert: {
    rowCount: 4,
    rowLabel: (i) => `질문 ${i + 1}`,
    hint: "질문 항목명과 5점 척도 응답 비율(%)을 입력하세요.",
    fields: [
      { key: "label", label: "질문 항목", inputType: "text" },
      { key: "v1", label: "매우 부정 %", inputType: "number" },
      { key: "v2", label: "부정 %", inputType: "number" },
      { key: "v3", label: "중립 %", inputType: "number" },
      { key: "v4", label: "긍정 %", inputType: "number" },
      { key: "v5", label: "매우 긍정 %", inputType: "number" }
    ]
  },
  network: {
    rowCount: 6,
    rowLabel: (i) => `노드 ${i + 1}`,
    hint: "노드명과 연결된 노드명들(쉼표 구분)을 입력하세요.",
    fields: [
      { key: "node", label: "노드명", inputType: "text" },
      { key: "links", label: "연결 노드(쉼표 구분)", inputType: "text" }
    ]
  },
  timeline: {
    rowCount: 5,
    rowLabel: (i) => `이벤트 ${i + 1}`,
    hint: "연도/날짜와 사건명, 간단한 설명을 입력하세요.",
    fields: [
      { key: "date", label: "연도/날짜", inputType: "text" },
      { key: "event", label: "사건명", inputType: "text" },
      { key: "desc", label: "설명", inputType: "text" }
    ]
  },
  hierarchical: {
    rowCount: 6,
    rowLabel: (i) => `가지 ${i + 1}`,
    hint: "중심 주제와 1차 가지/2차 세부 항목을 입력하세요.",
    fields: [
      { key: "parent", label: "상위 (중심)", inputType: "text" },
      { key: "child", label: "1차 가지", inputType: "text" },
      { key: "leaf", label: "2차 세부", inputType: "text" }
    ]
  }
};

// chart.id → 입력 스키마 키 매핑(차트 객체의 inputType을 그대로 쓰지 않는 경우)
const INPUT_SCHEMA_OVERRIDES = {
  candlestick: "ohlc",
  ohlc: "ohlc",
  "bollinger-bands": "bollinger",
  boxplot: "boxplot",
  violin: "boxplot",
  "qq-plot": "qqplot",
  "residual-plot": "qqplot",
  heatmap: "heatmap",
  "correlation-heatmap": "heatmap",
  "correlation-matrix": "heatmap",
  "cohort-chart": "heatmap",
  "kaplan-meier": "survival",
  waterfall: "waterfall",
  "waterfall-finance": "waterfall",
  cascade: "waterfall",
  "lorenz-curve": "lorenz",
  "gini-index": "lorenz",
  "supply-demand": "curve",
  "phillips-curve": "curve",
  "ppf-curve": "curve",
  pyramid: "pyramid",
  "population-pyramid": "pyramid",
  "age-gender-distribution": "pyramid",
  "likert-scale": "likert",
  "social-network": "network",
  sociogram: "network",
  "network-diagram": "network",
  "timeline-flow": "timeline",
  "timeline-text": "timeline",
  "mind-map": "hierarchical",
  "org-chart": "hierarchical",
  treemap: "hierarchical"
};

function getInputSchemaKey() {
  return INPUT_SCHEMA_OVERRIDES[chart.id] || chart.inputType || "numeric";
}

function getInputSchema() {
  const key = getInputSchemaKey();
  return INPUT_TYPE_SCHEMAS[key] || INPUT_TYPE_SCHEMAS.numeric;
}

// 차트별 의미 있는 예시 데이터(특화 inputType 전용)
const EXAMPLE_RICH = {
  candlestick: [
    { date: "1/15", open: 72000, high: 73200, low: 71500, close: 72900 },
    { date: "1/16", open: 72900, high: 74800, low: 72700, close: 74500 },
    { date: "1/17", open: 74500, high: 74900, low: 72900, close: 73200 },
    { date: "1/18", open: 73200, high: 76200, low: 73000, close: 75800 },
    { date: "1/19", open: 75800, high: 76500, low: 75500, close: 76100 }
  ],
  ohlc: [
    { date: "1일", open: 100, high: 108, low: 99, close: 105 },
    { date: "2일", open: 105, high: 114, low: 104, close: 112 },
    { date: "3일", open: 112, high: 113, low: 106, close: 108 },
    { date: "4일", open: 108, high: 120, low: 107, close: 118 },
    { date: "5일", open: 118, high: 124, low: 117, close: 121 }
  ],
  "bollinger-bands": [
    { date: "1일", close: 125, ma: 122, upper: 130, lower: 114 },
    { date: "2일", close: 130, ma: 124, upper: 132, lower: 116 },
    { date: "3일", close: 128, ma: 126, upper: 134, lower: 118 },
    { date: "4일", close: 135, ma: 129, upper: 138, lower: 120 },
    { date: "5일", close: 138, ma: 132, upper: 141, lower: 123 }
  ],
  boxplot: [
    { label: "A 그룹", min: 35, q1: 48, median: 55, q3: 62, max: 78 },
    { label: "B 그룹", min: 42, q1: 55, median: 62, q3: 70, max: 85 },
    { label: "C 그룹", min: 50, q1: 62, median: 70, q3: 78, max: 90 },
    { label: "D 그룹", min: 30, q1: 42, median: 48, q3: 58, max: 72 }
  ],
  violin: [
    { label: "대조군", min: 30, q1: 42, median: 50, q3: 58, max: 70 },
    { label: "실험 A", min: 40, q1: 55, median: 65, q3: 74, max: 85 },
    { label: "실험 B", min: 45, q1: 60, median: 72, q3: 80, max: 90 },
    { label: "실험 C", min: 38, q1: 52, median: 68, q3: 76, max: 88 }
  ],
  "qq-plot": [
    { x: -2, y: -1.85 }, { x: -1.5, y: -1.42 }, { x: -1, y: -0.92 },
    { x: -0.5, y: -0.48 }, { x: 0, y: 0.05 }, { x: 0.5, y: 0.52 },
    { x: 1, y: 0.88 }, { x: 1.5, y: 1.45 }
  ],
  "residual-plot": [
    { x: 10, y: 2.1 }, { x: 20, y: -1.4 }, { x: 30, y: 0.3 },
    { x: 40, y: -0.8 }, { x: 50, y: 1.6 }, { x: 60, y: -1.2 },
    { x: 70, y: 0.8 }, { x: 80, y: -0.5 }
  ],
  heatmap: [
    { row: "월", col: "오전", value: 80 }, { row: "월", col: "오후", value: 110 }, { row: "월", col: "저녁", value: 95 },
    { row: "화", col: "오전", value: 65 }, { row: "화", col: "오후", value: 120 }, { row: "화", col: "저녁", value: 100 },
    { row: "수", col: "오전", value: 70 }, { row: "수", col: "오후", value: 135 }, { row: "수", col: "저녁", value: 115 }
  ],
  "correlation-heatmap": [
    { row: "광고비", col: "매출", value: 85 }, { row: "광고비", col: "방문", value: 72 }, { row: "광고비", col: "회원", value: 55 },
    { row: "매출", col: "광고비", value: 85 }, { row: "매출", col: "방문", value: 78 }, { row: "매출", col: "회원", value: 65 },
    { row: "방문", col: "광고비", value: 72 }, { row: "방문", col: "매출", value: 78 }, { row: "방문", col: "회원", value: 60 }
  ],
  "correlation-matrix": [
    { row: "주식", col: "주식", value: 100 }, { row: "주식", col: "채권", value: -30 }, { row: "주식", col: "원자재", value: 45 },
    { row: "채권", col: "주식", value: -30 }, { row: "채권", col: "채권", value: 100 }, { row: "채권", col: "원자재", value: 15 },
    { row: "원자재", col: "주식", value: 45 }, { row: "원자재", col: "채권", value: 15 }, { row: "원자재", col: "원자재", value: 100 }
  ],
  "cohort-chart": [
    { row: "1월 가입", col: "1주", value: 100 }, { row: "1월 가입", col: "2주", value: 72 }, { row: "1월 가입", col: "4주", value: 55 },
    { row: "2월 가입", col: "1주", value: 100 }, { row: "2월 가입", col: "2주", value: 78 }, { row: "2월 가입", col: "4주", value: 62 },
    { row: "3월 가입", col: "1주", value: 100 }, { row: "3월 가입", col: "2주", value: 82 }, { row: "3월 가입", col: "4주", value: 68 }
  ],
  "kaplan-meier": [
    { time: "0개월", rate: 100, event: 0 }, { time: "3개월", rate: 92, event: 1 },
    { time: "6개월", rate: 82, event: 1 }, { time: "12개월", rate: 65, event: 1 },
    { time: "18개월", rate: 52, event: 1 }, { time: "24개월", rate: 41, event: 1 }
  ],
  waterfall: [
    { label: "시작 잔액", value: 1000, color: "#2563EB" },
    { label: "신규 매출", value: 450, color: "#16A34A" },
    { label: "환불", value: -80, color: "#DC2626" },
    { label: "비용", value: -220, color: "#DC2626" },
    { label: "최종", value: 1150, color: "#2563EB" }
  ],
  "waterfall-finance": [
    { label: "매출", value: 1000, color: "#16A34A" },
    { label: "COGS", value: -600, color: "#DC2626" },
    { label: "판관비", value: -200, color: "#DC2626" },
    { label: "영업이익", value: 200, color: "#16A34A" },
    { label: "순이익", value: 150, color: "#2563EB" }
  ],
  cascade: [
    { label: "매출", value: 1000, color: "#0891B2" },
    { label: "원가", value: -600, color: "#DC2626" },
    { label: "판관비", value: -200, color: "#DC2626" },
    { label: "영업이익", value: 200, color: "#0891B2" },
    { label: "순이익", value: 150, color: "#2563EB" }
  ],
  "lorenz-curve": [
    { popPct: 0, incomePct: 0 }, { popPct: 20, incomePct: 5 },
    { popPct: 40, incomePct: 14 }, { popPct: 60, incomePct: 28 },
    { popPct: 80, incomePct: 52 }, { popPct: 100, incomePct: 100 }
  ],
  "gini-index": [
    { popPct: 0, incomePct: 0 }, { popPct: 20, incomePct: 6 },
    { popPct: 40, incomePct: 16 }, { popPct: 60, incomePct: 32 },
    { popPct: 80, incomePct: 58 }, { popPct: 100, incomePct: 100 }
  ],
  "supply-demand": [
    { x: 100, y1: 500, y2: 100 }, { x: 200, y1: 400, y2: 200 },
    { x: 300, y1: 300, y2: 300 }, { x: 400, y1: 200, y2: 400 },
    { x: 500, y1: 150, y2: 500 }, { x: 600, y1: 100, y2: 600 }
  ],
  "phillips-curve": [
    { x: 3, y1: 5.5, y2: null }, { x: 4, y1: 4.2, y2: null },
    { x: 5, y1: 3.1, y2: null }, { x: 6, y1: 2.4, y2: null },
    { x: 7, y1: 1.8, y2: null }, { x: 8, y1: 1.4, y2: null }
  ],
  "ppf-curve": [
    { x: 0, y1: 100, y2: null }, { x: 25, y1: 95, y2: null },
    { x: 50, y1: 82, y2: null }, { x: 75, y1: 60, y2: null },
    { x: 90, y1: 35, y2: null }, { x: 100, y1: 0, y2: null }
  ],
  pyramid: [
    { age: "임원", male: 3, female: 2 },
    { age: "팀장", male: 10, female: 5 },
    { age: "팀원", male: 35, female: 25 },
    { age: "인턴", male: 7, female: 5 },
    { age: "협력사", male: 5, female: 3 }
  ],
  "population-pyramid": [
    { age: "0~9세", male: 220, female: 210 },
    { age: "10~19세", male: 260, female: 240 },
    { age: "20~39세", male: 380, female: 360 },
    { age: "40~64세", male: 420, female: 430 },
    { age: "65~79세", male: 210, female: 250 },
    { age: "80세+", male: 90, female: 140 }
  ],
  "age-gender-distribution": [
    { age: "10대", male: 120, female: 100 },
    { age: "20대", male: 280, female: 260 },
    { age: "30대", male: 320, female: 300 },
    { age: "40대", male: 180, female: 170 },
    { age: "50대+", male: 100, female: 110 }
  ],
  "likert-scale": [
    { label: "가격 만족도", v1: 5, v2: 12, v3: 28, v4: 38, v5: 17 },
    { label: "품질 만족도", v1: 3, v2: 8, v3: 22, v4: 42, v5: 25 },
    { label: "디자인", v1: 4, v2: 10, v3: 26, v4: 40, v5: 20 },
    { label: "고객 서비스", v1: 6, v2: 14, v3: 30, v4: 32, v5: 18 }
  ],
  "social-network": [
    { node: "철수", links: "영희, 민수" }, { node: "영희", links: "철수, 지영, 민수" },
    { node: "민수", links: "철수, 영희, 지영" }, { node: "지영", links: "영희, 민수, 현우" },
    { node: "현우", links: "지영" }
  ],
  sociogram: [
    { node: "A", links: "B, C" }, { node: "B", links: "C, D" },
    { node: "C", links: "A, D" }, { node: "D", links: "E" },
    { node: "E", links: "A" }
  ],
  "network-diagram": [
    { node: "AI", links: "데이터, 알고리즘" }, { node: "데이터", links: "AI, 품질, 보안" },
    { node: "알고리즘", links: "AI, 성능" }, { node: "품질", links: "데이터" },
    { node: "성능", links: "알고리즘" }
  ],
  "timeline-flow": [
    { date: "2020-01", event: "기획", desc: "프로젝트 시작" },
    { date: "2020-06", event: "개발", desc: "베타 버전 완성" },
    { date: "2021-03", event: "출시", desc: "정식 서비스 오픈" },
    { date: "2022-09", event: "확장", desc: "글로벌 서비스 시작" },
    { date: "2024-01", event: "고도화", desc: "AI 기능 통합" }
  ],
  "timeline-text": [
    { date: "2020", event: "창업", desc: "법인 설립" },
    { date: "2021", event: "시드 투자", desc: "5억 시드 라운드" },
    { date: "2022", event: "출시", desc: "MVP 정식 출시" },
    { date: "2023", event: "Series A", desc: "30억 투자 유치" },
    { date: "2024", event: "글로벌", desc: "해외 진출" }
  ],
  "mind-map": [
    { parent: "마케팅", child: "브랜딩", leaf: "로고/슬로건" },
    { parent: "마케팅", child: "SNS", leaf: "인스타/유튜브" },
    { parent: "마케팅", child: "광고", leaf: "검색/배너" },
    { parent: "마케팅", child: "이벤트", leaf: "프로모션" },
    { parent: "마케팅", child: "데이터", leaf: "분석/리포팅" },
    { parent: "마케팅", child: "고객", leaf: "CRM/CS" }
  ],
  "org-chart": [
    { parent: "CEO", child: "CTO", leaf: "개발" },
    { parent: "CEO", child: "CFO", leaf: "재무" },
    { parent: "CEO", child: "CMO", leaf: "마케팅" },
    { parent: "CEO", child: "COO", leaf: "운영" }
  ],
  treemap: [
    { parent: "전체", child: "식품", leaf: "45" },
    { parent: "전체", child: "가전", leaf: "28" },
    { parent: "전체", child: "의류", leaf: "15" },
    { parent: "전체", child: "뷰티", leaf: "8" },
    { parent: "전체", child: "스포츠", leaf: "4" }
  ]
};

function buildInputForm() {
  const schema = getInputSchema();
  const formEl = document.getElementById("builderForm");
  if (!formEl) return;
  const cols = [];
  for (let i = 0; i < schema.rowCount; i++) {
    const rowTitle = schema.rowLabel ? schema.rowLabel(i) : `데이터 ${i + 1}`;
    const fieldsHtml = schema.fields.map((f) => {
      const valAttr =
        f.inputType === "color"
          ? `value="${DEFAULT_COLORS[i % DEFAULT_COLORS.length]}"`
          : "";
      const styleAttr =
        f.inputType === "color"
          ? 'style="height: 36px; padding: 2px; cursor: pointer;"'
          : "";
      const ph = f.placeholder ? `placeholder="${f.placeholder}"` : "";
      return `<label>${f.label}<input type="${f.inputType}" data-field="${f.key}" data-index="${i}" ${valAttr} ${ph} ${styleAttr}></label>`;
    }).join("");
    cols.push(`<div class="builder-col"><span class="builder-col-title">${rowTitle}</span>${fieldsHtml}</div>`);
  }
  formEl.innerHTML = cols.join("");

  const hintEl = document.getElementById("inputTypeHint");
  if (hintEl) hintEl.textContent = schema.hint;
}

function applyInputTypeUI() {
  buildInputForm();
}

function loadSample() {
  const schema = getInputSchema();
  const rich = EXAMPLE_RICH[chart.id];
  if (rich && Array.isArray(rich)) {
    // 특화 예시: 각 row마다 field별로 채움
    rich.forEach((row, i) => {
      schema.fields.forEach((f) => {
        const el = document.querySelector(
          `[data-field="${f.key}"][data-index="${i}"]`
        );
        if (el && row[f.key] !== undefined && row[f.key] !== null) {
          el.value = row[f.key];
        }
      });
    });
    return;
  }
  // 기본: exampleData(labels/values) 사용
  const labels = chart.exampleData?.labels || chart.sampleData?.labels || [];
  const values =
    chart.exampleData?.values || chart.sampleData?.datasets?.[0]?.data || [];
  document.querySelectorAll('[data-field="label"]').forEach((el, i) => {
    el.value = labels[i] ?? "";
  });
  document.querySelectorAll('[data-field="value"]').forEach((el, i) => {
    el.value = values[i] ?? "";
  });
}

function readForm() {
  const schema = getInputSchema();
  const rows = [];
  for (let i = 0; i < schema.rowCount; i++) {
    const row = {};
    schema.fields.forEach((f) => {
      const el = document.querySelector(
        `[data-field="${f.key}"][data-index="${i}"]`
      );
      row[f.key] = el ? el.value : "";
    });
    if (row.label !== undefined) row.label = (row.label || "").trim();
    rows.push(row);
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
  "bullet-bar":       { engine: "svg", type: "bulletbar" },

  // ----- 통계 (신규) -----
  "qq-plot":              { engine: "chartjs", type: "scatter" },
  "error-bar":            { engine: "chartjs", type: "bar" },
  "pdf-curve":            { engine: "chartjs", type: "line", fill: true },
  "cdf-curve":            { engine: "chartjs", type: "line" },
  "correlation-heatmap":  { engine: "svg", type: "heatmap" },
  "residual-plot":        { engine: "chartjs", type: "scatter" },
  "kaplan-meier":         { engine: "chartjs", type: "line" },

  // ----- 금융 (신규) -----
  "bollinger-bands":      { engine: "chartjs", type: "line" },
  "volume-bar":           { engine: "chartjs", type: "bar" },
  "moving-average":       { engine: "chartjs", type: "line" },
  "return-distribution":  { engine: "chartjs", type: "bar" },
  "correlation-matrix":   { engine: "svg", type: "heatmap" },

  // ----- 경제 (신규) -----
  "lorenz-curve":         { engine: "chartjs", type: "line", fill: true },
  "supply-demand":        { engine: "chartjs", type: "line" },
  "phillips-curve":       { engine: "chartjs", type: "line" },
  "ppf-curve":            { engine: "chartjs", type: "line" },
  "business-cycle":       { engine: "chartjs", type: "line" },
  "gini-index":           { engine: "chartjs", type: "bar" },

  // ----- 사회 (신규) -----
  "population-pyramid":      { engine: "chartjs", type: "bar", indexAxis: "y" },
  "cohort-chart":            { engine: "chartjs", type: "bar" },
  "likert-scale":            { engine: "chartjs", type: "bar" },
  "social-network":          { engine: "svg", type: "network" },
  "age-gender-distribution": { engine: "chartjs", type: "bar" },
  "survey-stacked":          { engine: "chartjs", type: "bar" }
};

// 특화 입력 스키마를 사용하는 chart.id 목록 → 전용 SVG 렌더러로 분기
const RICH_RENDERER_KEYS = new Set([
  "candlestick", "ohlc", "bollinger-bands",
  "boxplot", "violin",
  "qq-plot", "residual-plot",
  "heatmap", "correlation-heatmap", "correlation-matrix", "cohort-chart",
  "kaplan-meier",
  "waterfall", "waterfall-finance", "cascade",
  "lorenz-curve", "gini-index",
  "supply-demand", "phillips-curve", "ppf-curve",
  "pyramid", "population-pyramid", "age-gender-distribution",
  "likert-scale",
  "social-network", "sociogram", "network-diagram",
  "timeline-flow", "timeline-text",
  "mind-map", "org-chart", "treemap"
]);

function renderChart() {
  // 특화 입력 스키마 분기: rows를 그대로 전용 렌더러로 넘김
  if (RICH_RENDERER_KEYS.has(chart.id)) {
    const rows = readForm();
    const filtered = filterRichRows(rows);
    if (filtered.length === 0) {
      alert("데이터를 입력해주세요");
      return;
    }
    try {
      renderRichSVG(filtered);
      switchToChartState();
    } catch (err) {
      console.error("특화 차트 렌더링 실패:", err);
      showError("차트를 그릴 수 없습니다");
    }
    return;
  }

  // 일반 입력 스키마: label + value 행 필터 + 기존 분기
  const rows = readForm();
  const valid = rows.filter(
    (r) => (r.label || "") !== "" && r.value !== "" && !isNaN(parseFloat(r.value))
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

// 특화 row에서 빈 행 제거
function filterRichRows(rows) {
  return rows.filter((r) => {
    // 최소 하나라도 값이 채워진 행만
    return Object.values(r).some((v) => String(v).trim() !== "");
  });
}

// 특화 SVG 렌더러로 분기
function renderRichSVG(rows) {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  document.getElementById("builderCanvas").style.opacity = "0";
  const container = ensureChartContainer();
  container.style.display = "block";

  const id = chart.id;
  let inner = "";
  if (id === "candlestick" || id === "ohlc") {
    inner = svgRichCandle(rows, id === "ohlc");
  } else if (id === "bollinger-bands") {
    inner = svgRichBollinger(rows);
  } else if (id === "boxplot" || id === "violin") {
    inner = svgRichBoxplot(rows, id === "violin");
  } else if (id === "qq-plot") {
    inner = svgRichQQ(rows);
  } else if (id === "residual-plot") {
    inner = svgRichResidual(rows);
  } else if (id === "heatmap" || id === "correlation-heatmap" || id === "correlation-matrix" || id === "cohort-chart") {
    inner = svgRichHeatmap(rows);
  } else if (id === "kaplan-meier") {
    inner = svgRichSurvival(rows);
  } else if (id === "waterfall" || id === "waterfall-finance" || id === "cascade") {
    inner = svgRichWaterfall(rows);
  } else if (id === "lorenz-curve" || id === "gini-index") {
    inner = svgRichLorenz(rows, id === "gini-index");
  } else if (id === "supply-demand" || id === "phillips-curve" || id === "ppf-curve") {
    inner = svgRichCurve(rows, id);
  } else if (id === "pyramid" || id === "population-pyramid" || id === "age-gender-distribution") {
    inner = svgRichPyramid(rows);
  } else if (id === "likert-scale") {
    inner = svgRichLikert(rows);
  } else if (id === "social-network" || id === "sociogram" || id === "network-diagram") {
    inner = svgRichNetwork(rows, id !== "network-diagram");
  } else if (id === "timeline-flow" || id === "timeline-text") {
    inner = svgRichTimeline(rows);
  } else if (id === "mind-map" || id === "org-chart" || id === "treemap") {
    inner = svgRichHierarchy(rows, id);
  } else {
    inner = `<text x="200" y="115" text-anchor="middle" font-size="14" fill="#6b7280" font-family="sans-serif">${_esc(chart.name)}</text>`;
  }
  const wrapped = _svgWrap(inner);
  lastSVGString = wrapped;
  container.innerHTML = wrapped;
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
  const exp = document.getElementById("export-section");
  if (exp) exp.style.display = "block";
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
// 4-B. 특화 입력 스키마용 SVG 렌더러
// ===========================================
function _toNum(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function svgRichCandle(rows, ohlcStyle) {
  const data = rows.map((r) => ({
    date: r.date || "",
    o: _toNum(r.open),
    h: _toNum(r.high),
    l: _toNum(r.low),
    c: _toNum(r.close)
  }));
  const allVals = data.flatMap((d) => [d.o, d.h, d.l, d.c]);
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const sx = 50, W = 320, yTop = 25, H = 165;
  const N = data.length;
  const slot = W / N;
  const scaleY = (v) => yTop + (1 - (v - min) / range) * H;
  let s = `<line x1="${sx}" y1="${yTop + H}" x2="${sx + W}" y2="${yTop + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  data.forEach((d, i) => {
    const cx = sx + slot * (i + 0.5);
    const yH = scaleY(d.h);
    const yL = scaleY(d.l);
    const yO = scaleY(d.o);
    const yC = scaleY(d.c);
    const rising = d.c >= d.o;
    const color = rising ? "#16A34A" : "#DC2626";
    s += `<line x1="${cx.toFixed(1)}" y1="${yH.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${yL.toFixed(1)}" stroke="${color}" stroke-width="1.5"/>`;
    if (ohlcStyle) {
      s += `<line x1="${(cx - 6).toFixed(1)}" y1="${yO.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${yO.toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
      s += `<line x1="${cx.toFixed(1)}" y1="${yC.toFixed(1)}" x2="${(cx + 6).toFixed(1)}" y2="${yC.toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
    } else {
      const bw = Math.max(8, slot * 0.45);
      const top = Math.min(yO, yC);
      const h = Math.max(2, Math.abs(yO - yC));
      s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="${color}"/>`;
    }
    s += `<text x="${cx.toFixed(1)}" y="${yTop + H + 16}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${_esc(d.date)}</text>`;
  });
  return s;
}

function svgRichBollinger(rows) {
  const data = rows.map((r) => ({
    date: r.date || "",
    c: _toNum(r.close),
    m: _toNum(r.ma),
    u: _toNum(r.upper),
    l: _toNum(r.lower)
  }));
  const all = data.flatMap((d) => [d.c, d.m, d.u, d.l]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const sx = 40, W = 330, yTop = 20, H = 165;
  const N = data.length;
  const scaleX = (i) => sx + (N > 1 ? (i / (N - 1)) * W : W / 2);
  const scaleY = (v) => yTop + (1 - (v - min) / range) * H;
  const ptsU = data.map((d, i) => `${scaleX(i).toFixed(1)},${scaleY(d.u).toFixed(1)}`).join(" ");
  const ptsL = data.map((d, i) => `${scaleX(i).toFixed(1)},${scaleY(d.l).toFixed(1)}`).join(" ");
  const ptsM = data.map((d, i) => `${scaleX(i).toFixed(1)},${scaleY(d.m).toFixed(1)}`).join(" ");
  const ptsC = data.map((d, i) => `${scaleX(i).toFixed(1)},${scaleY(d.c).toFixed(1)}`).join(" ");
  const ptsLrev = data.slice().reverse().map((d, j) => {
    const i = N - 1 - j;
    return `${scaleX(i).toFixed(1)},${scaleY(d.l).toFixed(1)}`;
  }).join(" ");
  let s = "";
  s += `<polygon points="${ptsU} ${ptsLrev}" fill="#FDE68A" fill-opacity="0.55"/>`;
  s += `<polyline points="${ptsU}" stroke="#92400E" stroke-width="1.2" fill="none" stroke-dasharray="3,2"/>`;
  s += `<polyline points="${ptsL}" stroke="#92400E" stroke-width="1.2" fill="none" stroke-dasharray="3,2"/>`;
  s += `<polyline points="${ptsM}" stroke="#B45309" stroke-width="2" fill="none"/>`;
  s += `<polyline points="${ptsC}" stroke="#0F172A" stroke-width="2" fill="none"/>`;
  data.forEach((d, i) => {
    s += `<circle cx="${scaleX(i).toFixed(1)}" cy="${scaleY(d.c).toFixed(1)}" r="2.5" fill="#0F172A"/>`;
    s += `<text x="${scaleX(i).toFixed(1)}" y="${yTop + H + 16}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${_esc(d.date)}</text>`;
  });
  return s;
}

function svgRichBoxplot(rows, isViolin) {
  const data = rows.map((r) => ({
    label: r.label || "",
    min: _toNum(r.min),
    q1: _toNum(r.q1),
    med: _toNum(r.median),
    q3: _toNum(r.q3),
    max: _toNum(r.max)
  }));
  const all = data.flatMap((d) => [d.min, d.q1, d.med, d.q3, d.max]);
  const minV = Math.min(...all);
  const maxV = Math.max(...all);
  const range = maxV - minV || 1;
  const sx = 40, W = 330, yTop = 25, H = 160;
  const N = data.length;
  const slot = W / N;
  const scaleY = (v) => yTop + (1 - (v - minV) / range) * H;
  const palette = ["#2563EB", "#16A34A", "#D97706", "#DC2626", "#7C3AED"];
  let s = "";
  data.forEach((d, i) => {
    const cx = sx + slot * (i + 0.5);
    const yMin = scaleY(d.min);
    const yMax = scaleY(d.max);
    const yQ1 = scaleY(d.q1);
    const yQ3 = scaleY(d.q3);
    const yMed = scaleY(d.med);
    const color = palette[i % palette.length];
    if (isViolin) {
      const cy = (yQ1 + yQ3) / 2;
      const hHalf = Math.max(16, (yMin - yMax) / 2);
      const wMax = 28;
      let pathR = `M ${cx},${yMax}`;
      const steps = 18;
      for (let k = 1; k <= steps; k++) {
        const t = k / steps;
        const y = yMax + t * (yMin - yMax);
        const w = Math.exp(-Math.pow((t - 0.5) * 3, 2)) * wMax;
        pathR += ` L ${(cx + w).toFixed(1)},${y.toFixed(1)}`;
      }
      let pathL = "";
      for (let k = steps - 1; k >= 0; k--) {
        const t = k / steps;
        const y = yMax + t * (yMin - yMax);
        const w = Math.exp(-Math.pow((t - 0.5) * 3, 2)) * wMax;
        pathL += ` L ${(cx - w).toFixed(1)},${y.toFixed(1)}`;
      }
      s += `<path d="${pathR}${pathL} Z" fill="${color}" fill-opacity="0.45" stroke="${color}" stroke-width="1.5"/>`;
      s += `<line x1="${cx}" y1="${yQ1.toFixed(1)}" x2="${cx}" y2="${yQ3.toFixed(1)}" stroke="${color}" stroke-width="3"/>`;
      s += `<circle cx="${cx}" cy="${yMed.toFixed(1)}" r="3" fill="#fff" stroke="${color}" stroke-width="2"/>`;
    } else {
      const bw = Math.min(40, slot * 0.6);
      s += `<line x1="${cx}" y1="${yMin.toFixed(1)}" x2="${cx}" y2="${yMax.toFixed(1)}" stroke="${color}" stroke-width="1.5"/>`;
      s += `<line x1="${(cx - bw / 2 + 6).toFixed(1)}" y1="${yMin.toFixed(1)}" x2="${(cx + bw / 2 - 6).toFixed(1)}" y2="${yMin.toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
      s += `<line x1="${(cx - bw / 2 + 6).toFixed(1)}" y1="${yMax.toFixed(1)}" x2="${(cx + bw / 2 - 6).toFixed(1)}" y2="${yMax.toFixed(1)}" stroke="${color}" stroke-width="2"/>`;
      s += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${yQ3.toFixed(1)}" width="${bw.toFixed(1)}" height="${(yQ1 - yQ3).toFixed(1)}" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.8"/>`;
      s += `<line x1="${(cx - bw / 2).toFixed(1)}" y1="${yMed.toFixed(1)}" x2="${(cx + bw / 2).toFixed(1)}" y2="${yMed.toFixed(1)}" stroke="${color}" stroke-width="2.5"/>`;
    }
    s += `<text x="${cx.toFixed(1)}" y="${yTop + H + 18}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif">${_esc(d.label)}</text>`;
  });
  return s;
}

function svgRichQQ(rows) {
  const pts = rows.map((r) => ({ x: _toNum(r.x), y: _toNum(r.y) }));
  const all = pts.flatMap((p) => [p.x, p.y]);
  const minV = Math.min(...all);
  const maxV = Math.max(...all);
  const range = maxV - minV || 1;
  const sx = 40, sy = 25, W = 330, H = 165;
  const scaleX = (v) => sx + ((v - minV) / range) * W;
  const scaleY = (v) => sy + H - ((v - minV) / range) * H;
  let s = "";
  s += `<line x1="${scaleX(minV)}" y1="${scaleY(minV)}" x2="${scaleX(maxV)}" y2="${scaleY(maxV)}" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  s += `<line x1="${sx}" y1="${sy + H}" x2="${sx + W}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  s += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  pts.forEach((p) => {
    s += `<circle cx="${scaleX(p.x).toFixed(1)}" cy="${scaleY(p.y).toFixed(1)}" r="3.5" fill="#059669"/>`;
  });
  s += `<text x="200" y="220" text-anchor="middle" font-size="11" fill="#6b7280" font-family="sans-serif">이론값(X) vs 관측값(Y)</text>`;
  return s;
}

function svgRichResidual(rows) {
  const pts = rows.map((r) => ({ x: _toNum(r.x), y: _toNum(r.y) }));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMaxAbs = Math.max(...ys.map(Math.abs)) || 1;
  const sx = 40, sy = 25, W = 330, H = 165;
  const scaleX = (v) => sx + ((v - xMin) / (xMax - xMin || 1)) * W;
  const zeroY = sy + H / 2;
  const scaleY = (v) => zeroY - (v / yMaxAbs) * (H / 2 - 6);
  let s = "";
  s += `<line x1="${sx}" y1="${zeroY}" x2="${sx + W}" y2="${zeroY}" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>`;
  pts.forEach((p) => {
    s += `<circle cx="${scaleX(p.x).toFixed(1)}" cy="${scaleY(p.y).toFixed(1)}" r="3.5" fill="#059669"/>`;
  });
  s += `<text x="200" y="220" text-anchor="middle" font-size="11" fill="#6b7280" font-family="sans-serif">X vs 잔차(Residual)</text>`;
  return s;
}

function svgRichHeatmap(rows) {
  const rowsSet = [];
  const colsSet = [];
  rows.forEach((r) => {
    if (!rowsSet.includes(r.row)) rowsSet.push(r.row);
    if (!colsSet.includes(r.col)) colsSet.push(r.col);
  });
  const cellMap = {};
  rows.forEach((r) => {
    cellMap[`${r.row}|${r.col}`] = _toNum(r.value);
  });
  const vals = Object.values(cellMap);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const R = rowsSet.length;
  const C = colsSet.length;
  const sx = 70, sy = 25, W = 280, H = 165;
  const cellW = W / C;
  const cellH = H / R;
  let s = "";
  rowsSet.forEach((rLabel, ri) => {
    s += `<text x="65" y="${(sy + cellH * (ri + 0.5) + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#374151" font-family="sans-serif">${_esc(rLabel)}</text>`;
    colsSet.forEach((cLabel, ci) => {
      const v = cellMap[`${rLabel}|${cLabel}`] ?? 0;
      const op = 0.18 + 0.82 * ((v - minV) / range);
      const x = sx + ci * cellW;
      const y = sy + ri * cellH;
      s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(cellW - 2).toFixed(1)}" height="${(cellH - 2).toFixed(1)}" fill="#0E7490" fill-opacity="${op.toFixed(2)}"/>`;
      if (cellW > 28 && cellH > 22) {
        s += `<text x="${(x + cellW / 2).toFixed(1)}" y="${(y + cellH / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">${v}</text>`;
      }
    });
  });
  colsSet.forEach((cLabel, ci) => {
    s += `<text x="${(sx + cellW * (ci + 0.5)).toFixed(1)}" y="${(sy + H + 14).toFixed(1)}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif">${_esc(cLabel)}</text>`;
  });
  return s;
}

function svgRichSurvival(rows) {
  const data = rows.map((r) => ({
    time: r.time || "",
    rate: _toNum(r.rate),
    event: _toNum(r.event)
  }));
  const sx = 40, sy = 25, W = 330, H = 165;
  const N = data.length;
  const scaleX = (i) => sx + (N > 1 ? (i / (N - 1)) * W : W / 2);
  const scaleY = (v) => sy + (1 - v / 100) * H;
  let path = `M ${scaleX(0).toFixed(1)},${scaleY(data[0].rate).toFixed(1)}`;
  for (let i = 1; i < N; i++) {
    path += ` L ${scaleX(i).toFixed(1)},${scaleY(data[i - 1].rate).toFixed(1)}`;
    path += ` L ${scaleX(i).toFixed(1)},${scaleY(data[i].rate).toFixed(1)}`;
  }
  let s = "";
  s += `<line x1="${sx}" y1="${sy + H}" x2="${sx + W}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  s += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  s += `<path d="${path}" stroke="#059669" stroke-width="2.5" fill="none"/>`;
  data.forEach((d, i) => {
    if (d.event > 0) {
      s += `<line x1="${scaleX(i).toFixed(1)}" y1="${(scaleY(d.rate) - 5).toFixed(1)}" x2="${scaleX(i).toFixed(1)}" y2="${(scaleY(d.rate) + 5).toFixed(1)}" stroke="#059669" stroke-width="1.5"/>`;
    }
    s += `<text x="${scaleX(i).toFixed(1)}" y="${sy + H + 16}" text-anchor="middle" font-size="10" fill="#6b7280" font-family="sans-serif">${_esc(d.time)}</text>`;
  });
  return s;
}

function svgRichWaterfall(rows) {
  const data = rows.map((r) => ({
    label: r.label || "",
    value: _toNum(r.value),
    color: r.color || ""
  }));
  let running = 0;
  const segs = data.map((d, i) => {
    const isLast = i === data.length - 1;
    if (isLast && Math.abs(d.value) > 0) {
      // 마지막은 누적 결과를 표시
      const start = 0;
      const end = d.value;
      return { start, end, value: d.value, label: d.label, color: d.color || "#2563EB", isLast: true };
    }
    const start = running;
    running += d.value;
    return { start, end: running, value: d.value, label: d.label, color: d.color || (d.value >= 0 ? "#16A34A" : "#DC2626") };
  });
  const allVals = segs.flatMap((sg) => [sg.start, sg.end]);
  const min = Math.min(0, ...allVals);
  const max = Math.max(0, ...allVals);
  const range = max - min || 1;
  const sx = 40, W = 330, yBase = 195, H = 165;
  const N = data.length;
  const segW = W / N;
  const scaleY = (v) => yBase - ((v - min) / range) * H;
  let s = "";
  if (min < 0 && max > 0) {
    s += `<line x1="${sx}" y1="${scaleY(0).toFixed(1)}" x2="${sx + W}" y2="${scaleY(0).toFixed(1)}" stroke="#cbd5e1" stroke-width="0.8" stroke-dasharray="3,2"/>`;
  }
  segs.forEach((sg, i) => {
    const x = sx + segW * i + 6;
    const top = scaleY(Math.max(sg.start, sg.end));
    const bot = scaleY(Math.min(sg.start, sg.end));
    const h = Math.max(2, bot - top);
    s += `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(segW - 12).toFixed(1)}" height="${h.toFixed(1)}" fill="${sg.color}"/>`;
    if (i < N - 1 && !sg.isLast) {
      const xRight = x + segW - 12;
      const xNext = sx + segW * (i + 1) + 6;
      const yLine = scaleY(sg.end);
      s += `<line x1="${xRight.toFixed(1)}" y1="${yLine.toFixed(1)}" x2="${xNext.toFixed(1)}" y2="${yLine.toFixed(1)}" stroke="#94a3b8" stroke-width="0.7" stroke-dasharray="2,2"/>`;
    }
    s += `<text x="${(x + (segW - 12) / 2).toFixed(1)}" y="${yBase + 16}" text-anchor="middle" font-size="10" fill="#374151" font-family="sans-serif">${_esc(sg.label)}</text>`;
    s += `<text x="${(x + (segW - 12) / 2).toFixed(1)}" y="${(top - 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#1f2937" font-family="sans-serif">${sg.value > 0 ? "+" : ""}${sg.value}</text>`;
  });
  return s;
}

function svgRichLorenz(rows, withShade) {
  const pts = rows.map((r) => ({ x: _toNum(r.popPct), y: _toNum(r.incomePct) }))
    .sort((a, b) => a.x - b.x);
  const sx = 50, sy = 20, W = 320, H = 170;
  const scaleX = (v) => sx + (v / 100) * W;
  const scaleY = (v) => sy + (1 - v / 100) * H;
  let s = "";
  s += `<line x1="${scaleX(0)}" y1="${scaleY(0)}" x2="${scaleX(100)}" y2="${scaleY(100)}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,3"/>`;
  s += `<line x1="${sx}" y1="${sy + H}" x2="${sx + W}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  s += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  const curveStr = pts.map((p) => `${scaleX(p.x).toFixed(1)},${scaleY(p.y).toFixed(1)}`).join(" ");
  if (withShade) {
    const shadePts = [
      `${scaleX(0).toFixed(1)},${scaleY(0).toFixed(1)}`,
      `${scaleX(100).toFixed(1)},${scaleY(100).toFixed(1)}`,
      ...pts.slice().reverse().map((p) => `${scaleX(p.x).toFixed(1)},${scaleY(p.y).toFixed(1)}`)
    ].join(" ");
    s += `<polygon points="${shadePts}" fill="#0E7490" fill-opacity="0.25"/>`;
  }
  s += `<polyline points="${curveStr}" stroke="#0E7490" stroke-width="2.5" fill="none"/>`;
  pts.forEach((p) => {
    s += `<circle cx="${scaleX(p.x).toFixed(1)}" cy="${scaleY(p.y).toFixed(1)}" r="3" fill="#0E7490"/>`;
  });
  s += `<text x="${sx + W / 2}" y="${sy + H + 18}" text-anchor="middle" font-size="11" fill="#6b7280" font-family="sans-serif">누적 인구 비율(%)</text>`;
  s += `<text x="20" y="${sy + H / 2}" text-anchor="middle" font-size="11" fill="#6b7280" font-family="sans-serif" transform="rotate(-90 20 ${sy + H / 2})">누적 소득 비율(%)</text>`;
  return s;
}

function svgRichCurve(rows, kind) {
  const data = rows.map((r) => ({
    x: _toNum(r.x),
    y1: r.y1 === "" || r.y1 == null ? null : _toNum(r.y1),
    y2: r.y2 === "" || r.y2 == null ? null : _toNum(r.y2)
  })).sort((a, b) => a.x - b.x);
  const xs = data.map((d) => d.x);
  const ys = data.flatMap((d) => [d.y1, d.y2]).filter((v) => v != null);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const sx = 50, sy = 20, W = 320, H = 170;
  const scaleX = (v) => sx + ((v - xMin) / (xMax - xMin || 1)) * W;
  const scaleY = (v) => sy + (1 - (v - yMin) / (yMax - yMin || 1)) * H;
  let s = "";
  s += `<line x1="${sx}" y1="${sy + H}" x2="${sx + W}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  s += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + H}" stroke="#cbd5e1" stroke-width="0.6"/>`;
  const path1 = data.filter((d) => d.y1 != null).map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(d.x).toFixed(1)},${scaleY(d.y1).toFixed(1)}`).join(" ");
  const path2 = data.filter((d) => d.y2 != null).map((d, i) => `${i === 0 ? "M" : "L"} ${scaleX(d.x).toFixed(1)},${scaleY(d.y2).toFixed(1)}`).join(" ");
  s += `<path d="${path1}" stroke="#0E7490" stroke-width="2.5" fill="none"/>`;
  if (path2) s += `<path d="${path2}" stroke="#DC2626" stroke-width="2.5" fill="none"/>`;
  data.forEach((d) => {
    if (d.y1 != null) s += `<circle cx="${scaleX(d.x).toFixed(1)}" cy="${scaleY(d.y1).toFixed(1)}" r="3" fill="#0E7490"/>`;
    if (d.y2 != null) s += `<circle cx="${scaleX(d.x).toFixed(1)}" cy="${scaleY(d.y2).toFixed(1)}" r="3" fill="#DC2626"/>`;
  });
  if (kind === "supply-demand") {
    s += `<text x="${sx + W - 40}" y="${sy + 15}" font-size="10" fill="#0E7490" font-family="sans-serif">수요 (Demand)</text>`;
    s += `<text x="${sx + W - 40}" y="${sy + 30}" font-size="10" fill="#DC2626" font-family="sans-serif">공급 (Supply)</text>`;
  }
  return s;
}

function svgRichPyramid(rows) {
  const data = rows.map((r) => ({
    age: r.age || "",
    male: _toNum(r.male),
    female: _toNum(r.female)
  }));
  const maxV = Math.max(...data.flatMap((d) => [d.male, d.female])) || 1;
  const sy = 20, H = 175;
  const cx = 200, halfW = 145;
  const N = data.length;
  const rowH = Math.min(28, (H - (N - 1) * 4) / N);
  let s = "";
  s += `<line x1="${cx}" y1="${sy - 4}" x2="${cx}" y2="${sy + H + 4}" stroke="#94a3b8" stroke-width="0.6"/>`;
  data.forEach((d, i) => {
    const y = sy + i * (rowH + 4);
    const mw = (d.male / maxV) * halfW;
    const fw = (d.female / maxV) * halfW;
    s += `<rect x="${(cx - mw).toFixed(1)}" y="${y.toFixed(1)}" width="${mw.toFixed(1)}" height="${rowH.toFixed(1)}" fill="#60A5FA"/>`;
    s += `<rect x="${cx.toFixed(1)}" y="${y.toFixed(1)}" width="${fw.toFixed(1)}" height="${rowH.toFixed(1)}" fill="#F472B6"/>`;
    s += `<text x="${cx}" y="${(y + rowH / 2 + 4).toFixed(1)}" text-anchor="middle" font-size="10" fill="#1f2937" font-weight="700" font-family="sans-serif">${_esc(d.age)}</text>`;
    s += `<text x="${(cx - mw - 4).toFixed(1)}" y="${(y + rowH / 2 + 4).toFixed(1)}" text-anchor="end" font-size="9" fill="#1e3a8a" font-family="sans-serif">${d.male}</text>`;
    s += `<text x="${(cx + fw + 4).toFixed(1)}" y="${(y + rowH / 2 + 4).toFixed(1)}" font-size="9" fill="#831843" font-family="sans-serif">${d.female}</text>`;
  });
  s += `<text x="${(cx - halfW + 10).toFixed(1)}" y="${sy + H + 16}" font-size="11" fill="#1e3a8a" font-family="sans-serif">남성</text>`;
  s += `<text x="${(cx + halfW - 30).toFixed(1)}" y="${sy + H + 16}" font-size="11" fill="#831843" font-family="sans-serif">여성</text>`;
  return s;
}

function svgRichLikert(rows) {
  const data = rows.map((r) => ({
    label: r.label || "",
    v: [_toNum(r.v1), _toNum(r.v2), _toNum(r.v3), _toNum(r.v4), _toNum(r.v5)]
  }));
  const colors = ["#DC2626", "#FCA5A5", "#FCD34D", "#86EFAC", "#16A34A"];
  const sy = 30, H = 160;
  const cx = 220, halfW = 145;
  const N = data.length;
  const rowH = Math.min(28, (H - (N - 1) * 8) / N);
  let s = "";
  s += `<line x1="${cx}" y1="${sy - 8}" x2="${cx}" y2="${sy + H + 4}" stroke="#94a3b8" stroke-width="0.6"/>`;
  data.forEach((d, i) => {
    const y = sy + i * (rowH + 8);
    const neg = d.v[0] + d.v[1];
    const half = d.v[2] / 2;
    const maxSum = Math.max(neg + half, half + d.v[3] + d.v[4], 50);
    const scale = halfW / maxSum;
    let x = cx - neg * scale - half * scale;
    [0, 1].forEach((k) => {
      const w = d.v[k] * scale;
      s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${rowH.toFixed(1)}" fill="${colors[k]}"/>`;
      x += w;
    });
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(half * scale).toFixed(1)}" height="${rowH.toFixed(1)}" fill="${colors[2]}"/>`;
    x += half * scale;
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(half * scale).toFixed(1)}" height="${rowH.toFixed(1)}" fill="${colors[2]}"/>`;
    x += half * scale;
    [3, 4].forEach((k) => {
      const w = d.v[k] * scale;
      s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${rowH.toFixed(1)}" fill="${colors[k]}"/>`;
      x += w;
    });
    s += `<text x="${(cx - halfW - 6).toFixed(1)}" y="${(y + rowH / 2 + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#374151" font-family="sans-serif">${_esc(d.label)}</text>`;
  });
  ["매우부정", "부정", "중립", "긍정", "매우긍정"].forEach((t, i) => {
    s += `<rect x="${(20 + i * 70).toFixed(1)}" y="${(sy + H + 12).toFixed(1)}" width="8" height="8" fill="${colors[i]}"/>`;
    s += `<text x="${(32 + i * 70).toFixed(1)}" y="${(sy + H + 20).toFixed(1)}" font-size="9" fill="#374151" font-family="sans-serif">${t}</text>`;
  });
  return s;
}

function svgRichNetwork(rows, directed) {
  const nodes = rows.filter((r) => (r.node || "").trim() !== "").map((r) => ({
    name: r.node.trim(),
    links: (r.links || "").split(",").map((s) => s.trim()).filter(Boolean)
  }));
  const N = nodes.length;
  const cx = 200, cy = 115, r = 80;
  const pos = nodes.map((_, i) => {
    const ang = -Math.PI / 2 + (i / N) * 2 * Math.PI;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  });
  const nameToIdx = Object.fromEntries(nodes.map((n, i) => [n.name, i]));
  let s = "";
  nodes.forEach((n, i) => {
    const from = pos[i];
    n.links.forEach((lnk) => {
      const j = nameToIdx[lnk];
      if (j == null || j === i) return;
      const to = pos[j];
      s += `<line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}" stroke="#BE185D" stroke-width="1.3" stroke-opacity="0.7"/>`;
      if (directed) {
        const ang = Math.atan2(to.y - from.y, to.x - from.x);
        const ax = to.x - 14 * Math.cos(ang);
        const ay = to.y - 14 * Math.sin(ang);
        const aLx = ax - 6 * Math.cos(ang - 0.4);
        const aLy = ay - 6 * Math.sin(ang - 0.4);
        const aRx = ax - 6 * Math.cos(ang + 0.4);
        const aRy = ay - 6 * Math.sin(ang + 0.4);
        s += `<polygon points="${ax.toFixed(1)},${ay.toFixed(1)} ${aLx.toFixed(1)},${aLy.toFixed(1)} ${aRx.toFixed(1)},${aRy.toFixed(1)}" fill="#BE185D"/>`;
      }
    });
  });
  nodes.forEach((n, i) => {
    s += `<circle cx="${pos[i].x.toFixed(1)}" cy="${pos[i].y.toFixed(1)}" r="14" fill="#BE185D" stroke="#fff" stroke-width="2"/>`;
    s += `<text x="${pos[i].x.toFixed(1)}" y="${(pos[i].y + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(n.name)}</text>`;
  });
  return s;
}

function svgRichTimeline(rows) {
  const data = rows.map((r) => ({ date: r.date || "", event: r.event || "", desc: r.desc || "" }));
  const N = data.length;
  const sx = 40, ex = 360, ly = 115;
  let s = `<line x1="${sx}" y1="${ly}" x2="${ex}" y2="${ly}" stroke="#0F766E" stroke-width="2"/>`;
  data.forEach((d, i) => {
    const x = sx + (N > 1 ? (i / (N - 1)) * (ex - sx) : (ex - sx) / 2);
    const above = i % 2 === 0;
    const boxY = above ? ly - 78 : ly + 18;
    s += `<circle cx="${x.toFixed(1)}" cy="${ly}" r="6" fill="#0F766E"/>`;
    s += `<line x1="${x.toFixed(1)}" y1="${above ? ly - 6 : ly + 6}" x2="${x.toFixed(1)}" y2="${above ? boxY + 60 : boxY}" stroke="#0F766E" stroke-width="1"/>`;
    s += `<rect x="${(x - 42).toFixed(1)}" y="${boxY}" width="84" height="60" fill="#fff" stroke="#0F766E" stroke-width="1.5" rx="4"/>`;
    s += `<text x="${x.toFixed(1)}" y="${(boxY + 16).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#0F766E" font-family="sans-serif">${_esc(d.date)}</text>`;
    s += `<text x="${x.toFixed(1)}" y="${(boxY + 32).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937" font-family="sans-serif">${_esc(d.event)}</text>`;
    s += `<text x="${x.toFixed(1)}" y="${(boxY + 48).toFixed(1)}" text-anchor="middle" font-size="9" fill="#6b7280" font-family="sans-serif">${_esc((d.desc || "").slice(0, 14))}</text>`;
  });
  return s;
}

function svgRichHierarchy(rows, kind) {
  if (kind === "treemap") {
    const data = rows.map((r) => ({ label: r.child || r.parent || "", value: _toNum(r.leaf) || 0 }));
    const total = data.reduce((sum, d) => sum + Math.abs(d.value), 0) || 1;
    const sorted = data.slice().sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    const W = 360, H = 180, X = 20, Y = 25;
    const palette = ["#9333EA", "#A855F7", "#C084FC", "#D8B4FE", "#E9D5FF", "#F3E8FF"];
    let s = "";
    const firstShare = Math.abs(sorted[0].value) / total;
    const firstW = Math.max(110, Math.min(W * 0.65, W * firstShare * 1.4));
    s += `<rect x="${X}" y="${Y}" width="${firstW - 4}" height="${H}" fill="${palette[0]}" stroke="#fff" stroke-width="2"/>`;
    s += `<text x="${X + firstW / 2}" y="${Y + H / 2}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(sorted[0].label)}</text>`;
    s += `<text x="${X + firstW / 2}" y="${Y + H / 2 + 18}" text-anchor="middle" font-size="11" fill="#fff" font-family="sans-serif">${sorted[0].value}</text>`;
    const rest = sorted.slice(1);
    const restTotal = rest.reduce((sum, d) => sum + Math.abs(d.value), 0) || 1;
    let curY = Y;
    rest.forEach((d, i) => {
      const h = (Math.abs(d.value) / restTotal) * H;
      s += `<rect x="${X + firstW}" y="${curY}" width="${W - firstW}" height="${h - 2}" fill="${palette[(i + 1) % palette.length]}" stroke="#fff" stroke-width="2"/>`;
      if (h > 24) {
        s += `<text x="${X + firstW + (W - firstW) / 2}" y="${curY + h / 2 + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(d.label)} (${d.value})</text>`;
      }
      curY += h;
    });
    return s;
  }
  // mind-map / org-chart: 중심 노드 + 가지 노드
  const root = rows[0]?.parent || "중심";
  const branches = rows.map((r) => ({ name: r.child || "", leaf: r.leaf || "" })).filter((b) => b.name);
  const N = branches.length;
  if (kind === "org-chart") {
    const cx = 200, topY = 35;
    let s = `<rect x="${cx - 50}" y="${topY - 18}" width="100" height="36" fill="#9333EA" rx="5"/>`;
    s += `<text x="${cx}" y="${topY + 6}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(root)}</text>`;
    branches.forEach((b, i) => {
      const bx = 40 + (320 / Math.max(1, N)) * (i + 0.5);
      const by = 160;
      s += `<line x1="${cx}" y1="${topY + 18}" x2="${bx.toFixed(1)}" y2="${by - 18}" stroke="#9ca3af" stroke-width="1.5"/>`;
      s += `<rect x="${(bx - 38).toFixed(1)}" y="${by - 18}" width="76" height="36" fill="#A855F7" rx="5"/>`;
      s += `<text x="${bx.toFixed(1)}" y="${by + 2}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(b.name)}</text>`;
      if (b.leaf) s += `<text x="${bx.toFixed(1)}" y="${by + 14}" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif">${_esc(b.leaf)}</text>`;
    });
    return s;
  }
  // mind-map: 방사형
  const cx = 200, cy = 115;
  const r = 80;
  let s = `<circle cx="${cx}" cy="${cy}" r="34" fill="#9333EA"/>`;
  s += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(root)}</text>`;
  branches.forEach((b, i) => {
    const ang = -Math.PI / 2 + (i / N) * 2 * Math.PI;
    const bx = cx + r * Math.cos(ang);
    const by = cy + r * Math.sin(ang);
    s += `<line x1="${cx}" y1="${cy}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="#9ca3af" stroke-width="1.5"/>`;
    s += `<rect x="${(bx - 30).toFixed(1)}" y="${(by - 11).toFixed(1)}" width="60" height="22" fill="#A855F7" rx="4"/>`;
    s += `<text x="${bx.toFixed(1)}" y="${(by + 4).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="sans-serif">${_esc(b.name)}</text>`;
    if (b.leaf) {
      const lx = cx + (r + 30) * Math.cos(ang);
      const ly = cy + (r + 30) * Math.sin(ang);
      s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="9" fill="#6b7280" font-family="sans-serif">${_esc(b.leaf)}</text>`;
    }
  });
  return s;
}

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
  const exp = document.getElementById("export-section");
  if (exp) exp.style.display = "none";
}

// ===========================================
// 5-B. 내보내기 기능 (JPG / PNG / SVG / Sheets / Docs)
// ===========================================
function _dateStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

function _triggerDownload(href, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = href;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function _baseFileName() {
  return `${chart.name || chart.id}_${_dateStamp()}`;
}

function exportImage(kind) {
  const mime = kind === "jpg" ? "image/jpeg" : "image/png";
  const ext = kind === "jpg" ? "jpg" : "png";
  const filename = `${_baseFileName()}.${ext}`;

  if (chartInstance) {
    if (kind === "png") {
      _triggerDownload(chartInstance.toBase64Image(), filename);
    } else {
      const c = chartInstance.canvas;
      const tmp = document.createElement("canvas");
      tmp.width = c.width;
      tmp.height = c.height;
      const ctx = tmp.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, tmp.width, tmp.height);
      ctx.drawImage(c, 0, 0);
      _triggerDownload(tmp.toDataURL(mime, 0.95), filename);
    }
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
      _triggerDownload(canvas.toDataURL(mime, 0.95), filename);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      // html2canvas 폴백
      _exportViaHtml2Canvas(kind, filename);
    };
    img.src = url;
    return;
  }

  // 둘 다 없으면 html2canvas로 캡처
  _exportViaHtml2Canvas(kind, filename);
}

function _exportViaHtml2Canvas(kind, filename) {
  if (typeof html2canvas !== "function") {
    alert("이미지 저장에 실패했습니다");
    return;
  }
  const target = document.querySelector(".builder-canvas");
  html2canvas(target, { backgroundColor: "#fff", scale: 2 })
    .then((canvas) => {
      const mime = kind === "jpg" ? "image/jpeg" : "image/png";
      _triggerDownload(canvas.toDataURL(mime, 0.95), filename);
    })
    .catch((err) => {
      console.error("html2canvas 실패", err);
      alert("이미지 저장에 실패했습니다");
    });
}

function exportSVG() {
  const filename = `${_baseFileName()}.svg`;
  if (lastSVGString) {
    const blob = new Blob([lastSVGString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    _triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (chartInstance) {
    showToast("SVG는 이 차트 유형에서 지원되지 않습니다. PNG/JPG로 저장해주세요.");
    return;
  }
  showToast("내보낼 그래프가 없습니다");
}

function _buildExportRows() {
  const schema = getInputSchema();
  const rows = readForm().filter((r) =>
    Object.values(r).some((v) => String(v).trim() !== "")
  );
  const headers = schema.fields.map((f) => f.label);
  const dataRows = rows.map((r) => schema.fields.map((f) => r[f.key] ?? ""));
  return { headers, dataRows };
}

function _toCSV(headers, rows) {
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [headers, ...rows].map((row) => row.map(esc).join(",")).join("\r\n");
}

async function _copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // fallthrough
  }
  // fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch (e) {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

async function exportGoogleSheets() {
  const { headers, dataRows } = _buildExportRows();
  const csv = _toCSV(headers, dataRows);
  const ok = await _copyToClipboard(csv);
  window.open("https://docs.google.com/spreadsheets/create", "_blank", "noopener,noreferrer");
  showToast(ok
    ? "데이터가 클립보드에 복사됐어요! 구글 시트에서 붙여넣기(Ctrl+V) 하세요"
    : "구글 시트 새 탭을 열었어요. 데이터 복사는 수동으로 진행해주세요."
  );
}

async function exportGoogleDocs() {
  const { headers, dataRows } = _buildExportRows();
  const lines = [];
  lines.push(`■ ${chart.name}`);
  if (chart.description) lines.push(chart.description);
  lines.push("");
  lines.push(headers.join("\t"));
  dataRows.forEach((r) => lines.push(r.join("\t")));
  const text = lines.join("\n");
  const ok = await _copyToClipboard(text);
  window.open("https://docs.google.com/document/create", "_blank", "noopener,noreferrer");
  showToast(ok
    ? "내용이 클립보드에 복사됐어요! 구글 독스에서 붙여넣기(Ctrl+V) 하세요"
    : "구글 독스 새 탭을 열었어요. 내용 복사는 수동으로 진행해주세요."
  );
}

function showToast(msg) {
  const el = document.getElementById("exportToast");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  el.style.opacity = "1";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => (el.style.display = "none"), 250);
  }, 3000);
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
