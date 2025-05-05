function SheetLoad() {
  const sheetIdInput = document.getElementById('sheetID');
  const apiKeyInput = document.getElementById('sheetAPI');
  const awaySelect = document.getElementById('Away-tn');
  const homeSelect = document.getElementById('Home-tn');
  const loadButton = document.querySelector('.loadAllSheets');
  const loadStatus = document.querySelector('#loadStatus');

  const sheetId = sheetIdInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!sheetId) {
    loadStatus.textContent = 'Google Sheet ID를 입력해주세요.';
    sheetIdInput.focus();
    return;
  }
  if (!apiKey) {
    loadStatus.textContent = 'Google API Key를 입력해주세요.';
    apiKeyInput.focus();
    return;
  }

  loadButton.textContent = '로딩 중...';
  loadButton.disabled = true;

  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&fields=sheets.properties(title)`;

  fetch(metadataUrl)
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          let errorMessage = `시트 정보 로딩 실패 (${response.status}): `;
          errorMessage += errorData.error?.message || response.statusText;
          if (response.status === 403) {
            errorMessage += "\n(API 키 문제, API 비활성화 또는 접근 권한 문제일 수 있습니다.)";
          } else if (response.status === 404) {
            errorMessage += "\n(시트 ID가 잘못되었을 수 있습니다.)";
          }
          throw new Error(errorMessage);
        });
      }
      return response.json();
    })
    .then(metadata => {
      const sheetNames = metadata.sheets?.map(s => s.properties.title) || [];
      if (sheetNames.length === 0) {
        loadStatus.textContent = "시트 정보를 찾을 수 없습니다.";
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
        if (awaySheet) {
          const pos = inning === 'Top' ? 'better' : 'pitcher';
          loadPlayersFromSheet(sheetId, apiKey, awaySheet, document.getElementById('AwayPlayer'), pos);
        }
        if (homeSheet) {
          const pos = inning === 'Top' ? 'pitcher' : 'better';
          loadPlayersFromSheet(sheetId, apiKey, homeSheet, document.getElementById('HomePlayer'), pos);
        }
      });

      loadStatus.textContent = `총 ${sheetNames.length}개의 팀을 불러왔습니다.`;
    })
    .catch(error => {
      console.error('SheetLoad function error:', error);
      loadStatus.textContent = `오류 발생: ${error.message}`;
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
    })
    .catch(error => {
      console.error('loadPlayersFromSheet error:', error);
      alert('선수 목록을 불러오는 데 실패했습니다.');
    });
}
