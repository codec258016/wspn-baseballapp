
const ws = new WebSocket('ws://localhost:5001'); // 전역에 한 번만 선언

ws.onopen = () => {
  console.log('WebSocket 연결됨');
};

const togglemsg = new Set([
  'base1-on', 'base1-off',
  'base2-on', 'base2-off',
  'base3-on', 'base3-off',
  'outk-on', 'no-outk-on',
  'homerun-on', '2homerun-on', '3homerun-on',
  'guide-on', 'guide-off'
]);

ws.onmessage = (event) => {
    try {
      const message = event.data; // 문자열 그대로 수신
      console.log('[WS]', message); // 콘솔 확인
  
      const logArea = document.querySelector('#logArea p');
      if (logArea) {
        const logLine = document.createElement('div');
        logLine.textContent =('[T/S] '+ message);
        logArea.appendChild(logLine);
        logArea.scrollTop = logArea.scrollHeight; // 자동 스크롤
      }

      // 점수 업데이트 메시지는 무시
      if (msg.type === 'score-update') {
        console.log('점수 메시지 수신:', msg.payload);
        return;
      }

    } catch (e) {
      const msg = event.data;
      const coderStatus = document.getElementById('coderStatus');
    
      // 객체 형태면 type에 따라 처리
      if (typeof msg === 'object' && msg.type) {
        // type에 따라 별도 처리, 예시)
        if (msg.type === 'score-update') {
          // 점수 업데이트 로직 (필요하면)
          return;
        } else {
          coderStatus.innerText = 'ERR';
          coderStatus.style.backgroundColor = 'red';
          console.error('알 수 없는 객체 메시지:', msg);
        }
      }
      // 문자열 처리
      else if (msg === 'coder-on') {
        coderStatus.innerText = 'ON';
        coderStatus.style.backgroundColor = '#27C0A2';
      } else if (msg === 'coder-off') {
        coderStatus.innerText = 'OFF';
        coderStatus.style.backgroundColor = '#131313';
      } else if (knownMsgs.has(msg)) {
        console.log('메시지 수신:', msg);
      } else {
        coderStatus.innerText = 'ERR';
        coderStatus.style.backgroundColor = 'red';
        console.error('알 수 없는 메시지:', msg);
      }
    }
  };

  function handleCopy() {
    try {
      navigator.clipboard.writeText("http://localhost:5001/wspndskeyer.html");
      const msg = ('Copied http://localhost:5001/wspndskeyer.html');
      ws.send(msg);
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

let isRectangleVisible = false;

function opendsker() {
  window.open('http://localhost:5001/wspndskeyer.html', '_blank');
}

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

let isGuideOn = false;

function toggleGuide() {
  if (ws.readyState === WebSocket.OPEN) {
    const msg = isGuideOn ? 'guide-off' : 'guide-on';
    ws.send(msg);
    console.log(msg);
    isGuideOn = !isGuideOn;
  }
}

/*베이스 ON/OFF*/
let isBase1On = false;

function toggleBase1() {
  const button = document.querySelector('.base1');

  if (ws.readyState === WebSocket.OPEN) {
    const msg = isBase1On ? 'base1-off' : 'base1-on';
    ws.send(msg);
    console.log(msg);
    button.style.backgroundColor = isBase1On ? '#c7c7c7' : '#27C0A2';
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
    button.style.backgroundColor = isBase2On ? '#c7c7c7' : '#27C0A2';

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
    button.style.backgroundColor = isBase3On ? '#c7c7c7' : '#27C0A2';

    isBase3On = !isBase3On;
  } else {
    const msg = '[Warn] WebSocket is not connected yet!';
    ws.send(msg);
  }
}

//코더 점수/팀명 체인지 버튼 강조
document.addEventListener('DOMContentLoaded', () => {
  const coderUpdate = document.getElementById('coderUpdate');

  // ✅ 감지할 입력 필드들
  const fields = ['away-sc', 'away-tn', 'home-tn', 'home-sc'];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      // select → change, input → input 이벤트 처리
      el.addEventListener('change', () => {
        coderUpdate.style.backgroundColor = '#FFBA00';
      });
      el.addEventListener('input', () => {
        coderUpdate.style.backgroundColor = '#FFBA00';
      });
    }
  });
});

//코더 점수/팀명 체인지
  function Coderchange() {
  const awayTeam = document.getElementById('away-tn').value.trim();
  const homeTeam = document.getElementById('home-tn').value.trim();
  const awayScore = document.getElementById('away-sc').value;
  const homeScore = document.getElementById('home-sc').value;

  if (awayTeam === '' || homeTeam === '') {
    const msg = '[Warn] TEAM NAME EMTY! Please Insert Team Name';
    ws.send(msg);
  return;
  }

  const message = {
    type: 'score-update',
    payload: {
      awayTeam,
      homeTeam,
      awayScore,
      homeScore
    }
  };

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }

  // ✅ 버튼 색 원상 복구
  document.getElementById('coderUpdate').style.backgroundColor = '';
}

//BSO 체인지 버튼 강조
document.addEventListener('DOMContentLoaded', () => {
    const updateBtn = document.getElementById('updateBtn');
  
    // ✅ 감지할 입력 필드들
    const fields = ['inningnum', 'matchstate', 'ballcount', 'strikecount', 'outcount'];
  
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

/*이닝 정보 업데이트*/
function InningUpdate() {
  const inningNum = document.getElementById('inningnum').value;
  const matchState = document.getElementById('matchstate').value;
  const ballCount = document.getElementById('ballcount').value;
  const strikeCount = document.getElementById('strikecount').value;
  const outCount = document.getElementById('outcount').value;

  const message = {
    type: 'inning-update',
    payload: {
      inningNum,
      matchState,
      ballCount,
      strikeCount,
      outCount
    }
  };

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }

  // ✅ 버튼 색 원상 복구
  document.getElementById('updateBtn').style.backgroundColor = '';
}

/*BS 초기화 및 채인지 버튼 강조*/
function Reset() {
  document.getElementById('ballcount').value = 0;
  document.getElementById('strikecount').value = 0;

    // ✅ Update 버튼을 노란색으로 표시
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
      updateBtn.style.backgroundColor = '#FFBA00';
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

/*코더 점수 변경*/
function playerChange() {
  const awayPlayer = document.getElementById('awayPlayer').value;
  const awayPitchCount = document.getElementById('awayPitchCount').value;
  const homePlayer = document.getElementById('homePlayer').value;
  const homePitchCount = document.getElementById('homePitchCount').value;

  const message = {
    type: 'player-update',
    payload: {
      awayPlayer,
      awayPitchCount,
      homePlayer,
      homePitchCount
    }
  };

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
