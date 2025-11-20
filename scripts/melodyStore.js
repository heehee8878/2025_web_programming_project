class MelodyStore {
    constructor() {
        this.melodies = [];
        this.nextId = 1;
    }

    addMelody(title, notes) {
        const melody = {
            id: this.nextId++,
            title: title,
            notes: notes
        };
        this.melodies.push(melody);
        return melody;
    }

    getMelody(id) {
        return this.melodies.find(melody => melody.id === id);
    }

    getAllMelodies() {
        return this.melodies;
    }

    removeMelody(id) {
        const index = this.melodies.findIndex(melody => melody.id === id);
        if (index !== -1) {
            this.melodies.splice(index, 1);
            return true;
        }
        return false;
    }
}

const melodyStore = new MelodyStore();

document.addEventListener('DOMContentLoaded', () => {
   let toggleStore = false;
   const melodyStoreSideBar = document.getElementById('store');

   melodyStoreSideBar.addEventListener('click', () => {
      toggleStore = !toggleStore;
      if (toggleStore) {
            melodyStoreSideBar.classList.add('open');
            renderMelodyStore();
      }
      else {
            melodyStoreSideBar.classList.remove('open');
      }
   });

   function renderMelodyStore() {
      const storeContent = document.createElement('div');
      storeContent.className = 'store-content';
      const melodies = melodyStore.getAllMelodies();
      
      melodies.forEach(melody => {
            const melodyItem = document.createElement('div');
            melodyItem.className = 'melody-item';
            melodyItem.textContent = melody.title;
            storeContent.appendChild(melodyItem);
      });
      
      melodyStoreSideBar.innerHTML = '';
      melodyStoreSideBar.appendChild(storeContent);
   }
});
