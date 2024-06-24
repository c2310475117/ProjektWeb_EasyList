// frontend/index.js

class ToDoListManager {
  constructor(token, userId) {
    this.token = token;
    this.userId = userId;
    this.init();
  }

  async init() {
    if (!this.token || !this.userId) {
      console.error('Benutzer nicht authentifiziert.');
      // Hier sollte eine Behandlung für nicht authentifizierte Benutzer erfolgen
      return;
    }

    try {
      await this.fetchUserLists(this.userId);
      await this.fetchItems('item');
      await this.fetchItems('medication');
      this.setupEventListeners();
    } catch (error) {
      console.error('Fehler bei der Initialisierung:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async fetchUserLists(userId) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`http://localhost:3000/user/lists/${userId}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const data = await response.json();
      console.log('Benutzerlisten:', data.lists);
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
      listElement.dataset.listId = list.list_id; // Hier sollte die tatsächliche ID des Listenobjekts verwendet werden
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
    itemElement.dataset.itemId = item.item_id;
    itemElement.innerHTML = `
      <div class="item-content">
        <div class="title">${item.item_title}</div>
        <div class="id">ID: ${item.item_id}</div>
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
          'Authorization': `Bearer ${this.token}`,
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

  async createList(listName, userId) {
    try {
      const response = await fetch('http://localhost:3000/user/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listName, userId })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newList = await response.json();
      console.log('Neue Liste erstellt:', newList);
      await this.fetchUserLists(userId);
    } catch (error) {
      console.error('Fehler beim Erstellen der Liste:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async addItemToList(listId, itemTitle) {
    try {
      const response = await fetch(`http://localhost:3000/items/${listId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_name: itemTitle })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newItem = await response.json();
      console.log('Neues Element hinzugefügt:', newItem);
      await this.fetchUserLists(this.userId);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Elements:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  async deleteList(listId) {
    try {
      const response = await fetch(`http://localhost:3000/user/${listId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      console.log('Liste erfolgreich gelöscht');
      await this.fetchUserLists(this.userId);
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
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      console.log('Element erfolgreich gelöscht');
      await this.fetchUserLists(this.userId);
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
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newItem = await response.json();
      console.log('Neues Item hinzugefügt:', newItem);
      await this.fetchUserLists(this.userId);
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Items:', error);
    }
  }

  async addNewMedication(keyword) {
    try {
      const response = await fetch('http://localhost:3000/med', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword })
      });

      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }

      const newMedication = await response.json();
      console.log('Neue Medikation hinzugefügt:', newMedication);
      await this.fetchUserLists(this.userId);
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Medikation:', error);
    }
  }

  setupEventListeners() {
    const listContainer = document.getElementById('listContainer');
    if (!listContainer) {
      console.error('Element mit ID "listContainer" nicht gefunden.');
      return;
    }

    listContainer.addEventListener('click', async (event) => {
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

    const toDoForm = document.getElementById('toDoForm');
    if (!toDoForm) {
      console.error('Element mit ID "toDoForm" nicht gefunden.');
      return;
    }

    toDoForm.addEventListener('submit', async (event) => {
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

    const createListForm = document.getElementById('createListForm');
    if (!createListForm) {
      console.error('Element mit ID "createListForm" nicht gefunden.');
      return;
    }

    createListForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const listNameInput = document.getElementById('listName');
      const listName = listNameInput.value.trim();

      if (listName !== '') {
        await this.createList(listName, this.userId);
        listNameInput.value = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Hier müssten Sie den Token und die UserId aus dem localStorage laden oder anderweitig setzen
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token') || localStorage.getItem('token');
  const userId = urlParams.get('user_id') || localStorage.getItem('userId');

  if (token && userId) {
    new ToDoListManager(token, userId);
  } else {
    console.error('Token oder Benutzer-ID fehlen.');
    // Hier könnten Sie eine Weiterleitung zum Login oder zur Registrierung implementieren
    // oder eine entsprechende Fehlermeldung anzeigen.
  }
});
