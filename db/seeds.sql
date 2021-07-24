  USE employees_DB;

--  departments

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO department (name)
VALUES ("Sales");

--  roles

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead",100000,4);

INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson",80000,4);

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Enginerr",150000,1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer",120000,1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Account Manager",160000,2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant",125000,2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Legal Team Lead",250000,3);

INSERT INTO roles (title, salary, department_id)
VALUES ("Lawyer",190000,3);
