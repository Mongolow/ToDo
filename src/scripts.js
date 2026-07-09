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
        listItem.textContent = task.text + ' ' + (task.done ? ' (Done)' : '');
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
