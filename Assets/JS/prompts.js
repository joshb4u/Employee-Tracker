// Node dependencies
const inquirer = require("inquirer");

// Local dependencies
const db = require("./db");

// Database queries
async function deptList() {
    let query = "SELECT * FROM departments";
    let choices = await db.listData(query);
    return choices;
}
async function roleList() {
    let query = "SELECT id, title FROM roles";
    let choices = await db.listData(query);
    return choices;
}
async function employeeList() {
    let query = "SELECT id, CONCAT(first_name, ' ', last_name) FROM employees";
    let choices = await db.listData(query);
    return choices;
}

// Application prompts
const mainMenu = [
    {
        type: "list",
        name: "main",
        message: "What would you like to do?",
        choices: ["VIEW", "ADD", "UPDATE", "REMOVE", "EXIT"],
    },
    {
        type: "list",
        name: "view",
        message: "What would you like to view?",
        choices: [
            { name: "All Departments", value: "dept" },
            { name: "All Roles", value: "role" },
            { name: "All Employees", value: "employee" },
            new inquirer.Separator(),
            { name: "Employees by Department", value: "employee_dept" },
            { name: "Employees by Manager", value: "employee_mgr" },
        ],
        when: function (answers) {
            return answers.main === "VIEW";
        },
    },
    {
        type: "list",
        name: "add",
        message: "What would you like to add?",
        choices: [
            { name: "Department", value: "dept" },
            { name: "Role", value: "role" },
            { name: "Employee", value: "employee" },
        ],
        when: function (answers) {
            return answers.main === "ADD";
        },
    },
    {
        type: "list",
        name: "update",
        message: "What would you like to update?",
        choices: [
            { name: "Department", value: "dept" },
            { name: "Role", value: "role" },
            { name: "Employee", value: "employee" },
        ],
        when: function (answers) {
            return answers.main === "UPDATE";
        },
    },
    {
        type: "list",
        name: "remove",
        message: "What would you like to remove?",
        choices: [
            { name: "Department", value: "dept" },
            { name: "Role", value: "role" },
            { name: "Employee", value: "employee" },
        ],
        when: function (answers) {
            return answers.main === "REMOVE";
        },
    },
];
const view = {
    viewMgr: [
        {
            type: "list",
            name: "mgr",
            message: "Which manager's employees would you like to view?",
            choices: async function (answers) {
                return employeeList();
            },
        },
    ],
    viewDept: [
        {
            type: "list",
            name: "dept",
            message: "Which department employees would you like to view?",
            choices: async function (answers) {
                return deptList();
            },
        },
    ],
};
const add = {
    addDept: [
        {
            type: "input",
            name: "dept",
            message: "What department would you like to add?",
        },
    ],
    addRole: [
        {
            type: "input",
            name: "title",
            message: "What is the job title for the role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
        },
        {
            type: "list",
            name: "roleDept",
            message: "Which department is this role in?",
            choices: async function (answers) {
                return deptList();
            },
        },
    ],
    addEmp: [
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "empRole",
            message: "What is the employee's role?",
            choices: async function (answers) {
                return roleList();
            },
        },
        {
            type: "list",
            name: "empMgr",
            message: "Who is the employee's manager?",
            choices: async function (answers) {
                return employeeList();
            },
        },
    ],
};
const update = {
    updateDept: [
        {
            type: "list",
            name: "dept",
            message: "Which department would you like to update?",
            choices: async function (answers) {
                return deptList();
            },
        },
        {
            type: "input",
            name: "deptName",
            message: "What is the new name for this department?",
        },
    ],
    updateRole: [
        {
            type: "list",
            name: "role",
            message: "Which role would you like to update?",
            choices: async function (answers) {
                return roleList();
            },
        },
        {
            type: "list",
            name: "roleProp",
            message: "What would you like to update for this role?",
            choices: [
                { name: "Title", value: "title" },
                { name: "Salary", value: "salary" },
                { name: "Department", value: "dept_id" },
            ],
        },
        {
            type: "input",
            name: "change",
            message: "What is the new title for this role?",
            when: function (answers) {
                return answers.roleProp === "title";
            },
        },
        {
            type: "input",
            name: "change",
            message: "What is the new salary for this role?",
            when: function (answers) {
                return answers.roleProp === "salary";
            },
        },
        {
            type: "list",
            name: "change",
            message: "Which department is this role moving to?",
            choices: async function (answers) {
                return deptList();
            },
            when: function (answers) {
                return answers.roleProp === "dept_id";
            },
        },
    ],
    updateEmp: [
        {
            type: "list",
            name: "emp",
            message: "Which employee would you like to update?",
            choices: async function (answers) {
                return employeeList();
            },
        },
        {
            type: "list",
            name: "empProp",
            message: "What would you like to update for this employee?",
            choices: [
                { name: "First Name", value: "first_name" },
                { name: "Last Name", value: "last_name" },
                { name: "Role", value: "role_id" },
                { name: "Manager", value: "manager_id" },
            ],
        },
        {
            type: "input",
            name: "change",
            message: "What is the new first name for this employee?",
            when: function (answers) {
                return answers.empProp === "first_name";
            },
        },
        {
            type: "input",
            name: "change",
            message: "What is the new last name for this employee?",
            when: function (answers) {
                return answers.empProp === "last_name";
            },
        },
        {
            type: "list",
            name: "change",
            message: "What is this employee's new role?",
            choices: async function (answers) {
                return roleList();
            },
            when: function (answers) {
                return answers.empProp === "role_id";
            },
        },
        {
            type: "list",
            name: "change",
            message: "What is this employee's new manager?",
            choices: async function (answers) {
                return employeeList();
            },
            when: function (answers) {
                return answers.empProp === "manager_id";
            },
        },
    ],
};
const remove = {
    removeDept: [
        {
            type: "confirm",
            name: "confirmDelete",
            message: "All employees and roles associated with this department will also be deleted! Do you wamt to continue?",
            default: false,
        },
        {
            type: "list",
            name: "dept",
            message: "Which department would you like to remove?",
            choices: async function (answers) {
                return deptList();
            },
            when: function (answers) {
                return answers.confirmDelete === true;
            },
        },
    ],
    removeRole: [
        {
            type: "confirm",
            name: "confirmDelete",
            message: "All employees associated with this department will also be deleted! Do you wamt to continue?",
            default: false,
        },
        {
            type: "list",
            name: "role",
            message: "Which role would you like to remove?",
            choices: async function (answers) {
                return roleList();
            },
            when: function (answers) {
                return answers.confirmDelete === true;
            },
        },
    ],
    removeEmp: [
        {
            type: "list",
            name: "emp",
            message: "Which employee do you want to remove?",
            choices: async function (answers) {
                return employeeList();
            },
        },
    ],
};

module.exports = {
    mainMenu: mainMenu,
    view: view,
    add: add,
    update: update,
    remove: remove,
};
