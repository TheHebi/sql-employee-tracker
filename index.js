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
  db.query(`SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department,
  roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees manager ON employees.manager_id = manager.id`, (err, data) => {
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

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Department Name?",
        name: "name",
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT INTO department (name) VALUES(?)`,
        [answers.name],
        (err, data) => {
          if (err) {
            console.log(err);
            db.end();
          } else {
            console.log("Department Added!");
            seeDepartments();
          }
        }
      );
    });
};

const addRole = () => {
  db.query("SELECT * FROM department", (err, data) => {
    if (err) {
      console.log(err);
      db.end();
    } else {
      const inqDeps = data.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "input",
            message: "Name of Role?",
            name: "name",
          },
          {
            type: "list",
            message: "Which department does this role belong to?",
            choices: inqDeps,
            name: "department_id",
          },

          {
            type: "input",
            message: "What is this roles salary?",
            name: "salary",
          },
        ])
        .then((answers) => {
          console.log(answers);
          db.query(
            `INSERT INTO roles (title,salary,department_id) VALUES(?,?,?)`,
            [answers.name, answers.salary, answers.department_id],
            (err, data) => {
              if (err) {
                console.log(err);
                db.end();
              } else {
                console.log("Role added!");
                seeRoles();
              }
            }
          );
        });
    }
  });
};

const addEmployee = () => {
  db.query("SELECT * FROM roles", (err, data) => {
    if (err) {
      console.log(err);
      db.end();
    } else {
      const inqRoles = data.map((roles) => {
        return {
          name: roles.title,
          value: roles.id,
        };
      });
      
      inquirer
        .prompt([
          {
            type: "input",
            message: "Employee's first name??",
            name: "first_name",
          },
          {
            type: "input",
            message: "Employee's last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What is this employee's role?",
            choices: inqRoles,
            name: "roles_id",
          },
        //   {
        //     type: "list",
        //     message: "Who is this employees manager?",
        //     choices: selectManager(),
        //     name: "manager_id",
        //   },
        ])
        .then((answers) => {
          console.log(answers);
          db.query(
            `INSERT INTO employees (first_name,last_name,roles_id) VALUES(?,?,?)`,
            [answers.first_name, answers.last_name, answers.roles_id],
            (err, data) => {
              if (err) {
                console.log(err);
                db.end();
              } else {
                console.log("Role added!");
                seeEmployees();
              }
            }
          );
        });
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
          addEmployee();
          break;
        case "Update Employee Role":
          break;
        case "View All Roles":
          seeRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          seeDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;

        default:
          console.log("GoodBye!");
          db.end();
          break;
      }
    });
};

main();
