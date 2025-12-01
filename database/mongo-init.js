// Switch to admin database to verify root user exists
db = db.getSiblingDB('admin');

// Note: When MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD are set,
// MongoDB automatically creates the root user, so we just verify it exists
var adminUser = db.getUser('admin');
if (adminUser) {
    console.log('Admin user already created by MongoDB initialization');
} else {
    console.log('Warning: Admin user not found. Check MONGO_INITDB_ROOT_PASSWORD env var');
}

// Switch to application database and create collections
db = db.getSiblingDB('lumina');

db.createCollection('users');

db.users.createIndex({ email: 1 }, { unique: true });

console.log('MongoDB initialized successfully with lumina database');
