import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Booking', {
  accommodation_id: { type: DataTypes.INTEGER, allowNull: false },
  guest_name: { type: DataTypes.STRING, allowNull: false },
  guest_email: { type: DataTypes.STRING, allowNull: false },
  check_in: { type: DataTypes.DATEONLY, allowNull: false },
  check_out: { type: DataTypes.DATEONLY, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'), defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT }
});