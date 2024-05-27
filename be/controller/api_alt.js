//!-- backend/controller/api.js -->

import fetch from 'node-fetch';

/*
fetch(" https://api.iconify.design/search?query=butter")
// https://api.iconify.design/search?query={keyword} 
    .then(response => console.log(response))
    .catch(error => console.error(error));
*/

let svgData = []; // Array für SVG-Daten definieren

async function getDataFromAPI(keyword) {
    try {
        const response = await fetch(`https://api.iconify.design/search?query=${keyword}`);
        //`https://api.iconify.design/search?query=${keyword}`
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const responseData = await response.json(); // Daten als JSON erhalten
        svgData = responseData.icons; // SVG-Daten aus der Antwort extrahieren und in das Array einfügen
        console.log(svgData);
        return svgData; // SVG-Daten zurückgeben
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


async function getRandomIconInfo() {
    try {

        // SVG-Daten von der API abrufen
        const svgData = await getDataFromAPI();

        // Begrenzen auf die ersten fünf Icons
        const iconsSubset = svgData.slice(0, 5);

        // Zufälliges Icon auswählen
        const randomIndex = Math.floor(Math.random() * iconsSubset.length);
        const randomIcon = iconsSubset[randomIndex];

        // Icon-Collection und Icon-Namen extrahieren
        const [prefix, iconName] = randomIcon.split(':');


        //const prefix = 'noto';
        //const iconName = 'butter';

        // URL für das zufällige Icon zusammenstellen
        //`https://api.iconify.design/${prefix}/${iconName}.svg`
        const iconURL = `https://api.iconify.design/${prefix}/${iconName}.svg`;

        // Rückgabe der extrahierten Informationen und der URL
        return { prefix, iconName, iconURL };
    } catch (error) {
        console.error('Fehler beim Extrahieren der Icon-Informationen:', error);
    }
}

async function getIconDatafromAPI() {
    try {
        // Zufälliges Icon auswählen und URL erhalten
        const { iconURL } = await getRandomIconInfo();
        console.log('Fetching icon from URL:', iconURL);

        // Daten von der URL abrufen
        const response = await fetch(iconURL);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const iconData = await response.text(); // Daten als Text und nicht als Json erhalten
        console.log('Fetched icon data:', iconData);
        return iconData; // SVG-Daten zurückgeben
    } catch (error) {
        console.error('Error in getIconDatafromAPI:', error);
        console.error('Error:', error);
        throw error;
    }
}


export {getIconDatafromAPI}