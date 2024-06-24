import { Model, DataTypes } from 'sequelize';
import Sequ from '../db.js';

// Definition des User-Modells
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
    tableName: 'users',
    timestamps: true,  // erstellt automatisch createdAt und updatedAt Felder
    underscored: true
});

export default User;
