//!-- backend/models/listModel.js -->

/*
import { DataTypes } from 'sequelize';
import  Sequ from '../db.js';

// Definition des Listen-Modells
const List = Sequ.define('List', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    // Felder für Übersetzungen
    name_en: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name_de: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Weitere Übersetzungen je nach Bedarf hinzufügen
}, {
    timestamps: false
});

export default List;
*/