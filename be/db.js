import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import path from 'path';

// Konvertiert die URL der aktuellen Datei in Dateipfad.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Verbindet den Verzeichnispfad (__dirname) mit weiteren Verzeichnisebenen + Dateinamen (EasyListDB.sqlite)
const databaseFilePath = path.join(__dirname, 'Database', 'EasyListDB.sqlite');

// Verbindung zur Datenbank herstellen
const Sequ = new Sequelize({
    dialect: 'sqlite',
    storage: databaseFilePath // Speicherort der SQLite-Datenbankdatei
});

// Synchronisiere alle Modelle
const syncDatabase = async () => {
    try {
        await Sequ.authenticate();
        console.log('Connection to the database has been established successfully.');
        await Sequ.sync({ force: true }); // { force: true } !!!!
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};


export { Sequ, syncDatabase };
export default Sequ;