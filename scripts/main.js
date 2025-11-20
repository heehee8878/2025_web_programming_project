// main.js
const API_KEY = GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

// Function to update status messages
function updateStatus(message, type = "info") {
  const statusElement = document.getElementById("meta");
  statusElement.textContent = message;
  statusElement.className = `status-message ${type}`;
}


async function generateMelody(prompt) {
  const promptInput = document.querySelector(".prompt-input");
  const promptButton = document.querySelector(".prompt-enter-button");
  promptButton.disabled = true; // Disable button during generation

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a musical sheet data in JSON format based on the following description: "${prompt}". You must follow this JSON schema: {"sheet": {"title": "string", "bars": [{"notes": [{"pitch": "string", "duration": "string"}]}]}}. The "duration" value for each note MUST be a string representing a fraction, like "1/4" for a quarter note, "1/8" for an eighth note, or "1/1" for a whole note.`,
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();

    const responseText = data.candidates[0].content.parts[0].text;
    const melodyData = JSON.parse(responseText);

    return melodyData;
  } catch (error) {
    console.error("Error generating melody:", error);
    updateStatus(`오류 발생: ${error.message}`, "error");
    document.getElementById("meta").textContent = "";
    return null;
  } finally {
    promptButton.disabled = false; // Re-enable button
  }
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
      melody = await generateMelody(prompt);
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
