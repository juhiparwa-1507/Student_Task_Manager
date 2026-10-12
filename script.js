
let tasks = [];

function addTask() {
    let input = document.getElementById("taskInput");
    let taskName = input.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        name: taskName,
        completed: false
    });

    input.value = "";
    displayTasks();
}

function completeTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    displayTasks();
}

function displayTasks() {
    let list = document.getElementById("taskList");

    list.innerHTML = tasks.map(task => `
        <li>
            <span class="${task.completed ? 'completed-task' : ''}">
                ${escapeHTML(task.name)}
            </span>

            <span>
                <button onclick="completeTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>

                <button class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </span>
        </li>
    `).join("");

    document.getElementById("total").textContent = tasks.length;

    document.getElementById("pending").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("completed").textContent =
        tasks.reduce((count, task) =>
            count + (task.completed ? 1 : 0), 0);
}

function escapeHTML(text) {
    return text.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}