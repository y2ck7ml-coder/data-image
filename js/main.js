const grid = document.getElementById("cardGrid");
const tabs = document.getElementById("categoryTabs");

function getCategories() {
  const unique = [...new Set(CHARTS.map((c) => c.category))];
  return ["전체", ...unique];
}

function renderTabs(activeCategory) {
  tabs.innerHTML = getCategories()
    .map(
      (cat) => `
        <button type="button" class="tab${cat === activeCategory ? " active" : ""}" data-category="${cat}">${cat}</button>
      `
    )
    .join("");
}

function renderCards(category) {
  const list =
    category === "전체"
      ? CHARTS
      : CHARTS.filter((c) => c.category === category);

  grid.innerHTML = list
    .map(
      (c) => `
        <article class="card" data-id="${c.id}">
          <div class="card-thumb"></div>
          <div class="card-body">
            <div class="card-name">${c.name}</div>
            <div class="card-tags">
              ${c.tags.map((t) => `<span class="card-tag">${t}</span>`).join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

tabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  renderCards(btn.dataset.category);
});

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  location.href = `chart.html?id=${encodeURIComponent(card.dataset.id)}`;
});

renderTabs("전체");
renderCards("전체");

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
