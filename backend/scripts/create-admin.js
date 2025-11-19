import 'dotenv/config';
import sequelize from '../config/db.js';
import { User } from '../models/index.js';

const [,, emailArg, passwordArg, nameArg] = process.argv;
const email = emailArg || 'admin@site.de';
const password = passwordArg || '123456';
const name = nameArg || 'Admin';

try {
  await sequelize.authenticate();
  await sequelize.sync();
  let user = await User.findOne({ where: { email } });
  if (user) {
    await user.update({ password, role: 'admin', name });
    console.log(`✅ Admin aktualisiert: ${email}`);
  } else {
    await User.create({ email, password, role: 'admin', name });
    console.log(`✅ Admin erstellt: ${email}`);
  }
  process.exit(0);
} catch (err) {
  console.error('❌ Fehler beim Erstellen/Aktualisieren des Admins:', err.message);
  process.exit(1);
}
