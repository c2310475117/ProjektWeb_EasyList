import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('your_database', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'mysql', // oder 'postgres', 'sqlite', etc.
  logging: false,
});

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Datenbank synchronisiert');
  } catch (error) {
    console.error('Fehler beim Synchronisieren der Datenbank:', error);
  }
};

export default sequelize;
