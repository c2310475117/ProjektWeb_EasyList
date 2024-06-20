//!-- backend/models/listModel.js -->

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


// Definition des Medications-Modells
class User extends Model {}

User.init({
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }

}, {
    sequelize: Sequ,
    modelName: 'User',
    timestamps: true,
    underscored: true
});

export default User;
