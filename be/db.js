//!-- backend/db.js -->

import { Sequelize } from 'sequelize';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

//import Item from './models/itemModel.js';
//import User from './models/userModel.js';
//import List from './models/listModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseFilePath = path.join(__dirname, 'Database', 'EasyListDB.sqlite');
const databaseSqlFilePath = path.join(__dirname, 'Database', 'database.sql');
const databaseSql = fs.readFileSync(databaseSqlFilePath, 'utf-8');


// Verbindung zur Datenbank herstellen
const Sequ = new Sequelize({
    dialect: 'sqlite',
    storage: databaseFilePath // Speicherort der SQLite-Datenbankdatei
});

// Synchronisiere alle Modelle
Sequ.query(databaseSql)
     .then(() => {
         console.log('Datenbankstruktur erstellt');
     })
     .catch(err => {
         console.error('Fehler beim Erstellen der Datenbankstruktur:', err);
     });


export default Sequ ;