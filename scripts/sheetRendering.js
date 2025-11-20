// sheetRendering.js
function sheetRendering(sheet) {
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

    function adjustScale() {
        const wrap = document.querySelector('.sheet-wrap');
        const sheetEl = document.getElementById('sheet');
        if (!wrap || !sheetEl) return;

        const availableWidth = wrap.clientWidth - 100; // 100px padding
        const contentWidth = sheetEl.scrollWidth;

        if (contentWidth > availableWidth) {
            const scale = availableWidth / contentWidth;
            sheetEl.style.transform = `scale(${scale})`;
        } else {
            sheetEl.style.transform = 'scale(1)';
        }
    }

    // Initial adjustment
    adjustScale();

    // Adjust on resize
    window.addEventListener('resize', adjustScale);
}