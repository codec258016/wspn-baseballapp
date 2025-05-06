const wsmain = new WebSocket('ws://localhost:5001'); // 전역에 한 번만 선언

wsmain.onopen = () => {
  console.log('[main] WebSocket 연결됨');
};

/*버튼 메세지*/
const togglemsg = new Set([
    'base1-on', 'base1-off',
    'base2-on', 'base2-off',
    'base3-on', 'base3-off',
    'outk-on', 'no-outk-on',
    'homerun-on', '2homerun-on', '3homerun-on',
    'guide-on', 'guide-off', 'Copied http://localhost:5001/wspndskeyer1.html'
  ]);
  
  /*로그 및 메세지 처리리*/
  // 메시지 수신 처리
  wsmain.onmessage = (event) => {
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
          coderStatusP.innerText = 'UPDATE';
          coderStatus.style.backgroundColor = '#27C0A2';
          return;
  
        case 'UpdateAwayBet':
        console.log('데이터 업데이트 수신:', parsed.payload);
        coderStatusP.innerText = 'UPDATE';
        coderStatus.style.backgroundColor = '#27C0A2';
        return;

        case 'UpdateAwayPitch':
        console.log('데이터 업데이트 수신:', parsed.payload);
        coderStatusP.innerText = 'UPDATE';
        coderStatus.style.backgroundColor = '#27C0A2';
        return;

        case 'UpdateHomeBet':
        console.log('데이터 업데이트 수신:', parsed.payload);
        coderStatusP.innerText = 'UPDATE';
        coderStatus.style.backgroundColor = '#27C0A2';
        return;

        case 'UpdateHomePitch':
        console.log('데이터 업데이트 수신:', parsed.payload);
        coderStatusP.innerText = 'UPDATE';
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