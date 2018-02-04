const {MSICreator} = require('electron-wix-msi');

(async ()=>{
    const msiCreator = new MSICreator({
        appDirectory: '../CeL\ Caption\ Calculator-win32-x64',
        description: 'Installer for CeL Caption Calculator',
        exe: 'CeL Caption Calculator',
        name: 'CeL Caption Calculator',
        manufacturer: 'Mikhail Howell',
        version: '0.0.1',
        outputDirectory: '../'
    });

    await msiCreator.create();
    await msiCreator.compile();
})();


