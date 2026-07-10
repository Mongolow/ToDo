const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showTaskDetails(task) {
        ipcRenderer.send('show-task-details', task);
    },
    refreshTaskList() {
        ipcRenderer.send('refresh-task-list');
    },
    onRefreshTaskList(callback) {
        ipcRenderer.on('refresh-task-list', callback);
    },
});

