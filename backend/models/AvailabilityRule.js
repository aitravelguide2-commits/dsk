import { DataTypes } from 'sequelize'

export default (sequelize) => sequelize.define('AvailabilityRule', {
  accommodation_id: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('season','min_stay','block'), allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  min_nights: { type: DataTypes.INTEGER, allowNull: true },
  price_multiplier: { type: DataTypes.FLOAT, allowNull: true },
  price_override: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  reason: { type: DataTypes.STRING, allowNull: true }
})