// main.js

// const sampleSheet = { ... }
// function sheetRenderer() { ... }

window.onload = () => {
    const sheet = sampleSheet.sheet;

    //#region Logging Sample Data
    
    console.log("- Sample Sheet Data -");
    console.log(JSON.stringify(sampleSheet, null, 2));

    console.log("- Notes Information -");
    for(const bar of sheet.bars) {
        for(const note of bar.notes) {
            console.log(`pitch: ${note.pitch}, duration: ${note.duration}`);
        }
        console.log('---');
    }

    //#endregion

    // Render sheet
    sheetRendering(sheet);

    // Update sheet title
    document.getElementById('meta').textContent = `제목: ${sheet.title} (${sheet.bars.length} 마디)`;

    //#region Event Listeners

    // Prompt enter button click
    const promptInput = document.querySelector('.prompt-input');
    const promptButton = document.querySelector('.prompt-enter-button');
    promptButton.addEventListener('click', () => {
        const prompt = promptInput.value.trim();
        if(prompt.length > 0) {
            alert(prompt);
            promptInput.value = '';
        }
    });

    //#endregion
};