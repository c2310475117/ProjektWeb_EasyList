//!-- backend/models/itemModel.js -->

import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js';

// Definition des Items-Modells
class Item extends Model {}

Item.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    /*
    list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Lists',
            key: 'id'
        }
    },
    */
    icon: {
        type: DataTypes.TEXT
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    // Felder für Übersetzungen
    title_en: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title_de: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Weitere Übersetzungen je nach Bedarf hinzufügen
}, {
    sequelize: Sequ, // oder sequelize: Sequ, je nachdem, wie Sie Ihre Instanz benannt haben
    modelName: 'Item',
    timestamps: false
});

export default Item;