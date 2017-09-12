const electron = require('electron');
const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain} = electron;

let mainWindow;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../view/index.html'),
        protocol: 'file',
        slashes: true
    }));
});