// main.js
const API_URL = `https://api.cerebras.ai/v1/chat/completions`;

// Function to update status messages
function updateStatus(message, type = "info") {
  const statusElement = document.getElementById("meta");
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
}

let melodyData = null;

function checkHasApiKey() {
  try {
    const tmp = API_KEY;
    if (!tmp || tmp.trim() === "") {
      updateStatus("API 키가 설정되지 않았습니다.", "error");

      const apiInputPanel = document.querySelector(".apiinput-panel-wrapper");
      apiInputPanel.style.display = "flex";
    }
  } catch (e) {
    updateStatus("API 키가 설정되지 않았습니다.", "error");

    const apiInputPanel = document.querySelector(".apiinput-panel-wrapper");
    apiInputPanel.style.display = "flex";
  }
}

window.onload = () => {
  updateStatus("프롬프트를 입력하여 멜로디를 생성하세요.", "info");
  
  checkHasApiKey();
  
  let isPlaying = false;
  let shouldStop = false;

  //#region Event Listeners

  // Prompt enter button click
  const promptInput = document.querySelector(".prompt-input");
  const promptButton = document.querySelector(".prompt-enter-button");

  promptButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (prompt.length > 0) {
      updateStatus("생성 중...", "info");

      promptButton.disabled = true;
      melodyData = await generateMelody(prompt);
      promptButton.disabled = false;

      melodyStore.addMelody(prompt, melodyData);
      if (melodyData && melodyData.sheet) {
        updateStatus("완료!", "success");

        const sheetContainer = document.getElementById("sheet");
        if (sheetContainer) {
          sheetContainer.innerHTML = "";
        }
        sheetRendering(melodyData.sheet);
        setTimeout(() => { updateStatus(`제목: ${melodyData.sheet.title} (${melodyData.sheet.bars.length} 마디)`, "title"); }, 1000);
      }
      promptInput.value = "";
    } else {
      updateStatus("프롬프트를 입력해주세요.", "warning");
    }
  });

  // Speed controller change
  const speedController = document.querySelector(".speed-controller");
  speedController.addEventListener("input", (event) => {
    const speedValue = event.target.value;
    const max = event.target.max;
    const min = event.target.min;

    const percentage = ((speedValue - min) / (max - min)) * 100;

    speedController.style.setProperty("--filled-percentage", `${percentage}%`);
  });

  // play Note
  const playButton = document.querySelectorAll(".status-button")[0];
  playButton.addEventListener('click', async function (e) {
    if(!melodyData || !melodyData.sheet) {
      alert("먼저 멜로디를 생성해주세요!");
      return;
    }
    
    if(isPlaying) return;
    
    isPlaying = true;
    shouldStop = false;
    
    outerLoop:
    for (const bar of melodyData.sheet.bars) {
      for (const note of bar.notes) {
        if(shouldStop) break outerLoop;
        
        const durationNotation = note.duration[2] + 'n';
        
        await playNote(note.pitch, durationNotation);
        
        if(shouldStop) break outerLoop;
        
        // 재생 속도 조절
        const speedValue = speedController.value;
        const speedFactor = speedValue / 100;
        
        if (speedFactor < 1) {
          const additionalDelay = Tone.Time(durationNotation).toSeconds() * (1 - speedFactor);
          await new Promise(resolve => setTimeout(resolve, additionalDelay * 1000));
        }
      }
    }
    
    isPlaying = false;
  });

  // Stop Note
  const stopButton = document.querySelectorAll(".status-button")[1];
  stopButton.addEventListener('click', function (e) {
    shouldStop = true;
    piano.releaseAll();
    Tone.Transport.stop();
    Tone.Transport.cancel();
    isPlaying = false;
  });

  const apiInput = document.querySelector(".apiinput");
  const apiButton = document.querySelector(".apiinput-button");
  apiButton.addEventListener("click", () => {
    const apiKey = apiInput.value.trim();
    if (apiKey.length > 0) {
      API_KEY = apiKey;
      const apiInputPanel = document.querySelector(".apiinput-panel-wrapper");
      apiInputPanel.style.display = "none";
      updateStatus("API 키가 설정되었습니다. 프롬프트를 입력하여 멜로디를 생성하세요.", "info");
    } else {
      alert("API 키를 입력해주세요.");
    }
  });

  //#endregion
};
