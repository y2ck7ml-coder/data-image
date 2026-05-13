// 차트 샘플 데이터 (81개 / 16개 카테고리)
// compatibleWith: 복합 차트 모드에서 함께 섞을 수 있는 Chart.js 렌더 타입 목록
// inputType: 사용자 입력 UI 유형
//   - numeric      : 항목명 + 수치 (막대/선/원 등)
//   - ratio        : 항목명 + 비율/수량 (파이/도넛/트리맵)
//   - timeseries   : 날짜/기간 + 수치 (라인/주가/캔들)
//   - relational   : 노드 명칭 + 비중(선택) (마인드맵/조직도/네트워크)
//   - flow         : 단계명 + 수치(선택) (퍼널/플로우/타임라인)
//   - distribution : 구간/그룹 + 빈도/수치 (히스토그램/박스/바이올린)
//   - multiaxis    : 항목명 + 복수 축 수치 (레이더/버블/간트)
// exampleData: 차트별 맞춤 예시 데이터 ({ labels, values })
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
    inputType: "numeric",
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "매출", data: [120, 190, 150] }]
    },
    exampleData: {
      labels: ["1월", "2월", "3월", "4월", "5월"],
      values: [320, 450, 380, 520, 610]
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
    inputType: "numeric",
    sampleData: {
      labels: ["서울", "부산", "인천"],
      datasets: [{ label: "인구", data: [950, 340, 290] }]
    },
    exampleData: {
      labels: ["서울", "부산", "인천", "대구", "광주"],
      values: [958, 341, 294, 243, 148]
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
    inputType: "numeric",
    sampleData: {
      labels: ["A팀", "B팀", "C팀"],
      datasets: [{ label: "점수", data: [78, 92, 85] }]
    },
    exampleData: {
      labels: ["A팀", "B팀", "C팀", "D팀", "E팀"],
      values: [78, 92, 85, 68, 74]
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
    inputType: "numeric",
    sampleData: {
      labels: ["목표", "실적", "예측"],
      datasets: [{ label: "달성률(%)", data: [100, 87, 95] }]
    },
    exampleData: {
      labels: ["실적", "목표", "예측", "평균", "최대"],
      values: [87, 100, 95, 82, 120]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["기획", "개발", "디자인"],
      datasets: [{ label: "역량", data: [80, 90, 70] }]
    },
    exampleData: {
      labels: ["기획", "개발", "디자인", "마케팅", "운영"],
      values: [80, 90, 70, 75, 85]
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
    inputType: "distribution",
    sampleData: {
      labels: ["임원", "관리자", "실무자"],
      datasets: [{ label: "인원", data: [5, 20, 75] }]
    },
    exampleData: {
      labels: ["임원", "팀장", "팀원", "인턴", "협력사"],
      values: [5, 15, 60, 12, 8]
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
    inputType: "ratio",
    sampleData: {
      labels: ["A", "B", "C"],
      datasets: [{ label: "비율", data: [50, 30, 20] }]
    },
    exampleData: {
      labels: ["A 브랜드", "B 브랜드", "C 브랜드", "D 브랜드", "기타"],
      values: [42, 28, 16, 9, 5]
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
    inputType: "ratio",
    sampleData: {
      labels: ["모바일", "데스크탑", "태블릿"],
      datasets: [{ label: "트래픽", data: [60, 30, 10] }]
    },
    exampleData: {
      labels: ["모바일", "데스크탑", "태블릿", "TV", "기타"],
      values: [62, 26, 8, 3, 1]
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
    inputType: "ratio",
    sampleData: {
      labels: ["Q1", "Q2", "Q3"],
      datasets: [{ label: "온라인", data: [40, 55, 65] }]
    },
    exampleData: {
      labels: ["Q1", "Q2", "Q3", "Q4", "연간"],
      values: [320, 410, 480, 560, 1770]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["2023", "2024", "2025"],
      datasets: [{ label: "유료 사용자", data: [200, 350, 480] }]
    },
    exampleData: {
      labels: ["2021", "2022", "2023", "2024", "2025"],
      values: [200, 310, 450, 620, 810]
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
    inputType: "flow",
    sampleData: {
      labels: ["시작", "수익", "비용"],
      datasets: [{ label: "변동", data: [100, 80, -40] }]
    },
    exampleData: {
      labels: ["시작 잔액", "신규 매출", "환불", "비용", "최종"],
      values: [1000, 450, -80, -220, 1150]
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
    inputType: "ratio",
    sampleData: {
      labels: ["산업A", "산업B", "산업C"],
      datasets: [{ label: "비중", data: [45, 30, 25] }]
    },
    exampleData: {
      labels: ["식품", "가전", "의류", "뷰티", "기타"],
      values: [45, 26, 14, 9, 6]
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
    inputType: "distribution",
    sampleData: {
      labels: ["0~30", "30~60", "60~90"],
      datasets: [{ label: "빈도", data: [12, 45, 28] }]
    },
    exampleData: {
      labels: ["0~20점", "20~40점", "40~60점", "60~80점", "80~100점"],
      values: [4, 18, 32, 21, 8]
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
    inputType: "distribution",
    sampleData: {
      labels: ["A그룹", "B그룹", "C그룹"],
      datasets: [{ label: "중앙값", data: [55, 62, 70] }]
    },
    exampleData: {
      labels: ["A 그룹", "B 그룹", "C 그룹", "D 그룹", "E 그룹"],
      values: [55, 62, 70, 48, 81]
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
    inputType: "distribution",
    sampleData: {
      labels: ["샘플1", "샘플2", "샘플3"],
      datasets: [{ label: "값", data: [25, 60, 88] }]
    },
    exampleData: {
      labels: ["관측1", "관측2", "관측3", "관측4", "관측5"],
      values: [25, 60, 88, 42, 71]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["제품A", "제품B", "제품C"],
      datasets: [{ label: "매출", data: [150, 300, 220] }]
    },
    exampleData: {
      labels: ["제품A", "제품B", "제품C", "제품D", "제품E"],
      values: [150, 300, 220, 180, 260]
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
    inputType: "distribution",
    sampleData: {
      labels: ["대조군", "실험A", "실험B"],
      datasets: [{ label: "평균", data: [50, 65, 72] }]
    },
    exampleData: {
      labels: ["대조군", "실험 A", "실험 B", "실험 C", "실험 D"],
      values: [50, 65, 72, 68, 75]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "방문자", data: [320, 450, 510] }]
    },
    exampleData: {
      labels: ["1월", "2월", "3월", "4월", "5월"],
      values: [320, 450, 510, 580, 650]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "매출", data: [120, 180, 240] }]
    },
    exampleData: {
      labels: ["1월", "2월", "3월", "4월", "5월"],
      values: [120, 180, 240, 310, 380]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["과거", "현재", "예측"],
      datasets: [{ label: "값", data: [200, 280, 340] }]
    },
    exampleData: {
      labels: ["1월", "2월", "3월", "4월(예측)", "5월(예측)"],
      values: [200, 280, 340, 420, 510]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["Q1", "Q2", "Q3"],
      datasets: [{ label: "누적", data: [100, 240, 410] }]
    },
    exampleData: {
      labels: ["Q1", "Q2", "Q3", "Q4", "Q5"],
      values: [100, 240, 410, 620, 880]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["W1", "W2", "W3"],
      datasets: [{ label: "추세", data: [40, 55, 70] }]
    },
    exampleData: {
      labels: ["W1", "W2", "W3", "W4", "W5"],
      values: [40, 55, 48, 62, 70]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["A×1", "A×2", "B×1"],
      datasets: [{ label: "교차값", data: [40, 60, 25] }]
    },
    exampleData: {
      labels: ["A×서울", "A×부산", "B×서울", "B×부산", "C×서울"],
      values: [40, 60, 25, 45, 30]
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
    inputType: "distribution",
    sampleData: {
      labels: ["월", "화", "수"],
      datasets: [{ label: "방문", data: [80, 110, 95] }]
    },
    exampleData: {
      labels: ["월요일", "화요일", "수요일", "목요일", "금요일"],
      values: [80, 110, 95, 120, 140]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["X-Y", "X-Z", "Y-Z"],
      datasets: [{ label: "상관", data: [70, 45, 60] }]
    },
    exampleData: {
      labels: ["가격-매출", "가격-리뷰", "매출-리뷰", "가격-반품", "매출-반품"],
      values: [70, 45, 60, -30, -20]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["A-B", "A-C", "B-C"],
      datasets: [{ label: "상관계수×100", data: [85, 30, 55] }]
    },
    exampleData: {
      labels: ["광고-매출", "광고-방문", "매출-방문", "광고-회원", "매출-회원"],
      values: [85, 55, 72, 40, 65]
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
    inputType: "relational",
    sampleData: {
      labels: ["A→B", "B→C", "C→A"],
      datasets: [{ label: "흐름", data: [120, 90, 60] }]
    },
    exampleData: {
      labels: ["한국→일본", "일본→중국", "중국→한국", "한국→미국", "미국→일본"],
      values: [120, 90, 60, 80, 110]
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
    inputType: "flow",
    sampleData: {
      labels: ["매출", "비용", "이익"],
      datasets: [{ label: "금액", data: [500, 300, 200] }]
    },
    exampleData: {
      labels: ["매출", "원가", "판관비", "영업이익", "순이익"],
      values: [1000, -600, -200, 200, 150]
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
    inputType: "flow",
    sampleData: {
      labels: ["방문", "장바구니", "결제"],
      datasets: [{ label: "사용자", data: [1000, 320, 110] }]
    },
    exampleData: {
      labels: ["방문", "상품 조회", "장바구니", "결제 시도", "구매 완료"],
      values: [1000, 520, 320, 180, 110]
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
    inputType: "flow",
    sampleData: {
      labels: ["기획", "디자인", "개발"],
      datasets: [{ label: "기간(일)", data: [7, 10, 21] }]
    },
    exampleData: {
      labels: ["기획", "디자인", "개발", "테스트", "배포"],
      values: [7, 10, 21, 5, 2]
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
    inputType: "flow",
    sampleData: {
      labels: ["유입→상품", "상품→결제", "결제→완료"],
      datasets: [{ label: "흐름량", data: [800, 350, 220] }]
    },
    exampleData: {
      labels: ["유입→상품", "상품→장바구니", "장바구니→결제", "결제→완료", "완료→재구매"],
      values: [1000, 520, 320, 180, 60]
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
    inputType: "flow",
    sampleData: {
      labels: ["기획", "출시", "확장"],
      datasets: [{ label: "이벤트 수", data: [3, 6, 4] }]
    },
    exampleData: {
      labels: ["기획", "개발", "베타", "정식 출시", "확장"],
      values: [3, 6, 4, 8, 5]
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
    inputType: "ratio",
    sampleData: {
      labels: ["식품", "전자", "의류"],
      datasets: [{ label: "매출 비중", data: [45, 35, 20] }]
    },
    exampleData: {
      labels: ["식품", "가전", "의류", "뷰티", "스포츠"],
      values: [45, 28, 15, 8, 4]
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
    inputType: "relational",
    sampleData: {
      labels: ["임원", "팀장", "팀원"],
      datasets: [{ label: "인원", data: [3, 12, 48] }]
    },
    exampleData: {
      labels: ["CEO", "CTO", "CFO", "CMO", "COO"],
      values: [1, 3, 2, 2, 2]
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
    inputType: "relational",
    sampleData: {
      labels: ["전략", "운영", "기술"],
      datasets: [{ label: "노드 수", data: [8, 6, 10] }]
    },
    exampleData: {
      labels: ["브랜딩", "SNS", "광고", "고객 관리", "데이터 분석"],
      values: [8, 12, 10, 6, 7]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["1사분면", "2사분면", "3사분면"],
      datasets: [{ label: "항목 수", data: [5, 8, 3] }]
    },
    exampleData: {
      labels: ["스타", "캐시카우", "물음표", "도그", "신사업"],
      values: [12, 28, 8, 4, 15]
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
    inputType: "ratio",
    sampleData: {
      labels: ["1단계", "2단계", "3단계"],
      datasets: [{ label: "비중", data: [50, 30, 20] }]
    },
    exampleData: {
      labels: ["식품 > 신선", "식품 > 가공", "가전 > 대형", "가전 > 소형", "기타"],
      values: [28, 18, 22, 14, 18]
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
    inputType: "numeric",
    sampleData: {
      labels: ["서울", "경기", "부산"],
      datasets: [{ label: "지수", data: [88, 76, 62] }]
    },
    exampleData: {
      labels: ["서울", "경기", "부산", "대구", "인천"],
      values: [88, 76, 62, 58, 67]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["서울", "도쿄", "뉴욕"],
      datasets: [{ label: "매출", data: [500, 380, 620] }]
    },
    exampleData: {
      labels: ["서울", "도쿄", "뉴욕", "런던", "파리"],
      values: [500, 380, 620, 540, 420]
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
    inputType: "distribution",
    sampleData: {
      labels: ["A지구", "B지구", "C지구"],
      datasets: [{ label: "밀도", data: [120, 90, 60] }]
    },
    exampleData: {
      labels: ["A 지구", "B 지구", "C 지구", "D 지구", "E 지구"],
      values: [120, 90, 60, 45, 78]
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
    inputType: "flow",
    sampleData: {
      labels: ["서울→도쿄", "도쿄→LA", "LA→파리"],
      datasets: [{ label: "이동량", data: [320, 410, 180] }]
    },
    exampleData: {
      labels: ["서울→도쿄", "도쿄→LA", "LA→파리", "파리→서울", "서울→베이징"],
      values: [320, 410, 180, 260, 380]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["월", "화", "수"],
      datasets: [{ label: "종가", data: [125, 138, 132] }]
    },
    exampleData: {
      labels: ["1/15", "1/16", "1/17", "1/18", "1/19"],
      values: [72000, 74500, 73200, 75800, 76100]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["1일", "2일", "3일"],
      datasets: [{ label: "종가", data: [105, 112, 108] }]
    },
    exampleData: {
      labels: ["1일", "2일", "3일", "4일", "5일"],
      values: [105, 112, 108, 118, 121]
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
    inputType: "flow",
    sampleData: {
      labels: ["매출", "원가", "이익"],
      datasets: [{ label: "금액", data: [1000, -600, 400] }]
    },
    exampleData: {
      labels: ["매출", "COGS", "판관비", "영업이익", "순이익"],
      values: [1000, -600, -200, 200, 150]
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
    inputType: "numeric",
    sampleData: {
      labels: ["목표", "실적", "예측"],
      datasets: [{ label: "달성", data: [100, 78, 92] }]
    },
    exampleData: {
      labels: ["실적", "목표", "전년", "평균", "최고"],
      values: [87, 100, 75, 82, 110]
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
    inputType: "distribution",
    sampleData: {
      labels: ["가성비", "디자인", "배송"],
      datasets: [{ label: "빈도", data: [120, 80, 50] }]
    },
    exampleData: {
      labels: ["가성비", "디자인", "배송", "품질", "서비스"],
      values: [120, 80, 50, 95, 60]
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
    inputType: "timeseries",
    sampleData: {
      labels: ["2020", "2022", "2024"],
      datasets: [{ label: "이벤트 수", data: [4, 7, 5] }]
    },
    exampleData: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      values: [3, 5, 7, 6, 8]
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
    inputType: "relational",
    sampleData: {
      labels: ["A-B", "B-C", "A-C"],
      datasets: [{ label: "연결 강도", data: [50, 30, 20] }]
    },
    exampleData: {
      labels: ["AI-데이터", "AI-알고리즘", "데이터-품질", "알고리즘-성능", "데이터-보안"],
      values: [80, 65, 70, 55, 40]
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
    inputType: "relational",
    sampleData: {
      labels: ["A→B", "B→C", "C→A"],
      datasets: [{ label: "연결", data: [4, 6, 3] }]
    },
    exampleData: {
      labels: ["A→B", "B→C", "C→A", "A→D", "D→B"],
      values: [4, 6, 3, 2, 5]
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
    inputType: "ratio",
    sampleData: {
      labels: ["완료", "진행", "대기"],
      datasets: [{ label: "비율(%)", data: [60, 25, 15] }]
    },
    exampleData: {
      labels: ["완료", "진행", "대기", "취소", "보류"],
      values: [60, 22, 10, 5, 3]
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
    inputType: "ratio",
    sampleData: {
      labels: ["찬성", "반대", "중립"],
      datasets: [{ label: "응답자", data: [7, 2, 1] }]
    },
    exampleData: {
      labels: ["찬성", "반대", "중립", "기권", "미응답"],
      values: [6, 2, 1, 1, 0]
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
    inputType: "ratio",
    sampleData: {
      labels: ["A", "B", "C"],
      datasets: [{ label: "비율", data: [40, 35, 25] }]
    },
    exampleData: {
      labels: ["A", "B", "C", "D", "E"],
      values: [40, 25, 18, 12, 5]
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
    inputType: "ratio",
    sampleData: {
      labels: ["달성", "잔여"],
      datasets: [{ label: "비율", data: [72, 28] }]
    },
    exampleData: {
      labels: ["달성", "잔여"],
      values: [72, 28]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["1월", "2월", "3월"],
      datasets: [{ label: "매출", data: [120, 180, 220] }]
    },
    exampleData: {
      labels: ["1월", "2월", "3월", "4월", "5월"],
      values: [120, 180, 240, 310, 380]
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
    inputType: "numeric",
    sampleData: {
      labels: ["전주", "금주", "변화"],
      datasets: [{ label: "DAU", data: [4200, 4680, 480] }]
    },
    exampleData: {
      labels: ["DAU", "전주", "변화", "목표", "최고"],
      values: [4680, 4200, 480, 5000, 5230]
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
    inputType: "numeric",
    sampleData: {
      labels: ["현재", "목표", "최대"],
      datasets: [{ label: "값", data: [72, 100, 120] }]
    },
    exampleData: {
      labels: ["현재", "목표", "최대", "평균", "최소"],
      values: [72, 100, 120, 68, 50]
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
    inputType: "multiaxis",
    sampleData: {
      labels: ["A팀", "B팀", "C팀"],
      datasets: [{ label: "달성률", data: [85, 110, 72] }]
    },
    exampleData: {
      labels: ["A팀", "B팀", "C팀", "D팀", "E팀"],
      values: [85, 110, 72, 95, 68]
    }
  },

  // ===== 통계 (7) - 신규 =====
  {
    id: "qq-plot",
    name: "Q-Q 플롯",
    category: "통계",
    tags: ["통계", "정규성", "고급"],
    description: "이론 분포(보통 정규분포)와 실제 데이터의 분위수를 점으로 비교해 정규성 여부를 확인하는 통계 차트.",
    useCases: ["데이터 정규성 검정", "잔차 분포 점검", "회귀 진단"],
    difficulty: "고급",
    tools: ["파이썬", "R", "SPSS"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["-2σ", "-1σ", "0", "+1σ", "+2σ"],
      values: [-1.85, -0.92, 0.05, 0.88, 1.93]
    }
  },
  {
    id: "error-bar",
    name: "오차막대",
    category: "통계",
    tags: ["통계", "오차", "중급"],
    description: "측정값에 표준편차나 신뢰구간을 함께 표시해 측정의 불확실성을 시각화하는 차트.",
    useCases: ["실험 결과 보고", "평균과 분산 비교", "측정 정밀도 표시"],
    difficulty: "중급",
    tools: ["파이썬", "R", "엑셀"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["조건 A", "조건 B", "조건 C", "조건 D", "조건 E"],
      values: [42, 58, 51, 67, 49]
    }
  },
  {
    id: "pdf-curve",
    name: "확률밀도함수",
    category: "통계",
    tags: ["통계", "분포", "고급"],
    description: "연속 변수의 확률 밀도를 곡선으로 표현해 분포 형태와 집중도를 보여주는 차트.",
    useCases: ["정규분포 시각화", "분포 비교", "베이즈 사후분포"],
    difficulty: "고급",
    tools: ["파이썬", "R", "Mathematica"],
    chartType: "line",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["-3", "-1.5", "0", "+1.5", "+3"],
      values: [4, 24, 40, 24, 4]
    }
  },
  {
    id: "cdf-curve",
    name: "누적분포함수",
    category: "통계",
    tags: ["통계", "누적", "고급"],
    description: "값이 특정 임계값 이하일 확률을 누적해 보여주는 S자 곡선 차트.",
    useCases: ["위험 분석", "품질관리 검사", "응답 시간 분석"],
    difficulty: "고급",
    tools: ["파이썬", "R", "엑셀"],
    chartType: "line",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["10%", "30%", "50%", "70%", "90%"],
      values: [10, 30, 50, 70, 90]
    }
  },
  {
    id: "correlation-heatmap",
    name: "상관 히트맵",
    category: "통계",
    tags: ["통계", "상관", "중급"],
    description: "변수 간 상관계수를 색 농도 매트릭스로 시각화해 다변량 관계를 한눈에 보여주는 차트.",
    useCases: ["피처 선택", "다중공선성 점검", "EDA"],
    difficulty: "중급",
    tools: ["파이썬", "R", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "multiaxis",
    exampleData: {
      labels: ["X1-X2", "X1-X3", "X2-X3", "X1-Y", "X2-Y"],
      values: [85, 30, 55, 72, 40]
    }
  },
  {
    id: "residual-plot",
    name: "잔차 플롯",
    category: "통계",
    tags: ["통계", "회귀", "고급"],
    description: "회귀 분석의 잔차(관측-예측)를 점으로 찍어 모델의 적합도와 패턴을 진단하는 차트.",
    useCases: ["회귀 진단", "이분산성 점검", "비선형성 탐지"],
    difficulty: "고급",
    tools: ["파이썬", "R", "Stata"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["관측1", "관측2", "관측3", "관측4", "관측5"],
      values: [2.1, -1.4, 0.3, -0.8, 1.6]
    }
  },
  {
    id: "kaplan-meier",
    name: "카플란-마이어",
    category: "통계",
    tags: ["통계", "생존분석", "고급"],
    description: "시간 경과에 따른 생존(이탈하지 않을) 확률을 계단형 곡선으로 보여주는 생존분석 차트.",
    useCases: ["환자 생존율 분석", "고객 이탈율", "제품 수명 분석"],
    difficulty: "고급",
    tools: ["파이썬", "R", "SPSS"],
    chartType: "line",
    compatibleWith: [],
    inputType: "timeseries",
    exampleData: {
      labels: ["0개월", "6개월", "12개월", "18개월", "24개월"],
      values: [100, 82, 65, 52, 41]
    }
  },

  // ===== 금융(신규 5) =====
  {
    id: "bollinger-bands",
    name: "볼린저 밴드",
    category: "금융",
    tags: ["금융", "변동성", "고급"],
    description: "이동평균선 위아래에 표준편차 밴드를 표시해 가격 변동성을 시각화하는 트레이딩 차트.",
    useCases: ["주가 변동성 분석", "과매수/과매도 판단", "단기 트레이딩 전략"],
    difficulty: "고급",
    tools: ["TradingView", "파이썬", "Highcharts"],
    chartType: "line",
    compatibleWith: [],
    inputType: "timeseries",
    exampleData: {
      labels: ["1일", "2일", "3일", "4일", "5일"],
      values: [125, 130, 128, 135, 138]
    }
  },
  {
    id: "volume-bar",
    name: "거래량 바",
    category: "금융",
    tags: ["금융", "거래량", "초급"],
    description: "일별/시간별 거래량을 막대로 표시해 시장 활동성과 유동성을 보여주는 차트.",
    useCases: ["주식 거래량 분석", "거래 패턴 확인", "유동성 점검"],
    difficulty: "초급",
    tools: ["TradingView", "Yahoo Finance", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "timeseries",
    exampleData: {
      labels: ["월", "화", "수", "목", "금"],
      values: [120, 180, 95, 210, 160]
    }
  },
  {
    id: "moving-average",
    name: "이동평균선",
    category: "금융",
    tags: ["금융", "추세", "중급"],
    description: "지정 기간의 평균 값을 이어 단기/장기 추세를 부드럽게 보여주는 차트.",
    useCases: ["주가 추세 분석", "5/20/60일선 비교", "골든크로스 탐지"],
    difficulty: "중급",
    tools: ["TradingView", "파이썬", "엑셀"],
    chartType: "line",
    compatibleWith: [],
    inputType: "timeseries",
    exampleData: {
      labels: ["1주", "2주", "3주", "4주", "5주"],
      values: [95, 102, 108, 115, 121]
    }
  },
  {
    id: "return-distribution",
    name: "수익률 분포",
    category: "금융",
    tags: ["금융", "리스크", "고급"],
    description: "기간 수익률의 분포 형태를 히스토그램으로 보여주는 리스크 분석용 차트.",
    useCases: ["포트폴리오 리스크", "꼬리 위험 점검", "수익 분포 비교"],
    difficulty: "고급",
    tools: ["파이썬", "R", "엑셀"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["-10%", "-5%", "0%", "+5%", "+10%"],
      values: [3, 18, 42, 25, 7]
    }
  },
  {
    id: "correlation-matrix",
    name: "상관 매트릭스(금융)",
    category: "금융",
    tags: ["금융", "상관", "중급"],
    description: "여러 자산의 수익률 상관관계를 매트릭스로 시각화해 포트폴리오 분산에 활용하는 차트.",
    useCases: ["포트폴리오 다각화", "자산 군집화", "위험 관리"],
    difficulty: "중급",
    tools: ["파이썬", "R", "Bloomberg"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "multiaxis",
    exampleData: {
      labels: ["주식-채권", "주식-원자재", "채권-원자재", "주식-부동산", "채권-부동산"],
      values: [-30, 45, 15, 55, 5]
    }
  },

  // ===== 경제 (6) - 신규 =====
  {
    id: "lorenz-curve",
    name: "로렌츠 곡선",
    category: "경제",
    tags: ["경제", "불평등", "고급"],
    description: "인구 누적 비율과 소득 누적 비율을 이은 곡선으로 소득 불평등을 보여주는 경제학 차트.",
    useCases: ["소득 불평등 분석", "자산 분배 비교", "지역 격차 측정"],
    difficulty: "고급",
    tools: ["엑셀", "파이썬", "R"],
    chartType: "line",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["하위 20%", "하위 40%", "하위 60%", "하위 80%", "상위 100%"],
      values: [5, 14, 28, 52, 100]
    }
  },
  {
    id: "supply-demand",
    name: "수요공급 곡선",
    category: "경제",
    tags: ["경제", "균형", "초급"],
    description: "가격에 따른 수요량과 공급량을 두 곡선으로 표현해 균형 가격을 보여주는 미시경제 차트.",
    useCases: ["균형 가격 분석", "가격탄력성 비교", "시장 분석"],
    difficulty: "초급",
    tools: ["엑셀", "PowerPoint", "파이썬"],
    chartType: "line",
    compatibleWith: [],
    inputType: "numeric",
    exampleData: {
      labels: ["가격 100", "가격 200", "가격 300", "가격 400", "가격 500"],
      values: [500, 400, 300, 200, 100]
    }
  },
  {
    id: "phillips-curve",
    name: "필립스 곡선",
    category: "경제",
    tags: ["경제", "거시", "중급"],
    description: "실업률과 인플레이션율의 반비례 관계를 곡선으로 보여주는 거시경제 차트.",
    useCases: ["통화정책 분석", "고용-물가 트레이드오프", "경기 사이클 평가"],
    difficulty: "중급",
    tools: ["FRED", "파이썬", "엑셀"],
    chartType: "line",
    compatibleWith: [],
    inputType: "multiaxis",
    exampleData: {
      labels: ["실업 3%", "실업 4%", "실업 5%", "실업 6%", "실업 7%"],
      values: [5.5, 4.2, 3.1, 2.4, 1.8]
    }
  },
  {
    id: "ppf-curve",
    name: "생산가능곡선",
    category: "경제",
    tags: ["경제", "효율", "초급"],
    description: "두 재화의 생산 조합을 곡선으로 표현해 기회비용과 효율성을 보여주는 차트.",
    useCases: ["기회비용 분석", "생산 효율성", "경제 교과서 자료"],
    difficulty: "초급",
    tools: ["엑셀", "PowerPoint", "Mathematica"],
    chartType: "line",
    compatibleWith: [],
    inputType: "numeric",
    exampleData: {
      labels: ["빵 0", "빵 25", "빵 50", "빵 75", "빵 100"],
      values: [100, 85, 60, 30, 0]
    }
  },
  {
    id: "business-cycle",
    name: "경기순환",
    category: "경제",
    tags: ["경제", "순환", "중급"],
    description: "확장/정점/수축/저점의 4단계 경기 사이클을 파동으로 표현하는 차트.",
    useCases: ["경기 국면 진단", "투자 시점 분석", "정책 평가"],
    difficulty: "중급",
    tools: ["FRED", "엑셀", "파이썬"],
    chartType: "line",
    compatibleWith: [],
    inputType: "timeseries",
    exampleData: {
      labels: ["2020", "2021", "2022", "2023", "2024"],
      values: [85, 102, 115, 98, 108]
    }
  },
  {
    id: "gini-index",
    name: "지니계수",
    category: "경제",
    tags: ["경제", "불평등", "중급"],
    description: "0(완전평등)~1(완전불평등) 사이로 소득 분배 정도를 막대로 비교하는 차트.",
    useCases: ["국가별 불평등 비교", "연도별 변화 추이", "정책 효과 평가"],
    difficulty: "중급",
    tools: ["엑셀", "파이썬", "R"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "numeric",
    exampleData: {
      labels: ["한국", "미국", "일본", "독일", "프랑스"],
      values: [0.34, 0.41, 0.33, 0.30, 0.32]
    }
  },

  // ===== 사회 (6) - 신규 =====
  {
    id: "population-pyramid",
    name: "인구 피라미드",
    category: "사회",
    tags: ["사회", "인구", "중급"],
    description: "연령대별 남녀 인구를 좌우 대칭 막대로 표현하는 인구 구조 분석 차트.",
    useCases: ["고령화 분석", "국가별 인구 비교", "세대 분석"],
    difficulty: "중급",
    tools: ["통계청", "파이썬", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["0~9세", "10~19세", "20~39세", "40~64세", "65세+"],
      values: [9, 11, 30, 35, 15]
    }
  },
  {
    id: "cohort-chart",
    name: "코호트 차트",
    category: "사회",
    tags: ["사회", "코호트", "중급"],
    description: "특정 기간에 가입/등록한 집단의 시간 경과에 따른 잔존율을 보여주는 차트.",
    useCases: ["사용자 잔존율", "마케팅 코호트 분석", "고객 생애주기"],
    difficulty: "중급",
    tools: ["GA", "Mixpanel", "Tableau"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "timeseries",
    exampleData: {
      labels: ["1주", "2주", "4주", "8주", "12주"],
      values: [100, 72, 55, 42, 33]
    }
  },
  {
    id: "likert-scale",
    name: "리커트 척도",
    category: "사회",
    tags: ["사회", "설문", "초급"],
    description: "5점/7점 척도 응답을 누적 막대로 표현해 의견 분포를 보여주는 설문 차트.",
    useCases: ["만족도 조사", "의견 분포 분석", "사용자 경험 설문"],
    difficulty: "초급",
    tools: ["SurveyMonkey", "엑셀", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["매우 불만", "불만", "보통", "만족", "매우 만족"],
      values: [5, 12, 28, 38, 17]
    }
  },
  {
    id: "social-network",
    name: "사회연결망",
    category: "사회",
    tags: ["사회", "관계망", "고급"],
    description: "사람들 간의 친구/팔로우 관계를 노드와 엣지로 표현해 영향력과 군집을 분석하는 그래프.",
    useCases: ["SNS 영향력 분석", "조직 내 협업망", "바이럴 확산 분석"],
    difficulty: "고급",
    tools: ["Gephi", "NodeXL", "D3.js"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "relational",
    exampleData: {
      labels: ["A-B", "B-C", "A-C", "A-D", "D-E"],
      values: [8, 5, 3, 6, 4]
    }
  },
  {
    id: "age-gender-distribution",
    name: "연령-성별 분포",
    category: "사회",
    tags: ["사회", "인구", "초급"],
    description: "연령대별 비율을 누적 막대로 보여주는 인구 통계 차트.",
    useCases: ["고객 세그먼트 분석", "유권자 분포", "건강 통계"],
    difficulty: "초급",
    tools: ["엑셀", "Tableau", "파이썬"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["10대", "20대", "30대", "40대", "50대+"],
      values: [12, 28, 32, 18, 10]
    }
  },
  {
    id: "survey-stacked",
    name: "설문 누적 응답",
    category: "사회",
    tags: ["사회", "설문", "초급"],
    description: "여러 질문의 응답 분포를 누적 막대로 나란히 비교하는 설문 결과 차트.",
    useCases: ["설문 항목 간 비교", "고객 만족도 항목별 분석", "사내 진단"],
    difficulty: "초급",
    tools: ["엑셀", "Tableau", "SurveyMonkey"],
    chartType: "bar",
    compatibleWith: [],
    inputType: "distribution",
    exampleData: {
      labels: ["Q1 가격", "Q2 디자인", "Q3 품질", "Q4 서비스", "Q5 배송"],
      values: [78, 65, 82, 71, 88]
    }
  }
];
