USE employeeTracker_db;

INSERT INTO departments
    (dept)
VALUES
    ('Sales'),
    ('Engineering');
    
INSERT INTO roles
    (title, salary, dept_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
	('Engineer', 120000, 2),
	('Junior Engineer', 90000, 2);

    
INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3);