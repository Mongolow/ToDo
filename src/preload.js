const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showTaskDetails(task) {
        ipcRenderer.send('show-task-details', task);
    }
});