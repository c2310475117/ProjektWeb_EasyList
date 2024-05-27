//!-- frontend/index.js -->


async function fetchMessage() {
  try {
    const response = await fetch('http://localhost:3000/api/message');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    document.getElementById('message').textContent = data.message;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
  }
}

async function fetchIcons() {
  try {
    const response = await fetch('http://localhost:3000/api/icons');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    console.log('Empfangene Daten:', data);
    displayIcons(data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
  }
}

function displayIcons(svgData) {
  const iconList = document.getElementById('icon');
  iconList.innerHTML = ''; // Vorherige Einträge entfernen

  const listItem = document.createElement('li');
  listItem.innerHTML = svgData; // SVG-Daten direkt als HTML hinzufügen
  iconList.appendChild(listItem);
}

async function start() {
  await fetchMessage();
  
}


function addToDo(event) {
  event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seiten-Reload)
  
  const toDoField = document.getElementById('ToDoField');
  const toDoText = toDoField.value.trim();
  
  if (toDoText === '') {
    return; // Leere Einträge ignorieren
  }
  
  const toDoList = document.getElementById('toDoListe');

  // Neues Listenelement erstellen
  const listItem = document.createElement('li');
  listItem.className = 'mdl-list__item';
  
  listItem.innerHTML = `
    <span class="mdl-list__item-primary-content">
      <i class="material-icons mdl-list__item-avatar">label</i>
      ${toDoText}
    </span>
    <span class="mdl-list__item-secondary-action">
      <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="list-checkbox-${toDoList.children.length}">
        <input type="checkbox" id="list-checkbox-${toDoList.children.length}" class="mdl-checkbox__input" />
      </label>
    </span>
  `;

  // Listenelement zur ToDo-Liste hinzufügen
  toDoList.appendChild(listItem);

  // Material Design Lite neu initialisieren, damit die neuen Elemente richtig gerendert werden
  componentHandler.upgradeElement(listItem);

  // Eingabefeld zurücksetzen
  toDoField.value = ''; 
  
  fetchIcons(toDoField);
  
}

document.addEventListener('DOMContentLoaded', start);
document.querySelector('form').addEventListener('submit', addToDo);