##**실행 전 (구글 API 및 시트)**##
1. 구글 API키 발급 (API가 있는 경우 스킵)
   > https://cloud.google.com/apis?hl=ko > 콘솔
   >
   > 처음 사용자는 약관 동의 > 프로젝트 선택 > 프로젝트 생성 > https://cloud.google.com/apis?hl=ko 재접속
   >
   > API 및 서비스 > 사용자 인증정보 > 사용자 인증정보 만들기 > API 키 선택 > 키 생성

2. 구글 시트 생성 (가이드 참고)
   > 가이드 시트: https://docs.google.com/spreadsheets/d/1t2z8hrS5EOiGHZAXZgt_tNqsOJXZa-S28kb7aH3ZLhE/edit?usp=sharing
   >
   > 가이드와 같은 양식으로 시트 생성 및 선수 데이터 입력

##**실행 전 (송출단계)**##

   OBS
   > 소스 선택 > 부리우저 > URL 칸에 http://localhost:5001/wspndskeyer.html
   >
   > 너비: 1920, 높이: 1080 입력 후 확인
   >
   > (사용자 지정 css칸은 기본값)
   
   Vmix
   > Add input > Web Browser > URL 칸에 http://localhost:5001/wspndskeyer.html
   >
   > width: 1920, height: 1080 입력 후 OK

##**실행 전 (APP)**

압축 해제 후 WSPN-App.exe 실행
   
https://github.com/user-attachments/assets/ab087f45-14e0-4b78-8ff3-e9c59eff1171

1. API 키 및 시트 ID 입력
   > 우측 탭에서 시트 선택 > 발급받은 API 키 입력
   >
   > https://cloud.google.com/apis?hl=ko > 콘솔 > 사용자 인증정보 > API 키 표시 > 복사 후 앱에 붙여넣기
   >
   > 구글 시트 링크 https://docs.google.com/spreadsheets/d/{시트 ID}/edit?gid=0#gid=0 에서
   >
   > {시트 ID} 복사 후 앱에 붙여넣기
   >
   > 불러오기

2. 실행(컨트롤러와 키어 동기화)
   > 실사용 전 코더를 한번 실행해야 데이터 업데이트 및 애니메이션이 제대로 동작함

   > P 옆에 투구수를 입력하지 않은 비어있는 상태에서 업데이트를 하면 해당 선수의 AVG값이 나옴
   >
   > (투수가 아닌 타자로 인식하는 방식)
   >
   > 때문에 투구수가 0인 경우 0으로 기입 후 업데이트 해야함

