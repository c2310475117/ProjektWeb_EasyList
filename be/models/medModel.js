// backend/models/medModel.js

import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js';

// Definition des Medications-Modells
class Med extends Model {}

Med.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
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
    timestamps: false
});

export default Med;