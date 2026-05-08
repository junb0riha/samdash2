# SAM ETF Intelligence Dashboard

업로드한 엑셀 데이터를 기반으로 만든 GitHub Pages용 정적 대시보드입니다.

## 파일 구성
- `index.html` : 대시보드 본문
- `styles.css` : 화면 디자인
- `script.js` : 차트/테이블 렌더링 로직
- `dashboard-data.js` : 엑셀에서 추출·집계한 데이터

## GitHub Pages 업로드 방법
1. GitHub 저장소에 위 4개 파일을 업로드합니다.
2. 저장소 Settings → Pages에서 Branch를 `main`, Folder를 `/root`로 설정합니다.
3. 배포 주소 예: `https://계정명.github.io/저장소명/`

## 데이터 요약
- 총 세그먼트: 2,238개
- ETF: 6개
- 시·도: 17개
- 시군구: 146개
- 총 보유평가액: 5,862억원
- 총 보유자: 61,335명
