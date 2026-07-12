const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showTaskDetails(task) {
        ipcRenderer.send('show-task-details', task);
    },
    exportTasksToFile(payload) {
        return ipcRenderer.invoke('export-tasks', payload);
    },
    importTasksFromFile() {
        return ipcRenderer.invoke('import-tasks');
    },
    refreshTaskList() {
        ipcRenderer.send('refresh-task-list');
    },
    onRefreshTaskList(callback) {
        ipcRenderer.on('refresh-task-list', callback);
    },
});

