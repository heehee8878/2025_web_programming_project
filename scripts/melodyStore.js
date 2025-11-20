class MelodyStore {
  constructor() {
    this._loadFromLocalStorage();
  }

  _loadFromLocalStorage() {
    const storedMelodies = localStorage.getItem("melodies");
    if (storedMelodies) {
      this.melodies = JSON.parse(storedMelodies);
      this.nextId =
        this.melodies.reduce((maxId, melody) => Math.max(maxId, melody.id), 0) +
        1;
    } else {
      this.melodies = [];
      this.nextId = 1;
    }
  }

  _saveToLocalStorage() {
    localStorage.setItem("melodies", JSON.stringify(this.melodies));
  }

  addMelody(title, notes) {
    const melody = {
      id: this.nextId++,
      title: title,
      notes: notes,
    };
    this.melodies.push(melody);
    this._saveToLocalStorage();
    return melody;
  }

  getAllMelodies() {
    return this.melodies;
  }

  removeMelody(id) {
    const index = this.melodies.findIndex((melody) => melody.id === id);
    if (index !== -1) {
      this.melodies.splice(index, 1);
      this._saveToLocalStorage();
      return true;
    }
    return false;
  }
}

const melodyStore = new MelodyStore();

document.addEventListener("DOMContentLoaded", () => {
  let toggleStore = false;
  const melodyStoreSideBar = document.getElementById("store");

  function renderMelodyStore() {
    // Remove existing content to avoid duplication
    const existingContent = melodyStoreSideBar.querySelector(".store-content");
    if (existingContent) {
      existingContent.remove();
    }

    const storeContent = document.createElement("div");
    storeContent.className = "store-content";
    const melodies = melodyStore.getAllMelodies();

    if (melodies.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No saved melodies.";
      storeContent.appendChild(emptyMessage);
    }
    melodies.forEach((melody) => {
      const melodyItem = document.createElement("div");
      melodyItem.className = "melody-item";
      melodyItem.textContent = melody.title;
      melodyItem.addEventListener("click", () => {
        melodyStoreSideBar.classList.remove("open");
        toggleStore = false;
        
        melodyData = melody.notes;
        
        // 기존 악보 초기화
        const sheetContainer = document.querySelector('.sheet-container') || document.querySelector('#sheet');
        if (sheetContainer) {
          sheetContainer.innerHTML = '';
        }
        
        sheetRendering(melody.notes.sheet);
        updateStatus(`Loaded melody: ${melody.title}`, "success");
      });

      const deletebutton = document.createElement("button");
      deletebutton.textContent = "X";
      deletebutton.className = "delete-button";
      deletebutton.addEventListener("click", (e) => {
         e.stopPropagation();
         const confirmed = confirm(
             `Are you sure you want to delete the melody: "${melody.title}"?`
         );
         if (confirmed) {
           melodyStore.removeMelody(melody.id);
           renderMelodyStore();
         }
      });
      melodyItem.appendChild(deletebutton);

      storeContent.appendChild(melodyItem);
    });

    melodyStoreSideBar.appendChild(storeContent);
  }

  melodyStoreSideBar.addEventListener("click", (event) => {
    // Only toggle if the click is on the sidebar itself or the menu image, not the content.
    if (event.target !== melodyStoreSideBar && event.target.tagName !== "IMG") {
      return;
    }

    toggleStore = !toggleStore;
    if (toggleStore) {
      melodyStoreSideBar.classList.add("open");
      renderMelodyStore();
    } else {
      melodyStoreSideBar.classList.remove("open");
      const existingContent =
        melodyStoreSideBar.querySelector(".store-content");
      if (existingContent) {
        // Delay removal to allow for closing animation
        setTimeout(() => existingContent.remove(), 350);
      }
    }
  });
});
