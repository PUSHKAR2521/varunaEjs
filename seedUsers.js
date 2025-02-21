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
    { username: "admin", email: "a@a", password: "admin123", role: "admin" },
    { username: "crm", email: "b@a", password: "crm123", role: "crm" },
    { username: "ce", email: "c@a", password: "ce123", role: "ce" },
    { username: "user", email: "d@a", password: "user123", role: "user" } // If you need a regular user role
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
