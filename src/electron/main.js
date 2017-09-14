const electron = require('electron');
const path = require('path');
const url = require('url');
const tabletojson = require('tabletojson');
const jsonToMarkdownTable = require('json-to-markdown-table');
const fs = require('fs');
const Readable = require('stream').Readable;
const markdownpdf = require('markdown-pdf');

const getTitleMDString = require('./service/helpers/get_title_md_string');
const getFooterMDString = require('./service/helpers/get_footer_md_string');



const MediaDocument = require('./service/classes/document');

//const addFunctionToJQuery = require('./table_to_json');



const {app, BrowserWindow, ipcMain, dialog} = electron;

let mainWindow;

const windowOptions = {
    width: 320,
    height: 205,
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    backgroundColor: "#1db8e2",
    title: "Course Caption Calculator"

}

const dialogOpts = {
    title: "Select Output Directory",
    properties: ['openDirectory', 'createDirectory'],

}


app.on('ready', ()=>{

    dialog.showOpenDialog(dialogOpts, (paths)=>{
        
        outputPath = paths[0]
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../view/index.html'),
            protocol: 'file',
            slashes: true
        }));
    });
    
});


ipcMain.on('document:submit', (event, {docResult, pricePerMin})=>{
    const {docBody, docHead} = docResult;
    const newDoc = new MediaDocument(docBody, pricePerMin);
    const tableObj = newDoc.buildForJsonToMD();

    const headData = getTitleMDString(docHead);

    const {mdString, instructor, courseNum, date } = headData;
    const mdTableString = jsonToMarkdownTable(tableObj.object, tableObj.columns);
    const mdFooterString = getFooterMDString(newDoc.getCourseTotalCost(), newDoc.getTotalRunTime(), pricePerMin);

    const markdownString = mdString.concat(mdTableString, mdFooterString);

    const fileOut = `${outputPath}/${courseNum}_${instructor}_Caption Cost.pdf`;

    const message = `Your file were sucessfully calculated. You can fine a pdf of it here: \n${fileOut}`;

    const stream = new Readable();
    stream._read = function noop(){};
    stream.push(markdownString);
    
    stream.push(null);

    const options = {
        paperOrientation: 'landscape',
        paperFormat: 'A4'
    }

    stream
    .pipe(markdownpdf(options))
    .pipe(
        fs.createWriteStream(fileOut)
        .once('close',()=>{
            mainWindow.webContents.send('pdf:rendered', message);
        })
    );
});

