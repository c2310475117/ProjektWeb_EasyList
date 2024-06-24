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
      this.fetchItems(list.list_id, itemList);

      listContainer.appendChild(listElement);
    });
  }

  async fetchItems(listId, itemList) {
    try {
      const response = await fetch(`http://localhost:3000/items?list_id=${listId}`, {
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
      console.log(`Geladene Items für Liste ${listId}:`, data);

      data.forEach(item => {
        const itemElement = this.createItemElement(item);
        itemList.appendChild(itemElement);
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Elemente:', error);
      // Hier sollte eine Fehlerbehandlung erfolgen
    }
  }

  createItemElement(item) {
    const itemElement = document.createElement('li');
    itemElement.className = 'todo-list-item';
    itemElement.dataset.itemId = item.id;
    itemElement.innerHTML = `
      <div class="item-content">
        <div class="title">${item.item_title_en}</div>
        <div class="id">ID: ${item.id}</div>
        <button class="delete-item-button">Löschen</button>
      </div>
    `;
    return itemElement;
  }

  async createList(listName) {
    try {
      const response = await fetch('http://localhost:3000/user/lists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listName })
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
      const response = await fetch(`http://localhost:3000/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keyword: itemTitle, userId: localStorage.getItem('userId') })
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
        const response = await fetch(`http://localhost:3000/user/lists/${listId}`, {
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


  async deleteItem(itemId) {
    try {
      const response = await fetch(`http://localhost:3000/items/${itemId}`, {
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
        await this.deleteItem(itemId);
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
          await this.addItemToList(keyword);
        } else if (itemType === 'medication') {
          await this.addItemToList(keyword);
        }
        toDoField.value = '';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ToDoListManager();
});
