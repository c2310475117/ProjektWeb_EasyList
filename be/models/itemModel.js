//!-- backend/models/itemModel.js -->

import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js'; // Annahme: sequelize-Verbindung wird exportiert

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