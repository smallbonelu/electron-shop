import bcrypt from "bcryptjs";
const users = [
  {
    name: "Admin",
    email: "admin@contoso.com",
    password: bcrypt.hashSync("P@ssword234", 15),
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Jane Doe",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
