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
  console.log(`Connected to the employees_db database.`)
);

const seeEmployees = () => {
  db.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department,
  roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees manager ON employees.manager_id = manager.id`,
    (err, data) => {
      if (err) {
        console.log(err);
        db.end();
      } else {
        console.table(data);
        main();
      }
    }
  );
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

async function addEmployee() {
  const addname = await inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "first",
    },
    {
      type: "input",
      message: "What is the Employee's last name?",
      name: "last",
    },
  ]);
  db.query(
    "SELECT roles.id, roles.title FROM roles ORDER BY roles.id;",
    async (err, res) => {
      if (err) throw err;
      const { roles } = await inquirer.prompt([
        {
          name: "roles",
          type: "list",
          choices: () => res.map((res) => res.title),
          message: "What is the employee's role?: ",
        },
      ]);
      let roleId;
      for (const row of res) {
        if (row.title === roles) {
          roleId = row.id;
          continue;
        }
      }
      db.query("SELECT * FROM employees", async (err, res) => {
        if (err) throw err;
        let choices = res.map((res) => `${res.first_name} ${res.last_name}`);
        choices.push("none");
        let { manager } = await inquirer.prompt([
          {
            name: "manager",
            type: "list",
            choices: choices,
            message: "Choose the employee's Manager:",
          },
        ]);
        let manager_id;
        let managerName;
        if (manager === "none") {
          manager_id = null;
        } else {
          for (const data of res) {
            data.fullName = `${data.first_name} ${data.last_name}`;
            if (data.fullName === manager) {
              manager_id = data.id;
              managerName = data.fullName;
              continue;
            }
          }
        }
        console.log("Employee Added");
        db.query(
          "INSERT INTO employees SET ?",
          {
            first_name: addname.first,
            last_name: addname.last,
            roles_id: roleId,
            manager_id: manager_id,
          },
          (err, res) => {
            if (err) throw err;
            seeEmployees();
          }
        );
      });
    }
  );
}

async function updateRole() {
  const addname = await inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "first",
    },
    {
      type: "input",
      message: "What is the Employee's last name?",
      name: "last",
    },
  ]);
  db.query(
    "SELECT roles.id, roles.title FROM roles ORDER BY roles.id;",
    async (err, res) => {
      if (err) throw err;
      const { roles } = await inquirer.prompt([
        {
          name: "roles",
          type: "list",
          choices: () => res.map((res) => res.title),
          message: "What is the employee's new role?: ",
        },
      ]);
      let roleId;
      for (const row of res) {
        if (row.title === roles) {
          roleId = row.id;
          continue;
        }
      }
      console.log("Employee role updated!");
      db.query(
        "UPDATE employees SET roles_id = ? WHERE first_name = ? AND last_name = ?",
        [
          roleId,
          addname.first,
          addname.last,
        ],
        (err, res) => {
          if (err) throw err;
          seeEmployees();
        }
      );
    }
  );
}

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
          updateRole();
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
