const electron = require('electron');
const os = require('os');
const path = require('path');
const url = require('url');
const tabletojson = require('tabletojson');
const jsonToMarkdownTable = require('json-to-markdown-table');
const fs = require('fs');
const Readable = require('stream').Readable;
const markdownpdf = require('markdown-pdf');
//require('electron-debug')({enabled: true});


const getTitleMDString = require('./service/helpers/get_title_md_string');
const getFooterMDString = require('./service/helpers/get_footer_md_string');


const MediaDocument = require('./service/classes/document');
const getHTMLFile = require('./service/helpers/unzip');
const processDoc = require('./service/helpers/process_doc');
//const addFunctionToJQuery = require('./table_to_json');



const { app, BrowserWindow, ipcMain, dialog, shell } = electron;

let mainWindow;

const windowOptions = {
    width: 400,
    height: 250,
    center: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    backgroundColor: '#1db8e2',
    title: 'CeL Caption Calculator'

};

let outputPath = os.homedir();

//todo - specify an output directory
outputPath = path.join(`${outputPath}/Downloads`);



app.on('ready', () => {

    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../view/index.html'),
        protocol: 'file',
        slashes: true
    }));
    mainWindow.webContents.send('document:selectedDestination', outputPath);
});

ipcMain.on('document:destination', () => {

    const dialogOpts = {
        title: 'Select Output Directory',
        properties: ['openDirectory', 'createDirectory'],

    };
    dialog.showOpenDialog(dialogOpts, (paths) => {

        if (paths) {
            outputPath = paths[0];
        }
        mainWindow.webContents.send('document:selectedDestination', outputPath);

    });
});


ipcMain.on('document:submit', (event, { filePath, pricePerMin }) => {

    getHTMLFile(filePath)
        .then(async (htmlFilePath) => {
            
            const nameArr = htmlFilePath.split('');
           
            if(!nameArr[nameArr.length -1] === 'l' || !nameArr[nameArr.length] -4 === 'h'){
                mainWindow.webContents.send('document:error', 'This zip file did not contain a proper html file from Google Docs');
                return;
            }

            const docResult = await processDoc(htmlFilePath, mainWindow, ipcMain);

            const { docBody, docHead } = docResult;

            const newDoc = new MediaDocument(docBody, pricePerMin);
            //console.log(newDoc);
            const tableObj = newDoc.buildForJsonToMD();

            const headData = getTitleMDString(docHead);

            const { mdString, instructor, courseNum, date } = headData;
            const mdTableString = jsonToMarkdownTable(tableObj.object, tableObj.columns);
            const mdFooterString = getFooterMDString(newDoc.getCourseTotalCost(), newDoc.getTotalRunTime(), pricePerMin);

            const markdownString = mdString.concat(mdTableString, mdFooterString);

            const fileOut = `${outputPath}/${courseNum}_${instructor}_Caption Cost.pdf`;

            const message = `Your file were sucessfully calculated. You can find a pdf for it here: \n${fileOut}`;

            const stream = new Readable();
            stream._read = function noop() { };
            stream.push(markdownString);

            stream.push(null);

            const options = {
                paperOrientation: 'landscape',
                paperFormat: 'A4'
            };

            stream
                .pipe(markdownpdf(options))
                .pipe(
                    fs.createWriteStream(fileOut)
                        .once('close', () => {
                            mainWindow.webContents.send('pdf:rendered', message);
                            shell.openItem(fileOut);
                        })
                );
        })
        .catch((err) => {
            mainWindow.webContents.send('document:error', `There was an error unzipping the file. Did you get the zip from Google Docs? \n${err}`);
            console.log('There was an error unzipping the file', err);
        });
});

