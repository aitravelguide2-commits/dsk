import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('PageContent', {
  page: { type: DataTypes.STRING, allowNull: false },
  section: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.JSON, allowNull: false },
  last_modified_by: { type: DataTypes.INTEGER, allowNull: false }
});