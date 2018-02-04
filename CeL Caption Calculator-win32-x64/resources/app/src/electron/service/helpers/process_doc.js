const fs = require('fs');



module.exports = (htmlFilePath, mainWindow, ipcMain)=>{
    let docResult = {};
    const htmlFile = fs.readFileSync(htmlFilePath, 'utf-8');
    return new Promise((resolve)=>{
        mainWindow.webContents.send('document:processHTML', htmlFile);
        ipcMain.on('document:tables', (event, processedDoc)=>{
            docResult = processedDoc; 
            console.log(docResult); 
            resolve(docResult);
        });
    });
};
      

            
            
        