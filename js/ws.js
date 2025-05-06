const ws = new WebSocket('ws://localhost:5001'); // 전역에 한 번만 선언

ws.onopen = () => {
  console.log('WebSocket 연결됨');
};

/*버튼 메세지*/
const togglemsg = new Set([
  'base1-on', 'base1-off',
  'base2-on', 'base2-off',
  'base3-on', 'base3-off',
  'outk-on', 'no-outk-on',
  'homerun-on', '2homerun-on', '3homerun-on',
  'guide-on', 'guide-off', 'Copied http://localhost:5001/wspndskeyer.html'
]);

/*로그 및 메세지 처리리*/
// 메시지 수신 처리
ws.onmessage = (event) => {
  const raw = event.data;
  const logAreaP = document.querySelector('#logArea p');
  const coderStatus = document.querySelector('#coderStatus');
  const coderStatusP = coderStatus.querySelector('p');

  // 로그 출력
  if (logAreaP) {
    const logLine = document.createElement('div');
    logLine.textContent = '[T/S] ' + raw;
    logAreaP.appendChild(logLine);
    logAreaP.scrollTop = logAreaP.scrollHeight;
  }

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // JSON이 아니면 문자열로 처리
  }

  if (parsed && typeof parsed === 'object') {
    switch (parsed.type) {
      case 'DataUpdate':
        console.log('데이터 업데이트 수신:', parsed.payload);
        coderStatus.style.backgroundColor = '#27C0A2';
        return;

      default:
        coderStatusP.innerText = 'ERR';
        coderStatus.style.backgroundColor = 'red';
        console.error('알 수 없는 객체 메시지:', parsed);
        return;
    }
  }

  // 문자열 메시지 처리
  const msg = raw;
  switch (msg) {
    case 'coder-on':
      coderStatusP.innerText = 'ON';
      coderStatus.style.backgroundColor = '#27C0A2';
      break;
    case 'coder-off':
      coderStatusP.innerText = 'OFF';
      coderStatus.style.backgroundColor = '#131313';
      break;
    default:
      if (togglemsg.has(msg)) {
        console.log('메시지 수신:', msg);
      } else {
        coderStatusP.innerText = 'ERR';
        coderStatus.style.backgroundColor = 'red';
        console.error('알 수 없는 메시지:', msg);
      }
  }
};

/*코더 ON/OFF*/
let isCoderOn = false;

function toggleCoder() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = isCoderOn ? 'coder-off' : 'coder-on';
    ws.send(msg);
    console.log(msg);
    isCoderOn = !isCoderOn;
  }
}

/*가이드 ON/OFF*/
let isGuideOn = false;

function toggleGuide() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = isGuideOn ? 'guide-off' : 'guide-on';
    ws.send(msg);
    console.log(msg);
    isGuideOn = !isGuideOn;
  }
}

//링크 복사
function handleCopy() {
  try {
    navigator.clipboard.writeText("http://localhost:5001/wspndskeyer.html");
    const msg = ('Copied http://localhost:5001/wspndskeyer.html');
    ws.send(msg);
  } catch (err) {
    alert("복사에 실패했습니다.");
  }
};

//코더 데이터 업데이트
async function toggleUpdate() {
  const sheetId = document.getElementById('sheetID').value.trim();
  const apiKey = document.getElementById('sheetAPI').value.trim();
  const awaySheet = document.getElementById('Away-tn').value.trim();
  const homeSheet = document.getElementById('Home-tn').value.trim();

  const AwaySc = document.getElementById('Away-sc').value.trim();
  const HomeSc = document.getElementById('Home-sc').value.trim();

  const AwayPlayer = document.getElementById('AwayPlayer').value.trim();
  const AwayPitch = document.getElementById('AwayPitch').value.trim();
  const HomePlayer = document.getElementById('HomePlayer').value.trim();
  const HomePitch = document.getElementById('HomePitch').value.trim();

  const InningCount = document.getElementById('InningCount').value.trim();
  const InningTBSelect = document.getElementById('InningTBSelect').value.trim();
  const BallCount = document.getElementById('BallCount').value.trim();
  const StrikeCount = document.getElementById('StrikeCount').value.trim();
  const OutCount = document.getElementById('OutCount').value.trim();

  let AwayAVG = '';
  let HomeAVG = '';

  if (!AwayPitch && AwayPlayer) {
    const name = extractName(AwayPlayer);
    AwayAVG = await getPlayerAVG(sheetId, apiKey, awaySheet, name) || '';
  }
  if (!HomePitch && HomePlayer) {
    const name = extractName(HomePlayer);
    HomeAVG = await getPlayerAVG(sheetId, apiKey, homeSheet, name) || '';
  }

  const message = {
    type: 'DataUpdate',
    payload: {
      AwaySc,
      AwayTn: awaySheet,
      HomeTn: homeSheet,
      HomeSc,
      AwayPlayer,
      AwayPitch,
      AwayAVG,
      HomePlayer,
      HomePitch,
      HomeAVG,
      InningCount,
      InningTBSelect,
      BallCount,
      StrikeCount,
      OutCount
    }
  };

  document.getElementById('UpdateBtn').style.backgroundColor = '';

  if (!awaySheet || !homeSheet) {
    const msg = 'Team Name is Empty! Please Insert Team Name';
    ws.send(msg);
  } else {
    ws.send(JSON.stringify(message));
  }
}

// 선수 이름에서 이름만 추출 (예: "17. 오타니" → "오타니")
function extractName(playerValue) {
  const parts = playerValue.split('. ');
  return parts.length === 2 ? parts[1] : playerValue;
}

// 시트에서 AVG 값 가져오기
async function getPlayerAVG(sheetId, apiKey, sheetName, playerName) {
  const range = encodeURIComponent(`${sheetName}!A3:K`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`시트 조회 실패 (${response.status})`);
    const data = await response.json();

    for (const row of data.values || []) {
      const name = row[2]?.trim(); // C열 = 이름
      const avg = row[10]; // K열 = AVG

      if (name === playerName && avg) return avg;
    }
    return null;
  } catch (err) {
    console.error('getPlayerAVG error:', err);
    return null;
  }
}


//업데이트 버튼 강조
document.addEventListener('DOMContentLoaded', () => {
  const updateBtn = document.getElementById('UpdateBtn');

  // ✅ 감지할 입력 필드들
  const fields = [
    'Away-sc',
    'Away-tn',
    'Home-tn',
    'Home-sc',
    'AwayPlayer',
    'AwayPitch',
    'HomePlayer',
    'HomePitch',
    'InningCount',
    'InningTBSelect',
    'BallCount',
    'StrikeCount',
    'OutCount'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      // select → change, input → input 이벤트 처리
      el.addEventListener('change', () => {
        updateBtn.style.backgroundColor = '#FFBA00';
      });
      el.addEventListener('input', () => {
        updateBtn.style.backgroundColor = '#FFBA00';
      });
    }
  });
 

});

/*베이스 ON/OFF*/
// 베이스 상태를 추적할 객체
const baseState = {
  base1: false,
  base2: false,
  base3: false
};

//베이스 버튼 상태 토글 함수
/**
 * @param {string} baseName
 */
function toggleBase(baseName) {
  const button = document.querySelector(`.${baseName}`);

  if (ws.readyState === WebSocket.OPEN) {
    const isOn = baseState[baseName];
    const msg = isOn ? `${baseName}-off` : `${baseName}-on`;

    ws.send(msg);
    console.log(msg);

    button.style.backgroundColor = isOn ? '#dbdbdb' : '#27C0A2';
    baseState[baseName] = !isOn;
  } else {
    console.warn('[WS] 연결되지 않음: WebSocket is not connected yet!');
  }
}

// 각각의 토글 함수는 이렇게 간단하게 유지
function toggleBase1() {
  toggleBase('base1');
}

function toggleBase2() {
  toggleBase('base2');
}

function toggleBase3() {
  toggleBase('base3');
}

//애니메이션 재생 버튼
/**
 * @param {string} message
 */
function sendWSMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    console.warn('WebSocket이 열려있지 않습니다.');
  }
}

// 각각의 동작을 메시지만 지정해서 호출
function toggleOutK() {
  sendWSMessage('outk-on');
}

function toggleNoOutK() {
  sendWSMessage('no-outk-on');
}

function toggleHomerun() {
  sendWSMessage('homerun-on');
}

function toggle2Homerun() {
  sendWSMessage('2homerun-on');
}

function toggle3Homerun() {
  sendWSMessage('3homerun-on');
}

/**
 * Table의 콘텐츠를 토글하는 함수
 * @param {string} contentSelector
 * @param {string} buttonSelector
 */
function toggleDisplay(contentSelector, buttonSelector) {
  const content = document.querySelector(contentSelector);
  const button = document.querySelector(buttonSelector);

  if (content.style.display === 'block') {
    content.style.display = 'none';
    button.style.backgroundColor = '';
  } else {
    content.style.display = 'block';
    button.style.backgroundColor = '#27C0A2';
  }
}

// 기존 함수는 이렇게 재정의
function togglesheetSet() {
  toggleDisplay('#sheetSet', '#sheetSetbtn');
}

function toggleinfo() {
  toggleDisplay('#info', '#infobtn');
}