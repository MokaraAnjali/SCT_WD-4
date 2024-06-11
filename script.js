const todo = document.querySelector("#todo");
const todolist = document.querySelector("#todos");
const totaltasks = document.querySelector("#totaltasks");
const completedtasks = document.querySelector("#completedtasks");
const remainingtasks = document.querySelector("#remainingtasks");
const maininput = document.querySelector("#todo input[name='taskname']");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

if (localStorage.getItem('tasks')) {
    tasks.map((task) => {
        createTask(task);
    });
}

todo.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = maininput.value.trim();
    const inputDate = todo.querySelector("input[name='deadline']").value;
    if (inputValue === '' || inputDate === '') {
        return;
    }
    const task = {
        id: new Date().getTime(),
        name: inputValue,
        deadline: inputDate,
        isCompleted: false
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createTask(task);
    updateStats();

    todo.reset();
    maininput.focus();
});

todolist.addEventListener('click', (e) => {
    if (e.target.classList.contains('removetask') || e.target.parentElement.classList.contains('removetask')) {
        const taskId = e.target.closest('li').id;
        removeTask(taskId);
    }
});

function createTask(task) {
    const taskEl = document.createElement('li');

    taskEl.setAttribute('id', task.id);
    if (task.isCompleted) {
        taskEl.classList.add('complete');
    }
    const taskElMarkup = `
        <div class="task-details">
            <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
            <span class="task-name" ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
        </div>
        <div class="task-deadline">
            <span>${task.deadline}</span>
        </div>
        <button title="remove task" class="removetask"><i class="fas fa-trash"></i></button>
    `;

    taskEl.innerHTML = taskElMarkup;
    todolist.appendChild(taskEl);

    const checkbox = taskEl.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        task.isCompleted = checkbox.checked;
        if (task.isCompleted) {
            taskEl.classList.add('complete');
        } else {
            taskEl.classList.remove('complete');
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateStats();
    });
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const remaining = total - completed;

    totaltasks.textContent = total;
    completedtasks.textContent = completed;
    remainingtasks.textContent = remaining;
}

function removeTask(taskId) {
    tasks = tasks.filter((task) => task.id !== parseInt(taskId));
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById(taskId).remove();

    updateStats();
}

updateStats();
