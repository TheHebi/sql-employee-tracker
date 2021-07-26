const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the movies_bd database.`)
);

const seeEmployees = () => {
  db.query(`SELECT * FROM employees`, (err, data) => {
    if (err) {
      console.log(err);
      db.end();
    } else {
      console.table(data);
      main();
    }
  });
};

const seeRoles = () => {
  db.query("SELECT * FROM roles", (err, data) => {
    if (err) {
      console.log(err);
      db.end();
    } else {
      console.table(data);
      main();
    }
  });
};

const seeDepartments = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      console.log(err);
      db.end();
    } else {
      console.table(data);
      main();
    }
  });
};

const main = () => {
  inquirer
    .prompt({
      type: "list",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "QUIT",
      ],
      message: "what do you want to do?",
      name: "choice",
    })
    .then(({ choice }) => {
      switch (choice) {
        case "View All Employees":
          seeEmployees();
          break;
        case "Add Employee":
          break;
        case "Update Employee Role":
          break;
        case "View All Roles":
          seeRoles();
          break;
        case "Add Role":
          break;
        case "View All Departments":
          seeDepartments();
          break;
        case "Add Department":
          break;

        default:
          console.log("GoodBye!");
          db.end();
          break;
      }
    });
};

main();
