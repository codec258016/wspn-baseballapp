## **현재 지원 기능**

코더 (우상단)

> 팀명 및 점수

> 도루, 이닝(1회 초, 3회 말), 볼, 스트라이크, 아웃 카운트

> 홈런, 삼진 애니메이션

> CG가이드 (세이프티존)

> 컨트롤러 새로고침(F5)

> AWAY, HOME 플레이어 이름 및 투구 횟수

## **설치 및 사용방법**

압축 해제 후 WSPN-App.exe 실행

**OBS**

> 소스 선택 > 부리우저 > URL 칸에 http://localhost:5000/wspndskeyer.html

> 너비: 1920, 높이: 1080 입력 후 확인

> (사용자 지정 css칸은 기본값)

**Vmix**

> Add input > Web Browser > URL 칸에 http://localhost:5000/wspndskeyer.html

> width: 1920, height: 1080 입력 후 OK

**컨트롤러 문제 발생 시**

> F5키를 눌러 새로고침 가능

### **실사용 전, WSPN DSK CONTROL에서 CODER버튼을 클릭해 실행해야 정상적으로 이용 가능**

**코더 사용방법**

![image](https://github.com/user-attachments/assets/e87deecc-21af-4785-b5c5-e814ffc0cd2f)

1열

> CODER버튼을 통해 온, 오프 가능 (옆에 ON, OFF상태가 표시됨)

> AWAY팀의 점수, 팀명 : HOME팀의 팀명, 점수 입력 후 UP 버튼을 누르면 코더에 적용됨

적용 결과

![image](https://github.com/user-attachments/assets/e1dbbaa8-a7f1-49b2-a3b5-5ec5720738a6)


2열

> INNING에 회차 입력 및 초(TOP), 말(BTM) 선택 후 UP 버튼 누르면 코더에 적용됨

> B(Ball)/S(Strike)/O(Out) 입력 후 UP 버튼 누르면 코더에 적용됨

> Tip: INNING 정보와 B(Ball)/S(Strike)/O(Out) 정보가 한번에 코더에 적용되는 시스템

![image](https://github.com/user-attachments/assets/72b0f0d3-6c11-48f9-a030-0902771b5ca5)

베이스

> 타자가 베이스로 진루한 위치를 클릭하면 별도 단계 없이 코더에 바로 적용

적용 결과

![image](https://github.com/user-attachments/assets/3b5d49d9-549c-4fb0-afed-3eb1947b77f0)


K, No Out K, HOMERUN

> 상황에 맞는 버튼을 클릭하면 코더에 애니메이션이 재생됨

적용 결과

![image](https://github.com/user-attachments/assets/184773d0-7a13-4334-a367-c4302dc3106e)

![image](https://github.com/user-attachments/assets/3d630db8-7302-412c-8fd5-83ff9bb0fd08)


Event Log

> 버튼 클릭 시 코더로 전송되는 메세지 및 오류 정보가 뜸

![image](https://github.com/user-attachments/assets/6ca78feb-67f0-4c85-bca3-639da2f2f342)

타자, 투수 이름 및 투구수

> 플레이어 이름과 P(투구 수)를 입력 후 UP 버튼을 누르면 코더에 적용

> P 칸이 공백으로 둘 경우 타자로 인식하고 (B(Ball) - S(Strike)로 표시)
> 타자의 B(Ball) - S(Strike)는 B/S/O 업데이트 후 업데이트 해야 적용됨

![image](https://github.com/user-attachments/assets/5530a0d7-747b-43d6-b29c-6cece5312f29)
먼저 업데이트 후

![image](https://github.com/user-attachments/assets/6ca78feb-67f0-4c85-bca3-639da2f2f342)
업데이트

적용 결과

![image](https://github.com/user-attachments/assets/fb4febed-238f-4aaf-b689-401d7f581b34)

## 로드맵
단기 로드맵
1. 코더의 아래 빈 공간에 투수 및 타자 정보 표시 제작
2. css 최적화: class로 UI 요소 규격화 후html에서 class 두개 사용 (진행중)

   > ex. class="coder-btn 15px"


장기 로드맵
1. 투수 및 타자 원샷 잡혔을 때 정보 표시 제작 (선수 프로필 및 각종 기록)


기타
1. 피그마 UI 제작 (css UI 규격화 연장선)
