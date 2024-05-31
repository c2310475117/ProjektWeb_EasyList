//!-- backend/controller/MedApi.js -->

import fetch from 'node-fetch';
import jsdom from 'jsdom';


let extractedData = []


async function getMedfromAPI(keyword) {
    try {
        console.log('Received keyword:', keyword);

        // URL für die API basierend auf dem Keyword zusammenstellen
        const response = await fetch(`https://www.rxlist.com/api/drugchecker/drugchecker.svc/druglist/${keyword}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const responseData = await response.json(); // Daten als JSON erhalten

        console.log('Response Data:', responseData); // Loggen der erhaltenen Daten

        // Das erste Medikament aus der Liste auswählen
        const firstMed = responseData[0];

        // Extrahieren der ID und des Namens aus der Antwort
        const medData = {
            id: firstMed.ID,
            title: firstMed.Name  
        };

        console.log('Extracted Data:', medData.id, medData.title); // Loggen des extrahierten Medikaments

        return medData; // Das erste Medikament zurückgeben
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Fehler weiterwerfen
    }
}


async function compareMedfromAPI(itemId1, itemId2) {
    try {
        console.log('Verglichene Medikamente compareMedFromAPI :', itemId1, itemId2);

        const response = await fetch(`https://www.rxlist.com/api/drugchecker/drugchecker.svc/interactionlist/${itemId1}_${itemId2}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const responseData = await response.json();
        console.log('API response compareMedFromAPI :', responseData);
        
        return responseData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function compareWithExistingMedications(newMedId) {
    try {
        const response = await fetch('http://localhost:3000/med');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const existingMeds = await response.json();
        let comparisonResults = [];

        for (const med of existingMeds) {
            if (med.id !== newMedId) {
                const comparisonResult = await compareMedfromAPI(newMedId, med.id);
                console.log(`Comparison result for compareWithExistingMedications ${newMedId} and ${med.id}:`, comparisonResult);

                // Extrahiere die relevanten Details aus den Vergleichsergebnissen
                const interactionDetail = extractInteractionDetailUsingJsdom(comparisonResult.DetailList);
                console.log(`Extracted interaction detail compareWithExistingMedications: ${interactionDetail}`);
                
                comparisonResults.push({ newMedId, existingMedId: med.id, interactionDetail });
            }
        }
        
        console.log ('Result in total compareWithExistingMedications:', comparisonResults);
        return comparisonResults;
    } catch (error) {
        console.error('Fehler beim Vergleich der Medikamente:', error);
        throw error;
    }
}


function extractInteractionDetailUsingJsdom(detailList) {
    try {
        if (detailList.length === 0) {
            return 'Keine Wechselwirkungen gefunden';
        }

        // Erstellen Sie ein neues JSDOM-Objekt
        const { JSDOM } = jsdom;
        const dom = new JSDOM(detailList[0]);
        const document = dom.window.document;

        // Wählen Sie das erste <p>-Element aus
        const pElement = document.querySelector('p');

        // Überprüfen, ob ein <p>-Element gefunden wurde, und den Textinhalt zurückgeben
        if (pElement) {
            return pElement.textContent.trim();
        } else {
            return 'Keine Wechselwirkungen gefunden';
        }
    } catch (error) {
        console.error('Fehler beim Extrahieren der Interaktionsdetails mit JSDOM:', error);
        throw error;
    }
}

// Beispiel: Annahme, dass responseData die API-Antwort ist
const responseDataNoInteraction = {
    "DetailList": [],
    "UrlList": [
        "Visit the <a href=\"http://www.rxlist.com/drug-interactions/contraindicated-index/alcohol-usp-top.htm\" target=\"_blank\">alcohol, usp top interactions center</a> for a complete guide to possible interactions"
    ]
};

// Extrahiere das Interaktionsdetail
const interactionDetailNoInteraction = extractInteractionDetailUsingJsdom(responseDataNoInteraction.DetailList);
console.log('Extrahiertes Interaktionsdetail:', interactionDetailNoInteraction);


export { getMedfromAPI, compareMedfromAPI, compareWithExistingMedications }

