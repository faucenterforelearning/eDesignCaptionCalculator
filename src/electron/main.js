const electron = require('electron');
const path = require('path');
const url = require('url');
const tabletojson = require('tabletojson');
const fs = require('fs');
const handleFile = require('./service/handle_file');

//const addFunctionToJQuery = require('./table_to_json');



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


ipcMain.on('document:submit', (event, docResult)=>{
  handleFile(event, docResult);
});

