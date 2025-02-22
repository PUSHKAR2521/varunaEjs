require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// User data with predefined roles
const users = [
    { username: "ce2", email: "ce2@officialbac.xyz", password: "ce2123", role: "ce" },
    { username: "ce", email: "ce@officialbac.xyz", password: "ce123", role: "ce" },
    { username: "crm", email: "crm@officialbac.xyz", password: "crm123", role: "crm" },
    { username: "admin", email: "admin@officialbac.xyz", password: "admin123", role: "admin" },
    { username: "admin", email: "vijaymudaliyar224@gmail.com", password: "vijay123", role: "admin" },
    { username: "user", email: "user@officialbac.xyz", password: "user123", role: "user" },
];

// Function to insert users
const seedUsers = async () => {
    try {
        await User.deleteMany(); // Optional: Clears existing users

        const hashedUsers = await Promise.all(users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        }));

        await User.insertMany(hashedUsers);
        console.log("Users inserted successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error inserting users:", error);
        mongoose.connection.close();
    }
};

// Run the seeding function
seedUsers();
