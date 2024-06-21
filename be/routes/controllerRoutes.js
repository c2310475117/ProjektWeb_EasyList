//!-- backend/routes/controllerRoutes.js -->

import User from '../models/userModel.js';
import List from '../models/listModel.js';
import Item from '../models/itemModel.js';
import Med from '../models/medModel.js';

// Beispiel: Definieren der Controller-Routen
const controllerRoutes = () => {
  User.hasMany(List, { foreignKey: 'user_id' });
  List.belongsTo(User, { foreignKey: 'user_id' });

  List.hasMany(Item, { foreignKey: 'list_id' });
  Item.belongsTo(List, { foreignKey: 'list_id' });

  List.hasMany(Med, { foreignKey: 'list_id' });
  Med.belongsTo(List, { foreignKey: 'list_id' });
};

export { controllerRoutes };
