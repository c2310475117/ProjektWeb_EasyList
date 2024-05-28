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

let svgIcon = ''; // Variable zum Speichern des SVG-Icons



function displayIcons(svgData) {
  const iconList = document.getElementById('icon');
  if (iconList) {
    iconList.innerHTML = ''; // Clear previous entries
    const listItem = document.createElement('div');
    listItem.innerHTML = svgData; // Add SVG data directly as HTML
    iconList.appendChild(listItem);
  } else {
    console.error('Target element for displaying icons not found.');
  }
}

async function start() {
  await fetchMessage();
}


let toDoText = '';

async function addToDo(event) {
  event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seiten-Reload)
  
  const toDoField = document.getElementById('ToDoField');
  const toDoText = toDoField.value.trim();
  
  if (toDoText === '') {
    return; // Leere Einträge ignorieren
  }
  putKeyword(toDoText);
  
//----------------------------------------------------

  const toDoList = document.getElementById('toDoListe');

  // Neues Listenelement erstellen
  const listItem = document.createElement('li');
  listItem.className = 'mdl-list__item todo-item';

  // Span für den Textinhalt erstellen
  const textSpan = document.createElement('span');
  textSpan.className = 'mdl-list__item-primary-content';
  textSpan.textContent = toDoText;

  // Hier wird das SVG-Icon in das div-Element mit einer eindeutigen ID eingefügt
  const iconContainer = document.createElement('div');
  iconContainer.id = `icon-${toDoList.children.length}`; // Eindeutige ID für jedes Icon-Div
  iconContainer.innerHTML = svgIcon; 

  // Checkbox erstellen
  const checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-list__item-secondary-action';
  checkboxLabel.htmlFor = `list-checkbox-${toDoList.children.length}`;
  checkboxLabel.innerHTML = `
    <input type="checkbox" id="list-checkbox-${toDoList.children.length}" class="mdl-checkbox__input" />
  `;

  // Listenelement zusammensetzen
  listItem.appendChild(textSpan);
  listItem.appendChild(iconContainer); // Icon-Container hinzufügen
  listItem.appendChild(checkboxLabel);

  // Listenelement zur ToDo-Liste hinzufügen
  toDoList.appendChild(listItem);

  // Material Design Lite neu initialisieren, damit die neuen Elemente richtig gerendert werden
  componentHandler.upgradeElement(listItem);

  // Eingabefeld zurücksetzen
  toDoField.value = ''; 

}


async function putKeyword(toDoText) {
  try {
    const response = await fetch('http://localhost:3000/api/keyword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyword: toDoText })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Fehler beim Senden des Keywords:', error);
  }
}



document.addEventListener('DOMContentLoaded', start);
document.querySelector('form').addEventListener('submit', addToDo);
document.querySelector('button[type="submit"]').addEventListener('click', addToDo);