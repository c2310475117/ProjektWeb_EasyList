import { DataTypes } from 'sequelize';
import Sequ from '../db.js';

const User = Sequ.define('User', {
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default User;
