// Node dependencies
const express = require("express");
const inquirer = require("inquirer");

// Local dependencies
const db = require("./Assets/JS/db");
const dispData = require("./Assets/JS/dispData");
const prompts = require("./Assets/JS/prompts");

// Express app and port
const app = express();
const PORT = process.env.PORT || 3000;

// Main application
async function runApp() {
    const answer = await inquirer.prompt(prompts.mainMenu);
    switch (answer.main) {
        case "VIEW":
        return viewData(answer.view);
        case "ADD":
        return addData(answer.add);
        case "UPDATE":
        return updateData(answer.update);
        case "REMOVE":
        return deleteData(answer.remove);
        case "EXIT":
        db.end();
        process.exit();
    }
}

// Get and view data from database
async function viewData(viewAnswer) {
    let query;
    let params;
    switch (viewAnswer) {
        case "dept":
        query = "SELECT * FROM departments";
        break;
        case "role":
        query =
        "SELECT roles.id, roles.title, roles.salary, departments.dept FROM roles LEFT JOIN departments ON roles.dept_id = departments.id";
        break;
        case "employee":
        query =
        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept AS department, roles.salary, COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'N/A') AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id";
        break;
        case "employee_dept":
        answer = await inquirer.prompt(prompts.view.viewDept);
        query =
        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept AS department, roles.salary, COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'N/A') AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id WHERE departments.id = ?";
        params = [answer.dept];
        break;
        case "employee_mgr":
        answer = await inquirer.prompt(prompts.view.viewMgr);
        query =
        "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept AS department, roles.salary, COALESCE(CONCAT(manager.first_name, ' ', manager.last_name), 'N/A') AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id WHERE employees.manager_id = ?";
        params = [answer.mgr];
        break;
    }
    let res = await db.getData(query, params);
    await dispData.table(res, viewAnswer);
    await runApp();
}

// Add data to database
async function addData(addAnswer) {
    let answer;
    let query;
    let params;
    switch (addAnswer) {
        case "dept":
        answer = await inquirer.prompt(prompts.add.addDept);
        query = "INSERT INTO departments (dept) VALUES (?)";
        params = [answer.dept];
        break;
        case "role":
        answer = await inquirer.prompt(prompts.add.addRole);
        query = "INSERT INTO roles SET ?";
        params = { title: answer.title, salary: parseFloat(answer.salary), dept_id: answer.roleDept };
        break;
        case "employee":
        answer = await inquirer.prompt(prompts.add.addEmp);
        query = "INSERT INTO employees SET ?";
        params = {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.empRole,
            manager_id: answer.empMgr,
        };
        break;
    }
    await db.putData(query, params);
    await viewData(addAnswer);
}

// Update data in database
async function updateData(updateAnswer) {
    let answer;
    let query;
    let params;
    switch (updateAnswer) {
        case "dept":
        answer = await inquirer.prompt(prompts.update.updateDept);
        query = "UPDATE departments SET dept = ? WHERE id = ?";
        params = [answer.deptName, answer.dept];
        break;
        case "role":
        answer = await inquirer.prompt(prompts.update.updateRole);
        query = "UPDATE roles SET ? WHERE id = ?";
        params = [{ [answer.roleProp]: answer.change }, answer.role];
        break;
        case "employee":
        answer = await inquirer.prompt(prompts.update.updateEmp);
        query = "UPDATE employees SET ? WHERE id = ?";
        params = [{ [answer.empProp]: answer.change }, answer.emp];
        break;
    }
    await db.putData(query, params);
    await viewData(updateAnswer);
}

// Remove data from database
async function deleteData(removeAnswer) {
    let answer;
    let query;
    let params;
    switch (removeAnswer) {
        case "dept":
        answer = await inquirer.prompt(prompts.remove.removeDept);
        query = "DELETE FROM departments WHERE id = ?";
        params = [answer.dept];
        break;
        case "role":
        answer = await inquirer.prompt(prompts.remove.removeRole);
        query = "DELETE FROM roles WHERE id = ?";
        params = [answer.role];
        break;
        case "employee":
        answer = await inquirer.prompt(prompts.remove.removeEmp);
        params = [answer.emp];
        await db.getData("UPDATE employees SET manager_id = null WHERE manager_id = ?", [params]);
        query = "DELETE FROM employees WHERE id = ?";
        break;
    }
    await db.putData(query, params);
    await viewData(removeAnswer);
}

// Start app when server is listening
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT, "\n");
    console.log(`
    _______  __   __  _______  ___      _______  __   __  _______  _______    __   __  _______  __    _  _______  _______  _______  ______   
   |       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |  |  |_|  ||   _   ||  |  | ||   _   ||       ||       ||    _ |  
   |    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|  |       ||  |_|  ||   |_| ||  |_|  ||    ___||    ___||   | ||  
   |   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___   |       ||       ||       ||       ||   | __ |   |___ |   |_||_ 
   |    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|  |       ||       ||  _    ||       ||   ||  ||    ___||    __  |
   |   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___   | ||_|| ||   _   || | |   ||   _   ||   |_| ||   |___ |   |  | |
   |_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|  |_|   |_||__| |__||_|  |__||__| |__||_______||_______||___|  |_|
   `, "\n");
    runApp();
});