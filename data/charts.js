// 차트 샘플 데이터 (57개 / 12개 카테고리)
// compatibleWith: 복합 차트 모드에서 함께 섞을 수 있는 Chart.js 렌더 타입 목록
const CHARTS = [
  // ===== 비교 (6) =====
  {
    id: "bar-vertical",
    name: "세로 막대",
    category: "비교",
    tags: ["비교", "엑셀", "초급"],
    description: "항목 간 크기를 한눈에 비교할 때 가장 기본적으로 사용하는 차트.",
    useCases: ["월별 매출 비교", "부서별 인원 현황", "제품별 판매량 비교"],
    difficulty: "초급",
    tools: ["엑셀", "구글시트", "파이썬"],
    chartType: "bar",
    compatibleWith: ["line", "scatter", "bubble"],
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "매출", data: [120, 190, 150] }]
    }
  },
  {
    id: "bar-horizontal",
    name: "가로 막대",
    category: "비교",
    tags: ["비교", "순위", "초급"],
    description: "항목명이 길거나 항목 수가 많을 때 가독성이 좋은 비교 차트. 순위 강조에 적합.",
    useCases: ["상품별 판매 순위 TOP 10", "설문 응답 항목 비교", "지역별 인구 순위"],
    difficulty: "초급",
    tools: ["엑셀", "구글시트", "Tableau"],
    chartType: "horizontalBar",
    compatibleWith: [],
    sampleData: {
      labels: ["서울", "부산", "인천"],
      datasets: [{ label: "인구", data: [950, 340, 290] }]
    }
  },
  {
    id: "dot-plot",
    name: "점도표",
    category: "비교",
    tags: ["비교", "점", "중급"],
    description: "막대 대신 점으로 값을 표시해 항목 간 차이를 깔끔하게 비교하는 차트.",
    useCases: ["국가별 GDP 비교", "선수별 기록 비교", "지점별 평균 매출"],
    difficulty: "중급",
    tools: ["파이썬", "R", "Tableau"],
    chartType: "bar",
    compatibleWith: ["line", "bubble"],
    sampleData: {
      labels: ["A팀", "B팀", "C팀"],
      datasets: [{ label: "점수", data: [78, 92, 85] }]
    }
  },
  {
    id: "bullet",
    name: "불릿 차트",
    category: "비교",
    tags: ["비교", "KPI", "중급"],
    description: "목표 대비 실적을 한 줄로 비교하는 KPI 대시보드용 차트.",
    useCases: ["월별 KPI 달성률", "영업팀 목표 추적", "프로젝트 진척도"],
    difficulty: "중급",
    tools: ["Tableau", "PowerBI", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["목표", "실적", "예측"],
      datasets: [{ label: "달성률(%)", data: [100, 87, 95] }]
    }
  },
  {
    id: "radar",
    name: "방사형",
    category: "비교",
    tags: ["비교", "다차원", "중급"],
    description: "여러 항목의 점수를 다각형으로 비교해 균형 정도를 보여주는 차트.",
    useCases: ["선수 능력치 비교", "제품 기능 평가", "역량 평가"],
    difficulty: "중급",
    tools: ["엑셀", "Chart.js", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["기획", "개발", "디자인"],
      datasets: [{ label: "역량", data: [80, 90, 70] }]
    }
  },
  {
    id: "pyramid",
    name: "피라미드",
    category: "비교",
    tags: ["비교", "계층", "중급"],
    description: "위계나 비중을 피라미드 형태로 나타내 상하 구조를 시각적으로 강조하는 차트.",
    useCases: ["연령대별 인구 구조", "조직 직급 분포", "매슬로 욕구 단계"],
    difficulty: "중급",
    tools: ["엑셀", "PowerPoint", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["임원", "관리자", "실무자"],
      datasets: [{ label: "인원", data: [5, 20, 75] }]
    }
  },

  // ===== 구성 (6) =====
  {
    id: "pie",
    name: "파이",
    category: "구성",
    tags: ["구성", "비율", "초급"],
    description: "전체에서 각 항목이 차지하는 비율을 한눈에 보여주는 차트.",
    useCases: ["시장 점유율", "예산 사용 비중", "응답자 연령대 분포"],
    difficulty: "초급",
    tools: ["엑셀", "구글시트", "Chart.js"],
    chartType: "pie",
    compatibleWith: [],
    sampleData: {
      labels: ["A", "B", "C"],
      datasets: [{ label: "비율", data: [50, 30, 20] }]
    }
  },
  {
    id: "doughnut",
    name: "도넛",
    category: "구성",
    tags: ["구성", "비율", "초급"],
    description: "파이 차트의 변형으로 가운데 공간에 핵심 수치를 넣을 수 있는 차트.",
    useCases: ["대시보드 요약 지표", "캠페인 채널 기여도", "OS 점유율"],
    difficulty: "초급",
    tools: ["엑셀", "Chart.js", "D3.js"],
    chartType: "doughnut",
    compatibleWith: [],
    sampleData: {
      labels: ["모바일", "데스크탑", "태블릿"],
      datasets: [{ label: "트래픽", data: [60, 30, 10] }]
    }
  },
  {
    id: "stacked-bar",
    name: "누적 막대",
    category: "구성",
    tags: ["구성", "누적", "중급"],
    description: "각 막대 내부에서 항목 구성 비율을 함께 보여주는 차트.",
    useCases: ["분기별 매출 구성", "연령대별 응답 비교", "지역별 인구 구성"],
    difficulty: "중급",
    tools: ["엑셀", "Tableau", "파이썬"],
    chartType: "bar",
    compatibleWith: ["line", "scatter", "bubble"],
    sampleData: {
      labels: ["Q1", "Q2", "Q3"],
      datasets: [{ label: "온라인", data: [40, 55, 65] }]
    }
  },
  {
    id: "stacked-area",
    name: "누적 영역",
    category: "구성",
    tags: ["구성", "추세", "중급"],
    description: "시간 흐름에 따라 구성 비율이 어떻게 변화하는지 보여주는 차트.",
    useCases: ["시간별 트래픽 채널 변화", "분기별 매출 구성 추이", "사용자 세그먼트 변화"],
    difficulty: "중급",
    tools: ["Tableau", "파이썬", "D3.js"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["2023", "2024", "2025"],
      datasets: [{ label: "유료 사용자", data: [200, 350, 480] }]
    }
  },
  {
    id: "waterfall",
    name: "워터폴",
    category: "구성",
    tags: ["구성", "증감", "중급"],
    description: "시작값에서 증감 항목을 거쳐 최종값에 이르는 과정을 단계별로 보여주는 차트.",
    useCases: ["손익 분석", "예산 변동 분석", "월별 사용자 증감"],
    difficulty: "중급",
    tools: ["엑셀", "PowerBI", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["시작", "수익", "비용"],
      datasets: [{ label: "변동", data: [100, 80, -40] }]
    }
  },
  {
    id: "marimekko",
    name: "마리메꼬",
    category: "구성",
    tags: ["구성", "이중분할", "고급"],
    description: "막대의 너비와 높이를 동시에 활용해 2차원 구성 비율을 보여주는 차트.",
    useCases: ["세그먼트×제품 매출 구조", "시장 규모×점유율", "산업×지역 분석"],
    difficulty: "고급",
    tools: ["Tableau", "PowerBI", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["산업A", "산업B", "산업C"],
      datasets: [{ label: "비중", data: [45, 30, 25] }]
    }
  },

  // ===== 분포 (5) =====
  {
    id: "histogram",
    name: "히스토그램",
    category: "분포",
    tags: ["분포", "빈도", "중급"],
    description: "값의 구간별 빈도를 막대 형태로 보여주는 분포 차트.",
    useCases: ["시험 점수 분포", "응답 시간 분포", "고객 연령 분포"],
    difficulty: "중급",
    tools: ["파이썬", "R", "엑셀"],
    chartType: "bar",
    compatibleWith: ["line", "scatter", "bubble"],
    sampleData: {
      labels: ["0~30", "30~60", "60~90"],
      datasets: [{ label: "빈도", data: [12, 45, 28] }]
    }
  },
  {
    id: "boxplot",
    name: "박스플롯",
    category: "분포",
    tags: ["분포", "통계", "고급"],
    description: "최솟값, 사분위수, 최댓값, 이상치를 한 박스로 표현해 분포를 요약하는 차트.",
    useCases: ["그룹별 점수 분포 비교", "실험 결과의 이상치 탐지", "급여 분포"],
    difficulty: "고급",
    tools: ["파이썬", "R", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A그룹", "B그룹", "C그룹"],
      datasets: [{ label: "중앙값", data: [55, 62, 70] }]
    }
  },
  {
    id: "scatter",
    name: "산점도",
    category: "분포",
    tags: ["분포", "관계", "중급"],
    description: "두 변수의 값을 점으로 찍어 분포 패턴과 상관관계를 살펴보는 차트.",
    useCases: ["광고비 vs 매출 분석", "공부 시간 vs 점수", "키 vs 몸무게"],
    difficulty: "중급",
    tools: ["파이썬", "R", "엑셀"],
    chartType: "bar",
    compatibleWith: ["line", "bubble"],
    sampleData: {
      labels: ["샘플1", "샘플2", "샘플3"],
      datasets: [{ label: "값", data: [25, 60, 88] }]
    }
  },
  {
    id: "bubble",
    name: "버블",
    category: "분포",
    tags: ["분포", "3차원", "고급"],
    description: "산점도에 점의 크기로 세 번째 변수를 추가 표현하는 차트.",
    useCases: ["국가별 GDP/인구/기대수명", "제품 가격/매출/리뷰수", "광고 캠페인 성과"],
    difficulty: "고급",
    tools: ["파이썬", "Tableau", "D3.js"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["제품A", "제품B", "제품C"],
      datasets: [{ label: "매출", data: [150, 300, 220] }]
    }
  },
  {
    id: "violin",
    name: "바이올린",
    category: "분포",
    tags: ["분포", "밀도", "고급"],
    description: "박스플롯과 밀도 곡선을 결합해 분포의 형태까지 보여주는 차트.",
    useCases: ["그룹별 점수 분포 형태", "약효 실험군 비교", "연봉 분포 분석"],
    difficulty: "고급",
    tools: ["파이썬", "R", "Seaborn"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["대조군", "실험A", "실험B"],
      datasets: [{ label: "평균", data: [50, 65, 72] }]
    }
  },

  // ===== 추세 (5) =====
  {
    id: "line",
    name: "꺾은선",
    category: "추세",
    tags: ["추세", "시계열", "초급"],
    description: "시간 흐름에 따른 값의 변화를 선으로 잇는 가장 기본적인 추세 차트.",
    useCases: ["월별 매출 추이", "일별 방문자 수", "주가 변동"],
    difficulty: "초급",
    tools: ["엑셀", "Chart.js", "파이썬"],
    chartType: "line",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "방문자", data: [320, 450, 510] }]
    }
  },
  {
    id: "dual-axis",
    name: "이중축",
    category: "추세",
    tags: ["추세", "다지표", "중급"],
    description: "단위가 다른 두 지표를 좌우 축에 함께 표시하는 차트.",
    useCases: ["매출과 전환율 동시 비교", "온도와 강수량", "방문자수와 이탈률"],
    difficulty: "중급",
    tools: ["엑셀", "Tableau", "파이썬"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "매출", data: [120, 180, 240] }]
    }
  },
  {
    id: "forecast-line",
    name: "예측선",
    category: "추세",
    tags: ["추세", "예측", "고급"],
    description: "실측값 뒤에 예측값을 점선으로 이어 미래 추세를 보여주는 차트.",
    useCases: ["매출 예측", "사용자 성장 예측", "수요 예측"],
    difficulty: "고급",
    tools: ["파이썬", "R", "PowerBI"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["과거", "현재", "예측"],
      datasets: [{ label: "값", data: [200, 280, 340] }]
    }
  },
  {
    id: "area",
    name: "영역",
    category: "추세",
    tags: ["추세", "면적", "초급"],
    description: "꺾은선 아래 면적을 채워 누적 규모와 추세를 동시에 보여주는 차트.",
    useCases: ["누적 가입자 추이", "누적 매출", "총 방문 시간"],
    difficulty: "초급",
    tools: ["엑셀", "Chart.js", "Tableau"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["Q1", "Q2", "Q3"],
      datasets: [{ label: "누적", data: [100, 240, 410] }]
    }
  },
  {
    id: "sparkline",
    name: "스파크라인",
    category: "추세",
    tags: ["추세", "압축", "초급"],
    description: "축 없이 작은 공간에 추세만 압축해서 표현하는 미니 라인 차트.",
    useCases: ["대시보드 카드 안 추세 미리보기", "표 안의 KPI 변화", "리포트 인라인 시각화"],
    difficulty: "초급",
    tools: ["엑셀", "Tableau", "D3.js"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["W1", "W2", "W3"],
      datasets: [{ label: "추세", data: [40, 55, 70] }]
    }
  },

  // ===== 관계 (5) =====
  {
    id: "bubble-matrix",
    name: "버블 매트릭스",
    category: "관계",
    tags: ["관계", "매트릭스", "고급"],
    description: "행/열 격자 위에 버블 크기로 두 범주의 교차 관계를 보여주는 차트.",
    useCases: ["제품×지역 매출 매트릭스", "세그먼트×채널 분석", "역량×직무 매핑"],
    difficulty: "고급",
    tools: ["Tableau", "D3.js", "파이썬"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["A×1", "A×2", "B×1"],
      datasets: [{ label: "교차값", data: [40, 60, 25] }]
    }
  },
  {
    id: "heatmap",
    name: "히트맵",
    category: "관계",
    tags: ["관계", "밀도", "중급"],
    description: "행/열 셀의 색 농도로 값의 크기를 표현해 패턴을 한눈에 보여주는 차트.",
    useCases: ["요일×시간 트래픽 패턴", "지역×연령 응답 분포", "상관행렬 시각화"],
    difficulty: "중급",
    tools: ["파이썬", "R", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["월", "화", "수"],
      datasets: [{ label: "방문", data: [80, 110, 95] }]
    }
  },
  {
    id: "scatter-matrix",
    name: "산점도 매트릭스",
    category: "관계",
    tags: ["관계", "다변량", "고급"],
    description: "여러 변수의 두 변수 조합 산점도를 격자로 펼쳐 전체 관계를 한 번에 보는 차트.",
    useCases: ["다변량 탐색 분석", "지표 간 관계 점검", "데이터 사이언스 EDA"],
    difficulty: "고급",
    tools: ["파이썬", "R", "Seaborn"],
    chartType: "bar",
    compatibleWith: ["line", "bubble"],
    sampleData: {
      labels: ["X-Y", "X-Z", "Y-Z"],
      datasets: [{ label: "상관", data: [70, 45, 60] }]
    }
  },
  {
    id: "correlation",
    name: "상관관계",
    category: "관계",
    tags: ["관계", "통계", "중급"],
    description: "변수 간 상관계수를 색상 매트릭스로 시각화해 관계 강도를 보여주는 차트.",
    useCases: ["피처 간 상관 점검", "지표 의존성 분석", "통계 보고서"],
    difficulty: "중급",
    tools: ["파이썬", "R", "엑셀"],
    chartType: "bar",
    compatibleWith: ["line", "bubble"],
    sampleData: {
      labels: ["A-B", "A-C", "B-C"],
      datasets: [{ label: "상관계수×100", data: [85, 30, 55] }]
    }
  },
  {
    id: "chord-diagram",
    name: "코드 다이어그램",
    category: "관계",
    tags: ["관계", "원형", "고급"],
    description: "원형 둘레의 노드 사이를 곡선 띠로 이어 양방향 관계의 강도를 보여주는 차트.",
    useCases: ["국가 간 무역 흐름", "부서 간 협업 빈도", "장르 간 곡 추천 관계"],
    difficulty: "고급",
    tools: ["D3.js", "파이썬", "R"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A→B", "B→C", "C→A"],
      datasets: [{ label: "흐름", data: [120, 90, 60] }]
    }
  },

  // ===== 흐름 (5) =====
  {
    id: "cascade",
    name: "폭포수",
    category: "흐름",
    tags: ["흐름", "단계", "중급"],
    description: "단계별 증감을 누적해 흐름을 보여주는 차트. 손익 분해에 자주 사용.",
    useCases: ["매출 → 이익 단계 분해", "사용자 깔때기 변화", "비용 구조 분석"],
    difficulty: "중급",
    tools: ["엑셀", "PowerBI", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["매출", "비용", "이익"],
      datasets: [{ label: "금액", data: [500, 300, 200] }]
    }
  },
  {
    id: "funnel",
    name: "퍼널",
    category: "흐름",
    tags: ["흐름", "전환", "초급"],
    description: "단계별로 줄어드는 값을 깔때기 모양으로 보여주는 전환율 차트.",
    useCases: ["회원가입 전환율", "구매 깔때기", "지원자→합격자 흐름"],
    difficulty: "초급",
    tools: ["GA", "Mixpanel", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["방문", "장바구니", "결제"],
      datasets: [{ label: "사용자", data: [1000, 320, 110] }]
    }
  },
  {
    id: "gantt",
    name: "간트",
    category: "흐름",
    tags: ["흐름", "일정", "중급"],
    description: "작업별 시작/종료 시점을 가로 막대로 표현해 일정을 관리하는 차트.",
    useCases: ["프로젝트 일정 관리", "마일스톤 추적", "배포 스케줄"],
    difficulty: "중급",
    tools: ["Jira", "Notion", "MS Project"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["기획", "디자인", "개발"],
      datasets: [{ label: "기간(일)", data: [7, 10, 21] }]
    }
  },
  {
    id: "sankey",
    name: "산키",
    category: "흐름",
    tags: ["흐름", "이동", "고급"],
    description: "노드 간 흐름의 양을 띠 굵기로 표현해 자원/사용자 이동을 보여주는 차트.",
    useCases: ["사용자 경로 분석", "에너지 흐름", "예산 배분 흐름"],
    difficulty: "고급",
    tools: ["D3.js", "Tableau", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["유입→상품", "상품→결제", "결제→완료"],
      datasets: [{ label: "흐름량", data: [800, 350, 220] }]
    }
  },
  {
    id: "timeline-flow",
    name: "타임라인",
    category: "흐름",
    tags: ["흐름", "이벤트", "초급"],
    description: "시간 축 위에 사건을 점/막대로 배치해 흐름과 순서를 보여주는 차트.",
    useCases: ["프로젝트 마일스톤", "제품 출시 히스토리", "사용자 여정 기록"],
    difficulty: "초급",
    tools: ["Notion", "Miro", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["기획", "출시", "확장"],
      datasets: [{ label: "이벤트 수", data: [3, 6, 4] }]
    }
  },

  // ===== 구조 (5) =====
  {
    id: "treemap",
    name: "트리맵",
    category: "구조",
    tags: ["구조", "비율", "중급"],
    description: "사각형 면적으로 계층 구조의 비중을 보여주는 차트.",
    useCases: ["카테고리별 매출 비중", "포트폴리오 자산 비중", "디스크 사용량"],
    difficulty: "중급",
    tools: ["Tableau", "D3.js", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["식품", "전자", "의류"],
      datasets: [{ label: "매출 비중", data: [45, 35, 20] }]
    }
  },
  {
    id: "org-chart",
    name: "조직도",
    category: "구조",
    tags: ["구조", "계층", "초급"],
    description: "조직의 보고 체계를 위계적으로 보여주는 다이어그램.",
    useCases: ["회사 조직도", "팀 구조 시각화", "보고 체계"],
    difficulty: "초급",
    tools: ["PowerPoint", "Visio", "draw.io"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["임원", "팀장", "팀원"],
      datasets: [{ label: "인원", data: [3, 12, 48] }]
    }
  },
  {
    id: "mind-map",
    name: "마인드맵",
    category: "구조",
    tags: ["구조", "발산", "초급"],
    description: "중심 주제에서 가지처럼 뻗어 나가는 아이디어 정리용 차트.",
    useCases: ["기획 회의 정리", "학습 노트", "브레인스토밍 결과 요약"],
    difficulty: "초급",
    tools: ["XMind", "Miro", "Notion"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["전략", "운영", "기술"],
      datasets: [{ label: "노드 수", data: [8, 6, 10] }]
    }
  },
  {
    id: "matrix",
    name: "매트릭스",
    category: "구조",
    tags: ["구조", "분류", "중급"],
    description: "두 축의 기준으로 항목을 사분면에 배치해 의사결정을 돕는 차트.",
    useCases: ["BCG 매트릭스", "우선순위 분석(중요도×긴급도)", "리스크 평가"],
    difficulty: "중급",
    tools: ["PowerPoint", "Miro", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["1사분면", "2사분면", "3사분면"],
      datasets: [{ label: "항목 수", data: [5, 8, 3] }]
    }
  },
  {
    id: "sunburst",
    name: "선버스트",
    category: "구조",
    tags: ["구조", "방사형", "중급"],
    description: "도넛을 여러 겹 쌓아 계층 구조와 비율을 동시에 보여주는 차트.",
    useCases: ["카테고리 → 서브카테고리 매출", "파일 시스템 용량", "조직 인력 구성"],
    difficulty: "중급",
    tools: ["D3.js", "Tableau", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["1단계", "2단계", "3단계"],
      datasets: [{ label: "비중", data: [50, 30, 20] }]
    }
  },

  // ===== 지리 (4) =====
  {
    id: "choropleth-map",
    name: "코로플레스 맵",
    category: "지리",
    tags: ["지리", "지도", "중급"],
    description: "지역 경계 안쪽을 색의 농도로 채워 값의 분포를 보여주는 단계구분도.",
    useCases: ["시도별 인구 밀도", "국가별 평균 소득", "지역별 선거 결과"],
    difficulty: "중급",
    tools: ["Tableau", "QGIS", "Mapbox"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["서울", "경기", "부산"],
      datasets: [{ label: "지수", data: [88, 76, 62] }]
    }
  },
  {
    id: "bubble-map",
    name: "버블 맵",
    category: "지리",
    tags: ["지리", "위치", "중급"],
    description: "지도 위 좌표에 버블 크기로 값의 크기를 표시해 위치별 규모를 보여주는 차트.",
    useCases: ["도시별 매장 매출 규모", "이벤트 발생 위치", "공항 트래픽"],
    difficulty: "중급",
    tools: ["Tableau", "Mapbox", "Leaflet"],
    chartType: "bar",
    compatibleWith: ["bar", "scatter"],
    sampleData: {
      labels: ["서울", "도쿄", "뉴욕"],
      datasets: [{ label: "매출", data: [500, 380, 620] }]
    }
  },
  {
    id: "heatmap-geo",
    name: "히트맵(지리)",
    category: "지리",
    tags: ["지리", "밀도", "중급"],
    description: "지도 위 점들의 밀도를 색 그라데이션으로 표현하는 지리 히트맵.",
    useCases: ["범죄 발생 밀도", "관광 핫스팟", "교통 사고 위치 분포"],
    difficulty: "중급",
    tools: ["Mapbox", "Leaflet", "Kepler.gl"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A지구", "B지구", "C지구"],
      datasets: [{ label: "밀도", data: [120, 90, 60] }]
    }
  },
  {
    id: "flow-map",
    name: "플로우 맵",
    category: "지리",
    tags: ["지리", "이동", "고급"],
    description: "지점 간 이동을 곡선/화살표로 이어 흐름과 양을 함께 보여주는 지도 차트.",
    useCases: ["국가 간 이주 흐름", "물류 노선", "비행 노선 트래픽"],
    difficulty: "고급",
    tools: ["Kepler.gl", "Mapbox", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["서울→도쿄", "도쿄→LA", "LA→파리"],
      datasets: [{ label: "이동량", data: [320, 410, 180] }]
    }
  },

  // ===== 금융 (4) =====
  {
    id: "candlestick",
    name: "캔들스틱",
    category: "금융",
    tags: ["금융", "시세", "중급"],
    description: "시가/고가/저가/종가를 캔들 모양으로 나타내 시세 변동을 보여주는 차트.",
    useCases: ["주가 일봉 차트", "환율 변동", "암호화폐 시세"],
    difficulty: "중급",
    tools: ["TradingView", "파이썬", "Highcharts"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["월", "화", "수"],
      datasets: [{ label: "종가", data: [125, 138, 132] }]
    }
  },
  {
    id: "ohlc",
    name: "OHLC",
    category: "금융",
    tags: ["금융", "시세", "중급"],
    description: "막대 양옆에 시가/종가 표시를 더해 가격 흐름을 단순하게 보여주는 차트.",
    useCases: ["선물/옵션 가격", "환율 변동 추이", "장기 시세 모니터링"],
    difficulty: "중급",
    tools: ["TradingView", "Highcharts", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["1일", "2일", "3일"],
      datasets: [{ label: "종가", data: [105, 112, 108] }]
    }
  },
  {
    id: "waterfall-finance",
    name: "워터폴(금융)",
    category: "금융",
    tags: ["금융", "손익", "중급"],
    description: "매출에서 비용 항목을 차감하며 영업이익까지 분해 흐름을 보여주는 손익 워터폴.",
    useCases: ["손익계산서 시각화", "이익 증감 분석", "예산 차이 분석"],
    difficulty: "중급",
    tools: ["엑셀", "PowerBI", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["매출", "원가", "이익"],
      datasets: [{ label: "금액", data: [1000, -600, 400] }]
    }
  },
  {
    id: "bullet-finance",
    name: "불릿(금융)",
    category: "금융",
    tags: ["금융", "KPI", "중급"],
    description: "재무 목표 대비 실적과 임계 구간을 한 줄로 보여주는 KPI 불릿 차트.",
    useCases: ["분기 매출 목표 대비 실적", "예산 대비 집행률", "투자 수익률"],
    difficulty: "중급",
    tools: ["Tableau", "PowerBI", "엑셀"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["목표", "실적", "예측"],
      datasets: [{ label: "달성", data: [100, 78, 92] }]
    }
  },

  // ===== 텍스트 (4) =====
  {
    id: "word-cloud",
    name: "워드 클라우드",
    category: "텍스트",
    tags: ["텍스트", "빈도", "초급"],
    description: "단어 빈도를 글자 크기로 표현해 어떤 단어가 자주 쓰였는지 보여주는 차트.",
    useCases: ["고객 리뷰 키워드 요약", "기사 토픽 모니터링", "설문 자유응답 분석"],
    difficulty: "초급",
    tools: ["파이썬", "R", "wordcloud2"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["가성비", "디자인", "배송"],
      datasets: [{ label: "빈도", data: [120, 80, 50] }]
    }
  },
  {
    id: "timeline-text",
    name: "타임라인(텍스트)",
    category: "텍스트",
    tags: ["텍스트", "기록", "초급"],
    description: "시간 축에 텍스트 이벤트를 나열해 변천사나 히스토리를 보여주는 차트.",
    useCases: ["회사 연혁", "사건 연표", "버전 릴리스 노트"],
    difficulty: "초급",
    tools: ["Notion", "TimelineJS", "Miro"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["2020", "2022", "2024"],
      datasets: [{ label: "이벤트 수", data: [4, 7, 5] }]
    }
  },
  {
    id: "network-diagram",
    name: "네트워크 다이어그램",
    category: "텍스트",
    tags: ["텍스트", "관계", "고급"],
    description: "텍스트 노드와 엣지로 단어/개념 사이의 연결 관계를 보여주는 차트.",
    useCases: ["키워드 동시출현 분석", "인물 관계망", "지식 그래프"],
    difficulty: "고급",
    tools: ["Gephi", "D3.js", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A-B", "B-C", "A-C"],
      datasets: [{ label: "연결 강도", data: [50, 30, 20] }]
    }
  },
  {
    id: "sociogram",
    name: "소시오그램",
    category: "텍스트",
    tags: ["텍스트", "사회망", "고급"],
    description: "사람 사이의 관계를 노드와 화살표로 표현해 사회적 연결망을 보여주는 차트.",
    useCases: ["학급 친구 관계", "조직 내 협업 네트워크", "팔로우 관계 분석"],
    difficulty: "고급",
    tools: ["Gephi", "NodeXL", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A→B", "B→C", "C→A"],
      datasets: [{ label: "연결", data: [4, 6, 3] }]
    }
  },

  // ===== 비율 (4) =====
  {
    id: "waffle",
    name: "와플 차트",
    category: "비율",
    tags: ["비율", "그리드", "초급"],
    description: "10×10 등 격자 칸을 색으로 채워 백분율을 직관적으로 보여주는 차트.",
    useCases: ["설문 응답 비율", "참여율 표시", "프로젝트 완료율"],
    difficulty: "초급",
    tools: ["D3.js", "Tableau", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["완료", "진행", "대기"],
      datasets: [{ label: "비율(%)", data: [60, 25, 15] }]
    }
  },
  {
    id: "pictogram",
    name: "픽토그램",
    category: "비율",
    tags: ["비율", "아이콘", "초급"],
    description: "사람/사물 아이콘 개수로 비율이나 수량을 보여주는 차트.",
    useCases: ["10명 중 ○명 응답", "인포그래픽 통계", "공익 캠페인 자료"],
    difficulty: "초급",
    tools: ["PowerPoint", "Canva", "Infogram"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["찬성", "반대", "중립"],
      datasets: [{ label: "응답자", data: [7, 2, 1] }]
    }
  },
  {
    id: "ratio-stack",
    name: "비율 스택",
    category: "비율",
    tags: ["비율", "100%", "초급"],
    description: "각 막대를 100%로 정규화해 항목별 구성 비율을 비교하는 차트.",
    useCases: ["연도별 응답 구성 비교", "지점별 매출 구성", "세그먼트 구성 추이"],
    difficulty: "초급",
    tools: ["엑셀", "Tableau", "PowerBI"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A", "B", "C"],
      datasets: [{ label: "비율", data: [40, 35, 25] }]
    }
  },
  {
    id: "square-pie",
    name: "스퀘어 파이",
    category: "비율",
    tags: ["비율", "사각형", "초급"],
    description: "큰 정사각형 안을 비율만큼 색으로 채워 한눈에 비중을 보여주는 차트.",
    useCases: ["대시보드 단일 지표 표시", "달성률 시각화", "보고서 요약 카드"],
    difficulty: "초급",
    tools: ["D3.js", "Tableau", "PowerBI"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["달성", "잔여"],
      datasets: [{ label: "비율", data: [72, 28] }]
    }
  },

  // ===== 복합 (4) =====
  {
    id: "combo-chart",
    name: "콤보 차트",
    category: "복합",
    tags: ["복합", "혼합", "중급"],
    description: "막대와 선을 한 차트에 함께 그려 양과 추세를 동시에 보여주는 차트.",
    useCases: ["월별 매출(막대) + 성장률(선)", "방문자(막대) + 전환율(선)", "생산량 + 평균 단가"],
    difficulty: "중급",
    tools: ["엑셀", "Tableau", "Chart.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "매출", data: [120, 180, 220] }]
    }
  },
  {
    id: "dashboard-card",
    name: "대시보드 카드",
    category: "복합",
    tags: ["복합", "KPI", "초급"],
    description: "큰 숫자와 작은 추세선/변화율을 한 카드에 결합한 KPI 요약 차트.",
    useCases: ["핵심 지표 카드", "주간 리포트 헤더", "임원 대시보드"],
    difficulty: "초급",
    tools: ["PowerBI", "Tableau", "Looker"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["전주", "금주", "변화"],
      datasets: [{ label: "DAU", data: [4200, 4680, 480] }]
    }
  },
  {
    id: "gauge",
    name: "게이지 차트",
    category: "복합",
    tags: ["복합", "달성률", "초급"],
    description: "반원형 게이지로 단일 지표의 달성률이나 임계 구간을 보여주는 차트.",
    useCases: ["KPI 달성률", "서버 사용률", "고객 만족도 점수"],
    difficulty: "초급",
    tools: ["엑셀", "PowerBI", "Highcharts"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["현재", "목표", "최대"],
      datasets: [{ label: "값", data: [72, 100, 120] }]
    }
  },
  {
    id: "bullet-bar",
    name: "불릿+막대",
    category: "복합",
    tags: ["복합", "혼합", "중급"],
    description: "막대 위에 목표 마커와 임계 구간을 겹쳐 그린 KPI 비교용 복합 차트.",
    useCases: ["부서별 목표 대비 실적", "예산 대비 집행 비교", "프로젝트 KPI 대시보드"],
    difficulty: "중급",
    tools: ["Tableau", "PowerBI", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    sampleData: {
      labels: ["A팀", "B팀", "C팀"],
      datasets: [{ label: "달성률", data: [85, 110, 72] }]
    }
  }
];
