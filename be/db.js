//!-- backend/db.js -->

import { Sequelize } from 'sequelize';
// import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import controllerRoutes from './routes/controllerRoutes.js';

// import der models !! um sicherzustellen, dass die init-Methoden der Modelle ausgeführt werden 
// und die Modelle bei der Sequelize-Instanz registriert werden.
import Item from './models/itemModel.js';
import User from './models/userModel.js';
import List from './models/listModel.js';
import Med from './models/medModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseFilePath = path.join(__dirname, 'Database', 'EasyListDB.sqlite');

// Verbindung zur Datenbank herstellen
const Sequ = new Sequelize({
    dialect: 'sqlite',
    storage: databaseFilePath // Speicherort der SQLite-Datenbankdatei
});

controllerRoutes();

// Synchronisiere alle Modelle
const syncDatabase = async () => {
    try {
        await Sequ.sync({ force: true }); // force: true wird alle Tabellen löschen und neu erstellen, verwenden Sie dies mit Vorsicht.
        console.log('Datenbank synchronisiert');
    } catch (err) {
        console.error('Fehler beim Synchronisieren der Datenbank:', err);
    }
};

syncDatabase();

export default Sequ ;