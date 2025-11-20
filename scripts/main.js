// main.js
const API_URL = `https://api.cerebras.ai/v1/chat/completions`;

// Function to update status messages
function updateStatus(message, type = "info") {
  const statusElement = document.getElementById("meta");
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
}

window.onload = () => {
  updateStatus("프롬프트를 입력하여 멜로디를 생성하세요.", "info");
  let melody;

  //#region Event Listeners

  // Prompt enter button click
  const promptInput = document.querySelector(".prompt-input");
  const promptButton = document.querySelector(".prompt-enter-button");

  promptButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (prompt.length > 0) {
      updateStatus("생성 중...", "info");

      promptButton.disabled = true;
      melody = await generateMelody(prompt);
      promptButton.disabled = false;

      melodyStore.addMelody(prompt, melody);
      if (melody && melody.sheet) {
        updateStatus("완료!", "success");

        const sheetContainer = document.getElementById("sheet");
        if (sheetContainer) {
          sheetContainer.innerHTML = "";
        }
        sheetRendering(melody.sheet);
        setTimeout(() => { updateStatus(`제목: ${melody.sheet.title} (${melody.sheet.bars.length} 마디)`, "title"); }, 1000);
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
  const playButton = document.querySelector(".status-button");
  playButton.addEventListener('click', async function (e) {
    if(!melody || !melody.sheet) alert("먼저 멜로디를 생성해주세요!");
    for (const bar of melody.sheet.bars) {
      for (const note of bar.notes) {
        const durationNotation = note.duration[2] + 'n';
        
        await playNote(note.pitch, durationNotation);
        
        // 재생 속도 조절
        const speedValue = speedController.value;
        const speedFactor = speedValue / 100;
        
        if (speedFactor < 1) {
          const additionalDelay = Tone.Time(durationNotation).toSeconds() * (1 - speedFactor);
          await new Promise(resolve => setTimeout(resolve, additionalDelay * 1000));
        }
      }
    }
  });

  //#endregion
};
