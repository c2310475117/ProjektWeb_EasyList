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
        //authenticate gibt einen promis zurück 
        //dass die Verbindung zur DB erfolgreich hergestellt werden kann, 
        //bevor Sequelize weiter synchronisiert wird und mit der Datenbankinteraktion beginnt.
        await Sequ.authenticate();
        console.log('Verbindung zur Datenbank erfolgreich hergestellt.');

        import('./models/itemModel.js');
        import('./models/listModel.js');
        import('./models/medModel.js');
        import('./models/userModel.js');

        await Sequ.sync({ alter: true });
        console.log('Datenbank synchronisiert.');
    } catch (error) {
        console.error('Fehler bei der Verbindung zur Datenbank in db.js:', error);
    }
};

export { Sequ, syncDatabase };
export default Sequ;