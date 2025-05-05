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
  'guide-on', 'guide-off'
]);

/*로그 및 메세지 처리리*/
ws.onmessage = (event) => {
  try {
    const message = event.data; // 문자열 그대로 수신
    console.log('[WS]', message); // 콘솔 확인

    const logArea = document.querySelector('#logArea');
    const logAreap = document.querySelector('#logArea p');
    if (logArea) {
      const logLine = document.createElement('div');
      logLine.textContent =('[T/S] '+ message);
      logAreap.appendChild(logLine);
      logArea.scrollTop = logArea.scrollHeight; // 자동 스크롤
    }

    // 점수 업데이트 메시지는 무시
    if (msg.type === 'score-update') {
      console.log('점수 메시지 수신:', msg.payload);
      return;
    }

  } catch (e) {
    const msg = event.data;
    const coderStatusp = document.querySelector('#coderStatus p');
  
    // 객체 형태면 type에 따라 처리
    if (typeof msg === 'object' && msg.type) {
      // type에 따라 별도 처리, 예시)
      if (msg.type === 'score-update') {
        // 점수 업데이트 로직 (필요하면)
        return;
      } else {
        coderStatusp.innerText = 'ERR';
        coderStatus.style.backgroundColor = 'red';
        console.error('알 수 없는 객체 메시지:', msg);
      }
    }
    // 문자열 처리
    else if (msg === 'coder-on') {
      coderStatusp.innerText = 'ON';
      coderStatus.style.backgroundColor = '#27C0A2';
    } else if (msg === 'coder-off') {
      coderStatusp.innerText = 'OFF';
      coderStatus.style.backgroundColor = '#131313';
    } else if (knownMsgs.has(msg)) {
      console.log('메시지 수신:', msg);
    } else {
      coderStatusp.innerText = 'ERR';
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
function toggleUpdate() {
  //팀명/점수
  const AwaySc = document.getElementById('Away-sc').value.trim();
  const AwayTn = document.getElementById('Away-tn').value.trim();
  const HomeTn = document.getElementById('Home-tn').value.trim();
  const HomeSc = document.getElementById('Home-sc').value.trim();

  //플레이어/피칭
  const AwayPlayer = document.getElementById('AwayPlayer').value.trim();
  const AwayPitch = document.getElementById('AwayPitch').value.trim();
  const HomePlayer = document.getElementById('HomePlayer').value.trim();
  const HomePitch = document.getElementById('HomePitch').value.trim();

  //카운트
  const InningCount = document.getElementById('InningCount').value.trim();
  const InningTBSelect = document.getElementById('InningTBSelect').value.trim();
  const BallCount = document.getElementById('BallCount').value.trim();
  const StrikeCount = document.getElementById('StrikeCount').value.trim();
  const OutCount = document.getElementById('OutCount').value.trim();

  /*if (awayTeam === '' || homeTeam === '') {
    const msg = '[Warn] TEAM NAME EMTY! Please Insert Team Name';
    ws.send(msg);
  return;
  }*/

  const message = {
    type: 'DataUpdate',
    payload: {
      AwaySc,
      AwayTn,
      HomeTn,
      HomeSc,
      AwayPlayer,
      AwayPitch,
      HomePlayer,
      HomePitch,
      InningCount,
      InningTBSelect,
      BallCount,
      StrikeCount,
      OutCount
    }
  };

  // ✅ 버튼 색 원상 복구
  document.getElementById('UpdateBtn').style.backgroundColor = '';

  if(AwayTn === '' || HomeTn === '') {
    if (ws.readyState === WebSocket.OPEN) {
      const msg = 'Team Name is Empty! Please Insert Team Name';
      ws.send(msg);
    }
  } else {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
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
let isBase1On = false;

function toggleBase1() {
  const button = document.querySelector('.base1');

  if (ws.readyState === WebSocket.OPEN) {
    const msg = isBase1On ? 'base1-off' : 'base1-on';
    ws.send(msg);
    console.log(msg);
    button.style.backgroundColor = isBase1On ? '#dbdbdb' : '#27C0A2';
    isBase1On = !isBase1On;
  } else {
    const msg = '[Warn] WebSocket is not connected yet!';
    ws.send(msg);
  }
}

let isBase2On = false;

function toggleBase2() {
  const button = document.querySelector('.base2');

  if (ws.readyState === WebSocket.OPEN) {
    const msg = isBase2On ? 'base2-off' : 'base2-on';
    ws.send(msg);
    console.log(msg);
    button.style.backgroundColor = isBase2On ? '#dbdbdb' : '#27C0A2';

    isBase2On = !isBase2On;
  } else {
    const msg = '[Warn] WebSocket is not connected yet!';
    ws.send(msg);
  }
}

let isBase3On = false;

function toggleBase3() {
  const button = document.querySelector('.base3');

  if (ws.readyState === WebSocket.OPEN) {
    const msg = isBase3On ? 'base3-off' : 'base3-on';
    ws.send(msg);
    console.log(msg);
    button.style.backgroundColor = isBase3On ? '#dbdbdb' : '#27C0A2';

    isBase3On = !isBase3On;
  } else {
    const msg = '[Warn] WebSocket is not connected yet!';
    ws.send(msg);
  }
}

/*out K*/
function toggleOutK() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = 'outk-on';
    ws.send(msg);
  }
}
/*no out K*/
function toggleNoOutK() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = 'no-outk-on';
    ws.send(msg);
  }
}

/*home run*/
function toggleHomrun() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = 'homerun-on';
    ws.send(msg);
  }
}
/*2home run*/
function toggle2Homrun() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = '2homerun-on';
    ws.send(msg);
  }
}
/*3home run*/
function toggle3Homrun() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = '3homerun-on';
    ws.send(msg);
  }
}


function togglesheetSet() {
  const sheetSet = document.querySelector('#sheetSet');
  const button = document.querySelector('#sheetSetbtn');

  if (sheetSet.style.display === 'block') {
    sheetSet.style.display = 'none';
    button.style.backgroundColor = '';
  } else {
    sheetSet.style.display = 'block';
    button.style.backgroundColor = '#27C0A2';
  }
}

function toggleinfo() {
  const info = document.querySelector('#info');
  const button = document.querySelector('#infobtn');

  if (info.style.display === 'block') {
    info.style.display = 'none';
    button.style.backgroundColor = '';
  } else {
    info.style.display = 'block';
    button.style.backgroundColor = '#27C0A2';
  }
}