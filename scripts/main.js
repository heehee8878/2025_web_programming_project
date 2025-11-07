// const sampleSheet = { ... }

window.onload = () => {
    console.log("- Sample Sheet Data -");
    console.log(JSON.stringify(sampleSheet, null, 2));

    console.log("- Notes Information -");
    for(const bar of sampleSheet.sheet.bars) {
        for(const note of bar.notes) {
            console.log(`pitch: ${note.pitch}, duration: ${note.duration}`);
        }
        console.log('---');
    }

    function durClass(d) { return 'dur-' + d.replace('/', '-'); }

    function stemDirection(pitch, pivot = 'A4') {
        const match = pitch.match(/^([A-G])(#|b)?(\d+)$/);
        if (!match) return 'up';

        const note = match[1];
        const octave = Number(match[3]);
        const order = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const index = order.indexOf(note);

        // pivot: A4
        if (octave > Number(pivot[1])) return 'down';
        if (octave < Number(pivot[1])) return 'up';
        return (index > order.indexOf(pivot[0])) ? 'down' : 'up';
    }

    const sheet = sampleSheet.sheet;
    const container = document.getElementById('sheet');

    sheet.bars.forEach((bar, i) => {
        const barEl = document.createElement('div'); barEl.className = 'bar';
        const label = document.createElement('div'); label.className = 'bar-label'; label.textContent = `${i + 1}`;
        barEl.appendChild(label);

        const staff = document.createElement('div'); staff.className = 'staff';
        for (let l = 0; l < 5; l++) { const line = document.createElement('div'); line.className = 'line'; staff.appendChild(line); }
        barEl.appendChild(staff);

        const total = bar.notes.reduce((s, n) => s + (Number(n.duration.split('/')[0]) / Number(n.duration.split('/')[1])), 0);
        const innerW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bar-width')) || 520;
        const pad = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bar-padding')) || 22;
        let cursor = pad;

        bar.notes.forEach(n => {
            const durFrac = Number(n.duration.split('/')[0]) / Number(n.duration.split('/')[1]);
            const w = (innerW - pad * 2) * (durFrac / total);
            const leftPos = cursor + w / 2;

            const note = document.createElement('span');
            const pitchClass = 'p-' + n.pitch.replace('#', 's').replace(/\+/g, '').replace(/\./g, '');

            note.className = `note ${pitchClass} ${durClass(n.duration)}`;
            note.classList.add(stemDirection(n.pitch) === 'up' ? 'stem-up' : 'stem-down');
            note.style.left = leftPos + 'px';

            note.addEventListener('mouseenter', ev => { const t = document.getElementById('noteTip'); t.style.display = 'block'; t.textContent = `${n.pitch} | ${n.duration}`; t.style.left = (ev.clientX + 12) + 'px'; t.style.top = (ev.clientY + 12) + 'px'; });
            note.addEventListener('mousemove', ev => { const t = document.getElementById('noteTip'); t.style.left = (ev.clientX + 12) + 'px'; t.style.top = (ev.clientY + 12) + 'px'; });
            note.addEventListener('mouseleave', () => { document.getElementById('noteTip').style.display = 'none'; });

            staff.appendChild(note);
            cursor += w;
        });
        container.appendChild(barEl);
    });
    
    document.getElementById('meta').textContent = `제목: ${sheet.title} (${sheet.bars.length} 마디)`;
};