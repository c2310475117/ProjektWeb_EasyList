//!-- backend/models/listModel.js -->


import { Model, DataTypes, Sequelize } from 'sequelize';

import Sequ from '../db.js';

// Definition des Items-Modells
class List extends Model {}

// Definition des Listen-Modells
List.init ({
   list_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    list_name: {
        type: DataTypes.STRING,
        allowNull: false
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

}, {
    sequelize: Sequ,
    modelName: 'Lists',
    tableName: 'lists', 
    timestamps: true,
    underscored: true 
});


export default List;
