import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js';
import List from './listModel.js';

// Definition des Medications-Modells
class Med extends Model {}

Med.init({
    med_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    m_list_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: List,
            key: 'list_id'
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
    tableName: 'meds', 
    timestamps: false,
    underscored: true
});

export default Med;
