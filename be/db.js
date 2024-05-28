//!-- backend/db.js -->

import { Sequelize } from 'sequelize';
//import Item from './models/itemModel.js';
//import User from './models/userModel.js';
//import List from './models/listModel.js';


// Verbindung zur Datenbank herstellen
const Sequ = new Sequelize('db-test', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite', // oder 'sqlite' oder 'postgres' usw., je nachdem, welche Art von Datenbank du verwendest
    // Weitere Optionen, wie z.B. Port, können hier angegeben werden
});

// Synchronisiere alle Modelle
Sequ.sync()
    .then(() => {
        console.log('Datenbank synchronisiert');
    })
    .catch(err => {
        console.error('Fehler beim Synchronisieren der Datenbank:', err);
    })

export default Sequ ;