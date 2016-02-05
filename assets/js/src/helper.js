var ipcRenderer = require('electron').ipcRenderer;

var Helper = {
    openWindow: function(url, username, password) {
        ipcRenderer.send('openWindow', {
            username: username,
            password: password,
            url: url
        });
    }
};