//!-- backend/routes/controllerRoutes.js -->

import User from './userModel.js';
import List from './listModel.js';
import Item from './itemModel.js';
import Med from './medRoutes.js';

const controllerRoutes = () => {
  User.hasMany(List, { foreignKey: 'user_id' });
  List.belongsTo(User, { foreignKey: 'user_id' });

  List.hasMany(Item, { foreignKey: 'list_id' });
  Item.belongsTo(List, { foreignKey: 'list_id' });

  List.hasMany(Med, { foreignKey: 'list_id' });
  Med.belongsTo(List, { foreignKey: 'list_id' });

};

export default controllerRoutes;
