# AGENTS.md — Tesla-subsidy-pwa

단일 파일 한국어 PWA ("나도 이제 테슬람?" — 테슬라 전기차 보조금 조회). 빌드/테스트/의존성 없음. `index.html` / `manifest.json` / `sw.js` / `Ads.txt`가 전부.

- **원본 소스는 `index.html` 하나뿐**. `tistory-embed.html`은 티스토리 글/페이지 HTML모드 붙여넣기용 파생 스니펫(html/body wrapper·manifest·sw.js·AdSense 제거, init을 즉시실행 IIFE로 변경) — **직접 편집하지 말고 `index.html`에서 재생성**하며, `index.html` 변경 시 무결성 검증(태그 균형·SW/AdSense 제거 여부)을 수반할 것.

## 배포 때 반드시
- **`index.html` 또는 `manifest.json`을 수정 배포할 때마다 `sw.js`의 `CACHE_NAME` 버전을 올릴 것** (`tesla-subsidy-v2` → `v3`…). Service Worker는 cache-first 전략이라 버전을 안 올리면 기존 방문자는 영구히 옛날 화면을 봄. 이건 `sw.js` 첫 줄 주석에도 명시됨.

## 코드 구조 (파일명으로는 안 보이는 것)
- **모든 로직·데이터가 `index.html` 안의 인라인 `<script>`에 있음**: 차량가/국비 데이터는 `carData`, 17개 시·도 / 시·군·구 `localRate`은 `regionsData`. 지자체 추가·수정은 이 두 객체만 건드리면 됨.
- `carData`·`regionsData`·예산 소진 배지(`status`)는 **연간 수동 갱신하는 하드코딩 데이터** — 근거는 무공해차 누리집(ev.or.kr).
- **"실시간 동기화 중" 배지는 장식임**: `fetchLatestSubsidiesAndPrices()`는 실제 fetch를 하지 않고 재계산만 함. 이 UI 텍스트를 "실제 API가 있다"고 오해하지 말 것.
- 보조금 계산식: 지방비 = 국비 `natCurr × localRate`, 전환지원금 = `convNat` + `convLocal`. 작년 비교는 `natLast` 기준.

## 로컬 확인
- `python3 -m http.server` 류로 서빙해서 열 것. Service Worker 등록은 `file://`에서 안 되므로 SW 관련 확인엔 http 필수.
- CSS는 Tailwind CDN (`cdn.tailwindcss.com`), 아이콘은 icons8 외부 URL — 외부 리소스 교체 시 오프라인 캐시(`sw.js`의 `cache.addAll`은 index/manifest만) 커버 범위와 상관없음을 감안할 것.

## 커밋
- 원격: `sunny-cha/Tesla-subsidy-pwa`. 커밋 메시지는 한국어로 씀 (기존 이력 관례).
