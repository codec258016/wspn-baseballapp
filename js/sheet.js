
// Google Sheets API를 사용하여 시트 이름 가져오기
function SheetLoad() {
    const sheetIdInput = document.getElementById('sheetID');
    const apiKeyInput = document.getElementById('sheetAPI');
    const awaySelect = document.getElementById('Away-tn');
    const homeSelect = document.getElementById('Home-tn');
    const loadButton = document.querySelector('.loadAllSheets'); // 버튼 참조 추가
    const loadStatus = document.querySelector('#loadStatus'); // 상태 표시 추가
  
    const sheetId = sheetIdInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
  
    // --- 입력 값 유효성 검사 ---
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
  
    // --- 버튼 상태 변경 (로딩 중 표시) ---
    loadButton.textContent = '로딩 중...';
    loadButton.disabled = true; // 중복 클릭 방지
  
    // --- 1단계: 시트 이름 목록 가져오기 위한 API URL 구성 ---
    // fields=sheets.properties(title) : 시트의 속성 중 title(이름)만 가져오도록 지정
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&fields=sheets.properties(title)`;
  
    // --- API 호출 (fetch 사용) ---
    fetch(metadataUrl)
      .then(response => {
        if (!response.ok) {
          // API 오류 발생 시 응답 내용 확인 후 에러 throw
          return response.json().then(errorData => {
            console.error('Error response from API:', errorData);
            let errorMessage = `시트 정보 로딩 실패 (${response.status}): `;
            if (errorData.error && errorData.error.message) {
              errorMessage += errorData.error.message;
            } else {
              errorMessage += response.statusText;
            }
            // 흔한 오류 메시지 개선
            if (response.status === 403) {
               errorMessage += "\n(API 키가 잘못되었거나, Sheets API가 활성화되지 않았거나, 접근 권한이 없을 수 있습니다.)";
            } else if (response.status === 404) {
               errorMessage += "\n(시트 ID가 잘못되었을 수 있습니다.)";
            }
            throw new Error(errorMessage);
          });
        }
        return response.json(); // 성공 시 JSON 파싱
      })
      .then(metadata => {
        // 시트 이름 목록 추출
        if (!metadata.sheets || metadata.sheets.length === 0) {
          loadStatus.textContent = "시트 정보를 찾을 수 없습니다. 시트 ID를 확인하거나 시트가 비어있지 않은지 확인하세요.";
           resetLoadButton(loadButton); // 버튼 상태 복구
           return;
        }
        const sheetNames = metadata.sheets.map(sheet => sheet.properties.title);

        // 시트 이름 선택 시 선수 목록 로딩
        awaySelect.addEventListener('change', () => {
            const selectedSheet = awaySelect.value;
            if (selectedSheet) {
            loadPlayersFromSheet(sheetId, apiKey, selectedSheet, document.getElementById('AwayPlayer'));
            }
        });
        homeSelect.addEventListener('change', () => {
            const selectedSheet = homeSelect.value;
            if (selectedSheet) {
            loadPlayersFromSheet(sheetId, apiKey, selectedSheet, document.getElementById('HomePlayer'));
            }
        });
  
        // --- 드롭다운 메뉴 업데이트 함수 호출 ---
        populateDropdowns(awaySelect, homeSelect, sheetNames);
  
        loadStatus.textContent = `총 ${sheetNames.length}개의 팀을 불러왔습니다.`;
        // (선택사항) 로딩 성공 후 팝업 닫기 등 추가 동작
        // document.getElementById('sheetSet').style.display = 'none'; // 예시
  
      })
      .catch(error => {
        // 네트워크 오류 또는 API 오류 처리
        console.error('SheetLoad function error:', error);
        loadStatus.textContent = `오류 발생: ${error.message}`;
      })
      .finally(() => {
         // --- 버튼 상태 복구 ---
         resetLoadButton(loadButton);
      });
  }
  
  /**
   * 드롭다운 메뉴에 시트 이름 옵션을 채우는 함수
   * @param {HTMLSelectElement} awayDropdown - Away 팀 드롭다운 요소
   * @param {HTMLSelectElement} homeDropdown - Home 팀 드롭다운 요소
   * @param {string[]} sheetNames - 시트 이름 배열
   */
  function populateDropdowns(awayDropdown, homeDropdown, sheetNames) {
    // 기존 옵션 모두 제거
    awayDropdown.innerHTML = '';
    homeDropdown.innerHTML = '';
  
    // 기본 옵션 추가 (선택사항)
    const defaultOptionAway = document.createElement('option');
    defaultOptionAway.value = "";
    defaultOptionAway.textContent = "Away 팀 선택";
    awayDropdown.appendChild(defaultOptionAway);
  
    const defaultOptionHome = document.createElement('option');
    defaultOptionHome.value = "";
    defaultOptionHome.textContent = "Home 팀 선택";
    homeDropdown.appendChild(defaultOptionHome);
  
    // 시트 이름으로 옵션 추가
    sheetNames.forEach(name => {
      const optionAway = document.createElement('option');
      optionAway.value = name;
      optionAway.textContent = name;
      awayDropdown.appendChild(optionAway);
  
      const optionHome = document.createElement('option');
      optionHome.value = name;
      optionHome.textContent = name;
      homeDropdown.appendChild(optionHome);
    });
  }
  
  /**
   * 불러오기 버튼 상태를 초기화하는 함수
   * @param {HTMLButtonElement} button - 불러오기 버튼 요소
   */
  function resetLoadButton(button) {
      if (button) {
          button.textContent = '불러오기';
          button.disabled = false;
      }
  }

  /**
 * 특정 시트에서 선수 목록을 불러와 드롭다운에 채우는 함수
 * @param {string} sheetId - Google Sheets ID
 * @param {string} apiKey - Google API 키
 * @param {string} sheetName - 선택된 시트 탭 이름
 * @param {HTMLSelectElement} playerDropdown - 채울 드롭다운 (ex: AwayPlayer)
 */
  function loadPlayersFromSheet(sheetId, apiKey, sheetName, playerDropdown) {
    const range = encodeURIComponent(`${sheetName}!B2:B`); // B열에서 이름 읽기
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`데이터 불러오기 실패 (${response.status})`);
        return response.json();
      })
      .then(data => {
        const players = data.values?.flat() || [];

        // 기존 옵션 초기화
        playerDropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '선수 선택';
        playerDropdown.appendChild(defaultOption);

        // 선수 이름 추가
        players.forEach(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          playerDropdown.appendChild(option);
        });
      })
      .catch(error => {
        console.error('loadPlayersFromSheet error:', error);
        alert('선수 목록을 불러오는 데 실패했습니다. 시트 내용을 확인하세요.');
      });
    }
  
