const TASKS_STORAGE_KEY = 'todo.tasks';

function readTasksFromStorage() {
	try {
		const raw = localStorage.getItem(TASKS_STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function writeTasksToStorage(tasks) {
	localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

async function saveTask(taskText) {
	const text = taskText.trim();
	if (!text) {
		throw new Error('Task cannot be empty.');
	}

	if (window.api && typeof window.api.saveTask === 'function') {
		return window.api.saveTask({ text });
	}

	const tasks = readTasksFromStorage();
	const task = {
		id: Date.now(),
		text,
		done: false,
		createdAt: new Date().toISOString(),
        task_description: '',
	};

	tasks.push(task);
	writeTasksToStorage(tasks);
	return task;
}



function deleteTask(taskId) {
    const tasks = readTasksFromStorage();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    writeTasksToStorage(updatedTasks);
    showTasks();
}


function showTasks() {
    const tasks = readTasksFromStorage();
    const taskList = document.querySelector('ul');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.innerHTML = '<button class="text-button" onclick="showTaskDetails(' + task.id + ')">' + task.text + '</button>' + ' ' + (task.done ? ' (Done)' : '') + ' ' + new Date(task.createdAt).toLocaleString();
        taskList.appendChild(listItem);
        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.done ? 'Mark as Undone' : 'Mark as Done';
        toggleButton.addEventListener('click', () => {
            task.done = !task.done;
            writeTasksToStorage(tasks);
            showTasks();
        });
        listItem.appendChild(toggleButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        listItem.appendChild(deleteButton);
    });
}

// Function to show task details in a new window
function showTaskDetails(taskId) {
    const tasks = readTasksFromStorage();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        alert('Task not found.');
        return;
    }

    if (window.api && typeof window.api.showTaskDetails === 'function') {
        window.api.showTaskDetails(task);
    }
}

function updateTaskDescription(taskId, description) {
    const tasks = readTasksFromStorage();
    const task = tasks.find(t => String(t.id) === String(taskId));

    if (!task) {
        throw new Error('Task not found.');
    }

    task.task_description = description;
    writeTasksToStorage(tasks);
}
