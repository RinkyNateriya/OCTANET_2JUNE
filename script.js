document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const todoInput = document.getElementById('todo-input');
    const prioritySelect = document.getElementById('priority-select');
    const dueDateInput = document.getElementById('due-date');
    const searchInput = document.getElementById('search-input');
    const todoList = document.getElementById('todo-list');
    const taskError = document.getElementById('task-error');
    const priorityError = document.getElementById('priority-error');
    const dateError = document.getElementById('date-error');
    let editIndex = -1;
    // To track the index edited

    // Load tasks from localStorage on page load
    loadTasks();
    console.log(loadTasks);


    // Add a new task or edit 
    addBtn.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value.trim();

        let isValid = true;

        if (taskText === "") {
            taskError.textContent = 'Please enter your task';
            isValid = false;
        } else {
            taskError.textContent = '';
        }

        if (priority === "") {
            priorityError.textContent = 'Please select your task priority';
            isValid = false;
        } else {
            priorityError.textContent = '';
        }

        if (dueDate === "") {
            dateError.textContent = 'Please enter your task date';
            isValid = false;
        } else {
            dateError.textContent = '';
        }

        if (isValid) {
            if (editIndex === -1) {
                // Add new task
                const taskNumber = todoList.children.length + 1; // Calculate task number based on current list length
                const taskId = Date.now();
                const task = { taskText, priority, dueDate, taskNumber, taskId, completed: false };
                addTask(task);
                saveTaskToLocalStorage(task);
                console.log(saveTaskToLocalStorage);
            } else {
                // Edit existing task
                const taskId = todoList.children[editIndex].dataset.id;
                saveEditedTask(editIndex, taskText, priority, dueDate, taskId);
                editIndex = -1;
                addBtn.textContent = 'Add';
            }
            todoInput.value = '';
            prioritySelect.value = '';
            dueDateInput.value = '';
            modalHide();
        }
    });

    // Add task function
    function addTask(task) {
        const li = createTaskElement(task);
        todoList.appendChild(li);
        updateTaskNumbers();
    }

    // Edit task function
    function saveEditedTask(index, taskText, priority, dueDate, taskId) {
        const task = { taskText, priority, dueDate, taskNumber: index + 1, taskId, completed: todoList.children[index].classList.contains('completed') };
        replaceTask(index, task);
        updateLocalStorage();
        updateTaskNumbers();
    }

    //function create task element
    function createTaskElement(task) {
        const { taskText, priority, dueDate, taskNumber, taskId, completed } = task;

        const li = document.createElement('li');
        li.classList.add('task-item', `priority-${priority}`);
        li.dataset.id = taskId;
        if (completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', (event) => {
            li.classList.toggle('completed', event.target.checked);
            updateLocalStorage();
            console.log(updateLocalStorage);

        });

        const taskSpan = document.createElement('span');
        taskSpan.textContent = `${taskNumber}. ${taskText}`;

        const prioritySpan = document.createElement('span');
        prioritySpan.textContent = `Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;

        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = dueDate ? `Due: ${dueDate}` : '';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.backgroundColor = '#FFA500';
        editBtn.style.color = 'white';
        editBtn.addEventListener('click', () => {
            if (li.classList.contains('completed')) return;

            ClearModal("Edit");

            todoInput.value = taskText;
            prioritySelect.value = priority;
            dueDateInput.value = dueDate;

            editIndex = Array.from(todoList.children).indexOf(li);
            addBtn.textContent = 'Save';
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor = '#FF0000';
        deleteBtn.style.color = 'white';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            updateLocalStorage();
            updateTaskNumbers();
        });

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(prioritySpan);
        li.appendChild(dueDateSpan);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    // Replace existing task with updated task
    function replaceTask(index, task) {
        const li = createTaskElement(task);
        todoList.replaceChild(li, todoList.children[index]);
    }

    // Save task to localStorage
    function saveTaskToLocalStorage(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const existingTask = tasks.find(t => t.taskId === task.taskId);
        if (!existingTask) {
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    // Update tasks in localStorage
    function updateLocalStorage() {
        const tasks = Array.from(todoList.children).map((taskElement, index) => {
            const taskNumber = index + 1;
            const taskText = taskElement.querySelector('span:nth-child(2)').textContent.split('. ')[1];
            const priority = taskElement.classList[1].split('-')[1];
            const dueDate = taskElement.querySelector('span:nth-child(4)').textContent.slice(5);
            const completed = taskElement.querySelector('input[type="checkbox"]').checked;
            const taskId = taskElement.dataset.id; // Get the unique ID from the data attribute
            return { taskText, priority, dueDate, taskNumber, taskId, completed };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        todoList.innerHTML = '';
        tasks.forEach(task => {
            addTask(task);
        });
    }

    // Update task numbers
    function updateTaskNumbers() {
        Array.from(todoList.children).forEach((taskElement, index) => {
            const taskSpan = taskElement.querySelector('span:nth-child(2)');
            const taskText = taskSpan.textContent.split('. ')[1];
            taskSpan.textContent = `${index + 1}. ${taskText}`;
        });
        updateLocalStorage();
    }

    // Search tasks
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const tasks = todoList.getElementsByTagName('li');
        Array.from(tasks).forEach(task => {
            const taskText = task.querySelector('span:nth-child(2)').textContent.toLowerCase();
            if (taskText.includes(searchText)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    });
});

// modaldata get
var modal = document.getElementById("todoModal");


var btn = document.getElementById("add-task");

var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

// close code
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// clear code
function ClearModal(data) {
    if (data === "add") {
        document.getElementById('todo-input').value = "";
        document.getElementById('priority-select').value = "";
        document.getElementById('due-date').value = "";
        document.getElementById('add-btn').textContent = "Add";
        modal.style.display = "block";
    }
    else if (data === "Edit") {
        modal.style.display = "block";
    }
}

function modalHide() {
    modal.style.display = "none";
}
