import { DataTypes } from 'sequelize'

export default (sequelize) => sequelize.define('ChangeLog', {
  entity: { type: DataTypes.STRING, allowNull: false },
  entity_id: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  payload: { type: DataTypes.JSON, allowNull: true },
  user_id: { type: DataTypes.STRING, allowNull: true }
})