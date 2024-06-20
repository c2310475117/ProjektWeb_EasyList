//!-- backend/models/itemModel.js -->

import express from 'express';
import { Model, DataTypes, Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
// import Sequ from '../db.js';

const router = express.Router();

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseFilePath = path.join(__dirname, 'Database', 'EasyListDB.sqlite');

// Statisches Verzeichnis
const frontendPath = path.join(__dirname, '../fe');
app.use(express.static(frontendPath));

// Verbindung zur Datenbank herstellen
const Sequ = new Sequelize({
    dialect: 'sqlite',
    storage: databaseFilePath // Speicherort der SQLite-Datenbankdatei
});

// Definition des Items-Modells
class Item extends Model {}

Item.init({
    idem_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Lists',
            key: 'id'
        }
    },
    
    item_icon: {
        type: DataTypes.TEXT
    },
 
    item_title_en: {
        type: DataTypes.STRING,
        allowNull: false
    },

    item_title_de: {
        type: DataTypes.STRING,
        allowNull: false
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    
}, {
    sequelize: Sequ,
    modelName: 'Item',
    timestamps: true,
    underscored: true
});


export default Item;