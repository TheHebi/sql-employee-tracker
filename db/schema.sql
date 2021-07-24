DROP DATABASE IF EXISTS employees_DB;

CREATE DATABASE employees_DB;

USE employees_DB;

-- department table
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- roles table
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

-- employee table
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (roles_id)
    REFERENCES roles(id)
    ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE CASCADE
);
