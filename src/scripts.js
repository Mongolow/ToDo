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
        listItem.innerHTML = '<button class="text-button" onclick="showTaskDetails(' + task.id + ')">' + task.text + '</button>' + ' ' + (task.done ? ' (Done)' : '');
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

function updateTaskTitle(taskId, title) {
    const tasks = readTasksFromStorage();
    const task = tasks.find(t => String(t.id) === String(taskId));

    if (!task) {
        throw new Error('Task not found.');
    }

    task.text = title;
    writeTasksToStorage(tasks);
}

function normalizeTasksFromImport(data) {
    const rawTasks = Array.isArray(data) ? data : data?.tasks;
    if (!Array.isArray(rawTasks)) {
        throw new Error('Invalid JSON schema. Expected an array or object with tasks array.');
    }

    return rawTasks
        .filter(task => task && typeof task.text === 'string' && task.text.trim())
        .map((task, index) => ({
            id: typeof task.id === 'number' ? task.id : Date.now() + index,
            text: task.text.trim(),
            done: Boolean(task.done),
            createdAt: task.createdAt || new Date().toISOString(),
            task_description: typeof task.task_description === 'string' ? task.task_description : '',
        }));
}

async function exportTasks() {
    const tasks = readTasksFromStorage();
    const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks,
    };

    try {
        if (window.api && typeof window.api.exportTasksToFile === 'function') {
            const result = await window.api.exportTasksToFile(payload);
            if (!result?.canceled) {
                alert('Tasks exported successfully!');
            }
            return;
        }

        // Browser fallback for non-Electron environments.
        const link = document.createElement('a');
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        link.href = URL.createObjectURL(blob);
        link.download = 'tasks.json';
        link.click();
        URL.revokeObjectURL(link.href);
    } catch (err) {
        console.error('Error exporting tasks:', err);
        alert('Failed to export tasks.');
    }
}

async function importTasks() {
    try {
        if (!(window.api && typeof window.api.importTasksFromFile === 'function')) {
            alert('Import is available only in Electron app mode.');
            return;
        }

        const result = await window.api.importTasksFromFile();
        if (result?.canceled) {
            return;
        }

        const importedTasks = normalizeTasksFromImport(result?.data);
        writeTasksToStorage(importedTasks);
        showTasks();
        alert('Tasks imported successfully!');
    } catch (err) {
        console.error('Error importing tasks:', err);
        alert('Failed to import tasks. Please check the file format.');
    }
}