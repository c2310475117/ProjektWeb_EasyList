//!-- backend/controller/api.js -->

import fetch from 'node-fetch';

/*
fetch(" https://api.iconify.design/search?query=butter")
// https://api.iconify.design/search?query={keyword} 
    .then(response => console.log(response))
    .catch(error => console.error(error));
*/

let data = []

async function getIconDatafromAPI(keyword) {
    try {

        console.log('Received keyword:', keyword);

        // URL für die Icons basierend auf dem Keyword zusammenstellen
        const response = await fetch(`https://api.iconify.design/search?query=${keyword}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const responseData = await response.json(); // Daten als JSON erhalten

        console.log('Received keyword:', responseData);

        data = responseData.icons;

         // Überprüfen, ob responseData.icons Daten enthält
         if (data && data.length > 0) {
            // Begrenzen auf die ersten fünf Icons
            const iconsSubset = data.slice(0, 5);

            // Zufällige Position in der Liste generieren
            const randomIndex = Math.floor(Math.random() * iconsSubset.length);

            // Zufälliges Icon aus der Liste auswählen
            const randomIcon = iconsSubset[randomIndex];

            // Überprüfen, ob ein zufälliges Icon ausgewählt wurde
            if (randomIcon) {
                // Icon-Collection und Icon-Namen extrahieren
                const [prefix, name] = randomIcon.split(':');

                // URL für das zufällige Icon zusammenstellen
                const iconURL = `https://api.iconify.design/${prefix}/${name}.svg`;

                console.log('Fetching icon from URL:', iconURL);

                // Daten von der URL abrufen
                const iconResponse = await fetch(iconURL);
                if (!iconResponse.ok) {
                    throw new Error('Failed to fetch icon data');
                }
                const iconData = await iconResponse.text(); // Daten als Text und nicht als JSON erhalten
                console.log('Fetched icon data:', iconData);
                return iconData; // SVG-Daten zurückgeben
            } else {
                throw new Error('No random icon found');
            }
        } else {
            throw new Error('No icons found in the API response');
        }
    } catch (error) {
        console.error('Error in getIconDatafromAPI:', error);
        throw error;
    }
}

// Importieren des Icon-Modells
import Item from '../models/itemModel.js';
/*
async function putKeyword(toDoText) {
  try {
    // Hier wird das Icon abgerufen
    const sendIconData = await getIconDatafromAPI(keyword);

    // Hier wird das Icon in die Datenbank gespeichert
    const savedIcon = await Icon.create({ keyword: toDoText, svg: sendIconData });

    // Das gespeicherte Icon wird an das Frontend zurückgesendet
    res.json({ svg: savedIcon.svg });
  } catch (error) {
    console.error('Fehler beim Senden des Keywords:', error);
    res.status(500).send('Interner Serverfehler');
  }
}*/

export { getIconDatafromAPI };