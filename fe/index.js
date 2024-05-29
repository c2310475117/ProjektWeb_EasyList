//!-- frontend/index.js -->

let svgIcon = ''; // Variable zum Speichern des SVG-Icons
let toDoText = '';

async function start() {
  await fetchMessage();
}

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

async function fetchItems() {
  try {
    const response = await fetch('http://localhost:3000/items');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    data.forEach(item => displayItemInList(item));
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchItems();
});

function displayItemInList(item) {
  // Zuerst ein Listenelement erstellen
  const listItem = document.createElement('li');

  // Den Inhalt des Items in das Listenelement einfügen
  listItem.innerHTML = `
    <div>ID: ${item.id}</div>
    <div>Title (English): ${item.title_en}</div>
    <div>Title (German): ${item.title_de}</div>
    <div>Icon: ${item.icon}</div>
  `;

  // SVG-Icon einfügen
  const iconContainer = document.createElement('div');
  iconContainer.innerHTML = item.icon; // Hier setzen wir den SVG-Code ein
  listItem.appendChild(iconContainer);

  // Das Listenelement zur Liste hinzufügen
  const itemList = document.getElementById('toDoListe');
  itemList.appendChild(listItem);
}

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


async function putKeyword(toDoText) {
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
  } catch (error) {
    console.error('Fehler beim Senden des Keywords:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  start(); // Ruft start auf, um Nachrichten zu laden
});