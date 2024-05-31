//!-- frontend/index.js -->

let svgIcon = ''; // Variable zum Speichern des SVG-Icons
let toDoText = '';
let lastItemId = null;


class ToDoListManager {
  constructor() {
    this.init();
  }

  async init() {
    await this.fetchItems('item');
    await this.fetchItems('medication');
    this.setupEventListeners();
  }

  renderItems(items, type) {
    const itemList = document.getElementById('toDoListe');
    itemList.innerHTML = ''; // Clear existing list

    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'todo-list-item';
      listItem.dataset.id = item.id;

      const content = this.createItemContent(item, type);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = 'Delete';

      listItem.appendChild(content);
      listItem.appendChild(deleteButton);

      itemList.appendChild(listItem);
    });
  }

  createItemContent(item, type) {
    const content = document.createElement('div');
    content.className = 'todo-item-content';

    if (type === 'medication') {
      content.innerHTML = `
        <div class="title">Title: ${item.title}</div>
        <div class="id">ID: ${item.id}</div>
        <div id="interactionDetail"></div>
      `;
    } else {
      content.innerHTML = `
        <div class="title-en">Title_en: ${item.title_en}</div>
        <div class="title-de">Title_de: ${item.title_de}</div>
        <div class="icon">${item.icon}</div>
      `;
    }
    return content;
  }

  async putKeyword(toDoText) {
    try {
      const response = await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: toDoText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Fetch items again to update the list
      await this.fetchItems('item');
    } catch (error) {
      console.error('Fehler beim Senden des Keywords:', error);
    }
  }

  async putMedication(toDoText) {
    try {
      const response = await fetch('http://localhost:3000/med', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: toDoText })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Die Antwort des Servers wird in responseData gespeichert
          // Neues Medikament in der Liste erstellen
          // const newMed = await Med.create({ id: data.id, title: data.title });
      const responseData = await response.json();
      console.log('API response for medication:', responseData);

      // Abrufen der aktualisierten Medikamentenliste
      await this.fetchItems('medication');

      // Senden einer Anfrage an den /compare Endpunkt mit der neuen Medikamenten-ID (responseData.id)
      const comparisonResults = await fetch(`http://localhost:3000/compare/${responseData.id}`);
      
      const comparisonData = await comparisonResults.json();
      console.log(`Comparison results for new medication ${responseData.id}:`, comparisonData);
    } catch (error) {
      console.error('Fehler beim Senden des Keywords:', error);
    }
  }

async fetchItems(type) {
  try {
    let endpoint;
    if (type === 'medication') {
      endpoint = 'http://localhost:3000/med'; 
    } else if (type === 'item') {
      endpoint = 'http://localhost:3000/items';
    } else if (type === 'compare') {
      endpoint = `http://localhost:3000/compare/${lastItemId}`;
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(`Fetched ${type}:`, data);

    if (type !== 'compare') {
      this.renderItems(data, type);
    } else {
      // Anzeigen der Wechselwirkungen im Frontend
      const interactionDetailElement = document.getElementById('interactionDetail');
      interactionDetailElement.innerHTML = data.interactionDetail;
    }
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
  }
}


  async addToDo(event) {
    event.preventDefault();

    const toDoField = document.getElementById('ToDoField');
    const toDoText = toDoField.value.trim();

    if (toDoText === '') {
      return;
    }

    const selectedItemType = document.getElementById('itemType').value;
    if (selectedItemType === 'medication') {
      await this.putMedication(toDoText);
    } else {
      await this.putKeyword(toDoText);
    }

    toDoField.value = '';
  }

  async deleteItem(itemId, type) {
    try {
      const endpoint = type === 'medication' ? `http://localhost:3000/med/${itemId}` : `http://localhost:3000/items/${itemId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Fetch items again to update the list
      await this.fetchItems(type);
    } catch (error) {
      console.error('Fehler beim Löschen des Items:', error);
    }
  }

  setupEventListeners() {
    document.getElementById('toDoForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.addToDo(event);
    });

    document.getElementById('toDoListe').addEventListener('click', (event) => {
      const deleteButton = event.target.closest('.delete-button');
      if (deleteButton) {
        const listItem = deleteButton.closest('.todo-list-item');
        const itemId = listItem.dataset.id;
        const itemType = listItem.querySelector('.title-en') ? 'item' : 'medication';
        this.deleteItem(itemId, itemType);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ToDoListManager();
});