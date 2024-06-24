//!-- backend/models/itemModel.js -->

import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js';
import List from './listModel.js';

// Definition des Items-Modells
class Item extends Model {}

Item.init({
    item_id: { // korrigiert von idem_id zu item_id
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    
    i_list_id: { // Fremdschlüssel zum Listenmodell
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: List,
            key: 'id' // korrekte Referenz zum Primärschlüssel des Listenmodells
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
    tableName: 'items', 
    timestamps: true,
    underscored: true
});

export default Item;
