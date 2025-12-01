db = db.getSiblingDB('admin');


var adminUser = db.getUser('admin');
if (adminUser) {
    console.log('✓ Admin user verified in admin database');
} else {
    console.log('✗ CRITICAL: Admin user not found in admin database');
    console.log('This indicates MONGO_INITDB_ROOT_PASSWORD may not have been set');
}

try {
    var pingResult = db.adminCommand('ping');
    if (pingResult.ok === 1) {
        console.log('✓ Admin authentication verified via ping command');
    }
} catch (e) {
    console.log('✗ Admin ping failed: ' + e.message);
}

db = db.getSiblingDB('lumina');

db.createCollection('users');

db.users.createIndex({ email: 1 }, { unique: true });

console.log('MongoDB initialized successfully with lumina database');
