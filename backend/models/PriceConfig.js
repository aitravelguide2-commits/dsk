import { DataTypes } from 'sequelize'

export default (sequelize) => sequelize.define('PriceConfig', {
  accommodation_id: { type: DataTypes.INTEGER, allowNull: false },
  extra_costs: { type: DataTypes.JSON, defaultValue: {} },
  discounts: { type: DataTypes.JSON, defaultValue: [] }
})
