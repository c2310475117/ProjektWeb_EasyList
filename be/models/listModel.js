import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js'; // Annahme: sequelize-Verbindung wird exportiert

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
    modelName: 'List',
    timestamps: true,
    underscored: true 
});


export default List;
