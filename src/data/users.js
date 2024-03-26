import bcrypt from "bcryptjs";

const users = [
  {
    email: "administrator@example.com",
    password: bcrypt.hashSync("AdministratorPass123", 10),
    firstName: "Administrator",
    lastName: "Schools",
    userType: "Admin",
    verified: true,
    isAdmin: true,
    isActive: true,
    isWelcomed: true,
  },
  {
    firstName: "Teacher",
    lastName: "Schools",
    verified: true,
    email: "teacher@example.com",
    password: bcrypt.hashSync("TeacherPass123", 10),
    isAdmin: false,
    isActive: true,
    userType: "Teacher",
    isWelcomed: true,
  },
  {
    firstName: "Student",
    lastName: "Schools",
    verified: true,
    email: "student@example.com",
    password: bcrypt.hashSync("StudentPass123", 10),
    isAdmin: false,
    isActive: true,
    userType: "Student",
    isWelcomed: true,
  },
];

export default users;
