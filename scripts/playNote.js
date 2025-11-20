const piano = new Tone.Sampler({
    urls: {
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        "A5": "A5.mp3",
    },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    onload: () => {
        console.log('Tone.js Ready!');
    }
}).toDestination();

async function playNote(note, duration = "8n") {
    await Tone.start();

    if (piano.loaded) {
        await new Promise((resolve) => {
            piano.triggerAttackRelease(note, duration);
            
            // 지속시간을 초 단위로 변환
            const durationSeconds = Tone.Time(duration).toSeconds();
            
            // 지속시간이 끝나면 resolve
            setTimeout(resolve, durationSeconds * 100);
        });
    }
}