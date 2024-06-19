// backend/models/medModel.js

import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js'; // Annahme: sequelize-Verbindung wird exportiert

// Definition des Medications-Modells
class Med extends Model {}

Med.init({
    med_id: {
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

    med_title_en: {
        type: DataTypes.STRING,
        allowNull: false
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    sequelize: Sequ, 
    modelName: 'Med',
    timestamps: false,
    underscored: true
});

export default Med;