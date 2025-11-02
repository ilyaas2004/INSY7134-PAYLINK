const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // <-- add bcrypt
const Employee = require('../models/Employee');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Pre-registered employees
const employees = [
  {
    fullName: 'Sarah Johnson',
    employeeId: 'EMP100001',
    email: 'sarah.johnson@paylink.com',
    password: 'Employee@123',
    role: 'admin',
    department: 'management',
    isActive: true
  },
  {
    fullName: 'Michael Chen',
    employeeId: 'EMP100002',
    email: 'michael.chen@paylink.com',
    password: 'Employee@123',
    role: 'employee',
    department: 'payments',
    isActive: true
  },
  // ...other employees
];

// Seed database
const seedEmployees = async () => {
  try {
    await connectDB();

    // Clear existing employees
    await Employee.deleteMany();
    console.log('Existing employees cleared');

    // Hash passwords before inserting
    for (let emp of employees) {
      emp.password = await bcrypt.hash(emp.password, 10);
    }

    // Insert new employees
    await Employee.insertMany(employees);
    console.log('Employees seeded successfully');

    console.log('\n========== PRE-REGISTERED EMPLOYEES ==========');
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.fullName} (${emp.role.toUpperCase()})`);
      console.log(`   Employee ID: ${emp.employeeId}`);
      console.log(`   Email: ${emp.email}`);
      console.log(`   Password: Employee@123`);
      console.log(`   Department: ${emp.department}\n`);
    });
    console.log('==============================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding employees: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedEmployees();
