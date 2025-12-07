const piano = new Tone.Sampler({
    urls: {
        "C1": "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        "A1": "A1.mp3",
        "C2": "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        "A3": "A3.mp3",
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        "A5": "A5.mp3",
        "C6": "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        "A6": "A6.mp3",
        "C7": "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        "A7": "A7.mp3",
        "C8": "C8.mp3",
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