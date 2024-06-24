class ToDoListManager {
  constructor() {
    this.init();
  }

  async init() {
    // Überprüfen, ob der Benutzer authentifiziert ist
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.error('Benutzer nicht authentifiziert.');
      // Hier sollte eine Behandlung für nicht authentifizierte Benutzer erfolgen
      return;
    }

    try {
      // Laden der Listen des Benutzers
      await this.fetchUserLists(userId);

      // Laden der Standard-Elemente für den Benutzer
      await this.fetchItems('item'); // Normale Elemente laden
      await this.fetchItems('medication'); // Medikamente laden

      // Event Listener einrichten
      this.setupEventListeners();
    } catch (error) {
      console.error('Fehler bei der Initialisierung:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async fetchUserLists(userId) {
    try {
      const response = await fetch(`http://localhost:3000/user/lists/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const data = await response.json();
      console.log('Benutzerlisten:', data.lists);

      // Benutzerlisten in der UI rendern
      this.renderUserLists(data.lists);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerlisten:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  renderUserLists(lists) {
    const listContainer = document.getElementById('listContainer');
    listContainer.innerHTML = '';

    lists.forEach(list => {
      const listElement = document.createElement('div');
      listElement.classList.add('user-list');
      listElement.dataset.listId = list.id; // Hier sollte die tatsächliche ID des Listenobjekts verwendet werden
      listElement.innerHTML = `
        <h3>${list.list_name}</h3>
        <ul class="item-list"></ul>
        <div class="add-item-form">
          <input type="text" class="item-input" placeholder="Neues Element hinzufügen...">
          <button class="add-item-button">Hinzufügen</button>
        </div>
        <button class="delete-list-button">Liste löschen</button>
      `;

      const itemList = listElement.querySelector('.item-list');
      list.items.forEach(item => {
        const itemElement = this.createItemElement(item);
        itemList.appendChild(itemElement);
      });

      listContainer.appendChild(listElement);
    });
  }

  createItemElement(item) {
    const itemElement = document.createElement('li');
    itemElement.className = 'todo-list-item';
    itemElement.dataset.itemId = item.id;
    itemElement.innerHTML = `
      <div class="item-content">
        <div class="title">${item.title}</div>
        <div class="id">ID: ${item.id}</div>
        <button class="delete-item-button">Löschen</button>
      </div>
    `;
    return itemElement;
  }

  async fetchItems(type) {
    try {
      let endpoint;
      if (type === 'medication') {
        endpoint = 'http://localhost:3000/med';
      } else if (type === 'item') {
        endpoint = 'http://localhost:3000/items';
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const data = await response.json();
      console.log(`Geladene ${type}:`, data);

      this.renderItems(data, type);
    } catch (error) {
      console.error('Fehler beim Abrufen der Elemente:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  renderItems(items, type) {
    // Logik zum Rendern der Items
    items.forEach(item => {
      const itemElement = this.createItemElement(item);
      const list = document.querySelector(`[data-list-id="${item.listId}"] .item-list`);
      if (list) {
        list.appendChild(itemElement);
      }
    });
  }

  async createList(listName) {
    try {
      const response = await fetch('http://localhost:3000/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ list_name: listName })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newList = await response.json();
      console.log('Neue Liste erstellt:', newList);

      // Nach Erstellung der Liste Benutzerlisten aktualisieren
      await this.fetchUserLists(localStorage.getItem('userId'));
    } catch (error) {
      console.error('Fehler beim Erstellen der Liste:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async addItemToList(listId, itemTitle) {
    try {
      const response = await fetch(`http://localhost:3000/lists/${listId}/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: itemTitle })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newItem = await response.json();
      console.log('Neues Element hinzugefügt:', newItem);

      // Nach Hinzufügen des Elements Benutzerlisten aktualisieren
      await this.fetchUserLists(localStorage.getItem('userId'));
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Elements:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async deleteList(listId) {
    try {
      const response = await fetch(`http://localhost:3000/lists/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      console.log('Liste erfolgreich gelöscht');
      // Nach Löschen der Liste Benutzerlisten aktualisieren
      await this.fetchUserLists(localStorage.getItem('userId'));
    } catch (error) {
      console.error('Fehler beim Löschen der Liste:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async deleteItem(itemId, type) {
    try {
      const endpoint = type === 'medication' ? `http://localhost:3000/med/${itemId}` : `http://localhost:3000/items/${itemId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      console.log('Element erfolgreich gelöscht');
      // Nach Löschen des Elements Benutzerlisten aktualisieren
      await this.fetchUserLists(localStorage.getItem('userId'));
    } catch (error) {
      console.error('Fehler beim Löschen des Elements:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async addNewItem(keyword) {
    try {
      const response = await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newItem = await response.json();
      console.log('Neues Item hinzugefügt:', newItem);

      await this.fetchUserLists(localStorage.getItem('userId'));
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Items:', error);
    }
  }

  async addNewMedication(keyword) {
    try {
      const response = await fetch('http://localhost:3000/med', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newMedication = await response.json();
      console.log('Neue Medikation hinzugefügt:', newMedication);

      await this.fetchUserLists(localStorage.getItem('userId'));
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Medikation:', error);
    }
  }

  setupEventListeners() {
    document.getElementById('createListForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('createListForm submit event triggered');
      const listNameInput = document.getElementById('listName');
      const listName = listNameInput.value.trim();
      if (listName !== '') {
        await this.createList(listName);
        listNameInput.value = '';
      }
    });

    document.getElementById('listContainer').addEventListener('click', async (event) => {
      const target = event.target;

      if (target.classList.contains('add-item-button')) {
        console.log('add-item-button clicked');
        const listElement = target.closest('.user-list');
        const listId = listElement.dataset.listId;
        const itemInput = listElement.querySelector('.item-input');
        const itemTitle = itemInput.value.trim();
        if (itemTitle !== '') {
          await this.addItemToList(listId, itemTitle);
          itemInput.value = '';
        }
      }

      if (target.classList.contains('delete-list-button')) {
        console.log('delete-list-button clicked');
        const listElement = target.closest('.user-list');
        const listId = listElement.dataset.listId;
        await this.deleteList(listId);
      }

      if (target.classList.contains('delete-item-button')) {
        console.log('delete-item-button clicked');
        const itemElement = target.closest('.todo-list-item');
        const itemId = itemElement.dataset.itemId;
        const itemType = itemElement.querySelector('.title-en') ? 'item' : 'medication';
        await this.deleteItem(itemId, itemType);
      }
    });

    document.getElementById('toDoForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log('toDoForm submit event triggered');
      const toDoField = document.getElementById('ToDoField');
      const keyword = toDoField.value.trim();
      const itemType = document.getElementById('itemType').value;

      if (keyword !== '') {
        if (itemType === 'item') {
          await this.addNewItem(keyword);
        } else if (itemType === 'medication') {
          await this.addNewMedication(keyword);
        }
        toDoField.value = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ToDoListManager();
});
