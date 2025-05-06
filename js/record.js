const ws2 = new WebSocket('ws://localhost:5001');

ws2.onopen = () => {
  console.log('[record] WebSocket 연결됨');
};

async function toggleAwayBetRecord(){
  const AwayAVG = document.getElementById('AwayAVG').value.trim();
  const AwayOBP = document.getElementById('AwayOBP').value.trim();
  const AwaySLG = document.getElementById('AwaySLG').value.trim();
  const AwayHR = document.getElementById('AwayHR').value.trim();
  const AwayRBI = document.getElementById('AwayRBI').value.trim();

  const message = {
    type: 'UpdateAwayBet',
    payload: {
      AwayAVG,
      AwayOBP,
      AwaySLG,
      AwayHR,
      AwayRBI,
    }
  };

  document.getElementById('UpdateAwayBet').style.backgroundColor = '';
  ws2.send(JSON.stringify(message));
};

async function toggleAwayPitRecord(){
  const AwayGame = document.getElementById('AwayGame').value.trim();
  const AwayWL = document.getElementById('AwayWL').value.trim();
  const AwayERA = document.getElementById('AwayERA').value.trim();
  const AwayIP = document.getElementById('AwayIP').value.trim();
  const AwayBB = document.getElementById('AwayBB').value.trim();
  const AwayS = document.getElementById('AwayS').value.trim();

  const message = {
    type: 'UpdateAwayPitch',
    payload: {
      AwayGame,
      AwayWL,
      AwayERA,
      AwayIP,
      AwayBB,
      AwayS,
    }
  };

  document.getElementById('UpdateAwayPitch').style.backgroundColor = '';
  ws2.send(JSON.stringify(message));
};

async function toggleHomeBetRecord(){
  const HomeAVG = document.getElementById('HomeAVG').value.trim();
  const HomeOBP = document.getElementById('HomeOBP').value.trim();
  const HomeSLG = document.getElementById('HomeSLG').value.trim();
  const HomeHR = document.getElementById('HomeHR').value.trim();
  const HomeRBI = document.getElementById('HomeRBI').value.trim();

  const message = {
    type: 'UpdateHomeBet',
    payload: {
      HomeAVG,
      HomeOBP,
      HomeSLG,
      HomeHR,
      HomeRBI,
    }
  };

  document.getElementById('UpdateHomeBet').style.backgroundColor = '';
  ws2.send(JSON.stringify(message));
};

async function toggleHomePitRecord(){
  const HomeGame = document.getElementById('HomeGame').value.trim();
  const HomeWL = document.getElementById('HomeWL').value.trim();
  const HomeERA = document.getElementById('HomeERA').value.trim();
  const HomeIP = document.getElementById('HomeIP').value.trim();
  const HomeBB = document.getElementById('HomeBB').value.trim();
  const HomeS = document.getElementById('HomeS').value.trim();

  const message = {
    type: 'UpdateHomePitch',
    payload: {
      HomeGame,
      HomeWL,
      HomeERA,
      HomeIP,
      HomeBB,
      HomeS,
    }
  };

  document.getElementById('UpdateHomeBet').style.backgroundColor = '';
  ws2.send(JSON.stringify(message));
};