function SheetLoad() {
  const sheetIdInput = document.getElementById('sheetID');
  const apiKeyInput = document.getElementById('sheetAPI');
  const awaySelect = document.getElementById('Away-tn');
  const homeSelect = document.getElementById('Home-tn');
  const loadButton = document.querySelector('.loadAllSheets');
  const loadStatus = document.querySelector('#loadStatus');

  const apiKey = apiKeyInput.value.trim();
  const sheetId = sheetIdInput.value.trim();

  if (!apiKey) {
    loadStatus.textContent = 'API키를 입력하세요';
    apiKeyInput.focus();
    return;
  }
  if (!sheetId) {
    loadStatus.textContent = '시트 ID를 입력하세요';
    sheetIdInput.focus();
    return;
  }

  loadButton.textContent = '동기화 중';
  loadButton.disabled = true;

  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&fields=sheets.properties(title)`;

  fetch(metadataUrl)
  .then(response => {
    if (!response.ok) {
      return response.json().then(errorData => {
        let errorMessage = `시트 접근 실패 (${response.status}): `;
  
        const rawMsg = errorData.error?.message || response.statusText;
  
        // 세부 메시지 매핑
        if (rawMsg.includes('API key not valid')) {
          errorMessage += '유효하지 않거나 만료된 API 키입니다.';
        } else if (rawMsg.includes('The caller does not have permission')) {
          errorMessage += '시트 접근에 실패했습니다. 비공개 또는 접근 권한이 없는 시트입니다.';
        } else if (rawMsg.includes('Requested entity was not found')) {
          errorMessage += '잘못된 시트 ID 또는 없는 시트입니다.';
        } else {
          errorMessage += rawMsg; // 기본 메시지
        }
  
        throw new Error(errorMessage);
      });
    }
    return response.json();
  })
    .then(metadata => {
      const sheetNames = metadata.sheets?.map(s => s.properties.title) || [];
      if (sheetNames.length === 0) {
        loadStatus.textContent = "Cannot Access Sheet";
        resetLoadButton(loadButton);
        return;
      }

      populateDropdown(awaySelect, sheetNames, 'Away 팀 선택');
      populateDropdown(homeSelect, sheetNames, 'Home 팀 선택');

      awaySelect.addEventListener('change', () => {
        const sheet = awaySelect.value;
        const inning = document.getElementById('InningTBSelect').value;
        const position = inning === 'Top' ? 'better' : 'pitcher';
        if (sheet) loadPlayersFromSheet(sheetId, apiKey, sheet, document.getElementById('AwayPlayer'), position);
      });

      homeSelect.addEventListener('change', () => {
        const sheet = homeSelect.value;
        const inning = document.getElementById('InningTBSelect').value;
        const position = inning === 'Top' ? 'pitcher' : 'better';
        if (sheet) loadPlayersFromSheet(sheetId, apiKey, sheet, document.getElementById('HomePlayer'), position);
      });

      document.getElementById('InningTBSelect').addEventListener('change', () => {
        const inning = document.getElementById('InningTBSelect').value;
        const awaySheet = awaySelect.value;
        const homeSheet = homeSelect.value;

        // 이닝 변경 시 기록 필드 초기화
        const recordFields = [
          'AwayAVG', 'AwayOBP', 'AwaySLG', 'AwayHR', 'AwayRBI',
          'AwayGame', 'AwayWL', 'AwayERA', 'AwayIP', 'AwayBB', 'AwayS',
          'HomeAVG', 'HomeOBP', 'HomeSLG', 'HomeHR', 'HomeRBI',
          'HomeGame', 'HomeWL', 'HomeERA', 'HomeIP', 'HomeBB', 'HomeS'
        ];

        recordFields.forEach(id => {
          const input = document.getElementById(id);
          if (input) input.value = '';
        });
        if (awaySheet) {
          const pos = inning === 'Top' ? 'better' : 'pitcher';
          loadPlayersFromSheet(sheetId, apiKey, awaySheet, document.getElementById('AwayPlayer'), pos);
        }
        if (homeSheet) {
          const pos = inning === 'Top' ? 'pitcher' : 'better';
          loadPlayersFromSheet(sheetId, apiKey, homeSheet, document.getElementById('HomePlayer'), pos);
        }
      });

      loadStatus.textContent = `${sheetNames.length}개의 팀 시트를 불러왔습니다.`;
    })
    .catch(error => {
      console.error('SheetLoad function error:', error);
      loadStatus.textContent = `오류: ${error.message}`;
    })
    .finally(() => {
      resetLoadButton(loadButton);
    });
}

function populateDropdown(dropdown, items, defaultLabel) {
  dropdown.innerHTML = '';
  dropdown.appendChild(createOption('', defaultLabel));
  items.forEach(name => dropdown.appendChild(createOption(name, name)));
}

function createOption(value, text) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  return option;
}

function resetLoadButton(button) {
  if (button) {
    button.textContent = '불러오기';
    button.disabled = false;
  }
}

// ✅ position 필터 추가된 버전
function loadPlayersFromSheet(sheetId, apiKey, sheetName, playerDropdown, positionFilter) {
  const range = encodeURIComponent(`${sheetName}!A3:C`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`데이터 불러오기 실패 (${response.status})`);
      return response.json();
    })
    .then(data => {
      const rows = data.values || [];
      playerDropdown.innerHTML = '';
      playerDropdown.appendChild(createOption('', '선수 선택'));

      rows.forEach(row => {
        const position = row[0]?.trim().toLowerCase(); // A열: Position
        const number = row[1] || '';
        const name = row[2] || '';
        if (!name.trim()) return;
        if (positionFilter && position !== positionFilter.toLowerCase()) return;

        const value = `${number}. ${name}`;
        playerDropdown.appendChild(createOption(value, value));
      });

      playerDropdown.addEventListener('change', () => {
        const playerValue = playerDropdown.value;
        const sheetId = document.getElementById('sheetID').value.trim();
        const apiKey = document.getElementById('sheetAPI').value.trim();
    
        const sheetName = playerDropdown.id.includes('Away')
          ? document.getElementById('Away-tn').value
          : document.getElementById('Home-tn').value;
    
        const prefix = playerDropdown.id.includes('Away') ? 'Away' : 'Home';
    
        if (!playerValue || !sheetName) return;
    
        console.log('🎯 선수 선택됨:', playerValue);
        loadPlayerRecordFromSheet(sheetId, apiKey, sheetName, playerValue, prefix);
      });
    })
    .catch(error => {
      console.error('loadPlayersFromSheet error:', error);
      alert('선수 목록을 불러오는 데 실패했습니다.');
    });
}

function loadPlayerRecordFromSheet(sheetId, apiKey, sheetName, playerValue, prefix) {
  const range = encodeURIComponent(`${sheetName}!A3:AH`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`기록 불러오기 실패 (${response.status})`);
      return response.json();
    })
    .then(data => {
      const rows = data.values || [];

      const playerNumber = playerValue.split('.')[0].trim();

      // 디버깅 로그 추가
      console.log('[선수번호]', playerNumber);
      console.log('[불러온 rows]', rows);

      const targetRow = rows.find(row => {
        const number = row[1]?.toString().trim();
        return number === playerNumber;
      });

      if (!targetRow) {
        console.warn('🔴 일치하는 선수 없음:', playerNumber);
        return;
      }

      console.log('✅ 찾은 선수 행:', targetRow);

      const position = targetRow[0]?.toLowerCase();

      if (position === 'better') {
        document.getElementById(`${prefix}AVG`).value = targetRow[10] || '';
        document.getElementById(`${prefix}OBP`).value = targetRow[11] || '';
        document.getElementById(`${prefix}SLG`).value = targetRow[12] || '';
        document.getElementById(`${prefix}HR`).value  = targetRow[5] || '';
        document.getElementById(`${prefix}RBI`).value = targetRow[6] || '';
      } else if (position === 'pitcher') {
        document.getElementById(`${prefix}Game`).value = targetRow[17] || '';
        const W = targetRow[20] || '0';
        const L = targetRow[21] || '0';
        document.getElementById(`${prefix}WL`).value = `${W}-${L}`;
        document.getElementById(`${prefix}ERA`).value = targetRow[30] || '';
        document.getElementById(`${prefix}IP`).value = targetRow[19] || '';
        document.getElementById(`${prefix}BB`).value = targetRow[27] || '';
        document.getElementById(`${prefix}S`).value = targetRow[33] || '';
      }
    })
    .catch(error => {
      console.error('loadPlayerRecordFromSheet error:', error);
    });
}

