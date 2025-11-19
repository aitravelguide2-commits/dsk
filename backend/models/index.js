import 'dotenv/config';
import sequelize from '../config/db.js';

// Model-Funktionen importieren
import UserModel from './User.js';
import AccommodationModel from './Accommodation.js';
import BookingModel from './Booking.js';
import PageContentModel from './PageContent.js';
import PriceConfigModel from './PriceConfig.js';
import AvailabilityRuleModel from './AvailabilityRule.js';
import ChangeLogModel from './ChangeLog.js';

// Model-Instanzen erzeugen
export const User = UserModel(sequelize);
export const Accommodation = AccommodationModel(sequelize);
export const Booking = BookingModel(sequelize);
export const PageContent = PageContentModel(sequelize);
export const PriceConfig = PriceConfigModel(sequelize);
export const AvailabilityRule = AvailabilityRuleModel(sequelize);
export const ChangeLog = ChangeLogModel(sequelize);

// Assoziationen
Booking.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });
Accommodation.hasMany(Booking, { foreignKey: 'accommodation_id' });
PriceConfig.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });
Accommodation.hasOne(PriceConfig, { foreignKey: 'accommodation_id' });
AvailabilityRule.belongsTo(Accommodation, { foreignKey: 'accommodation_id' });
Accommodation.hasMany(AvailabilityRule, { foreignKey: 'accommodation_id' });

export { sequelize };
export default { sequelize, User, Accommodation, Booking, PageContent };
