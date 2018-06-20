const DecompressZip = require('decompress-zip');
const temp = require('temp').track();
const fs = require('fs');
const path = require('path');


module.exports = (fileName)=>{
    
    return new Promise((resolve,reject)=>{
        temp.mkdir('unzipped', (err, dirPath)=>{
            
            if(err){
                reject("test");
            }

            const unzipper = new DecompressZip(fileName);

            unzipper.on('error', (err)=>{
                reject(err+ "test");
            });

            unzipper.extract({
                path: dirPath 
            });

            unzipper.on('extract', ()=>{
                const arrayOfFileNames = fs.readdirSync(dirPath);
                
                const htmlFilePath = path.join(dirPath, arrayOfFileNames[0]);
                resolve(htmlFilePath);

            });
    
        });

    });  
};




