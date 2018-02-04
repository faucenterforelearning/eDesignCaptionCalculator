const moment = require('moment');
const accounting = require('accounting');
require('moment-duration-format');
const getColHeaders = (doc)=>{
    return doc[0][0];
}

const getDocRows = (doc)=>{
    let newDoc = doc[0];
    newDoc.shift();
    return newDoc;
}

class MediaDocument {
    constructor(doc, pricePerMin){

        this.pricePerMin = pricePerMin || 2.50;
        this.docHeaders = getColHeaders(doc);
        this.docRows = getDocRows(doc);
        this.composedRows = [];
        this.composedHeaders = [];
        this.courseTotal = 0;
        this.totalRunTime = 0;
    }

    parseDocRows(){
        const rebuiltDoc = [];
        this.docRows.forEach((row)=>{
            const parsedRowObj = {};
            for(let objKey in row){
                parsedRowObj[this.docHeaders[objKey]] = row[objKey]; 
            }
            
            for(let objKey in parsedRowObj){
                if(objKey === 'Mediasite link' || objKey === 'CC (Y/N)' || objKey === 'Location in Course(Module #)'){
                    delete parsedRowObj[objKey];
                }
            }

            parsedRowObj['Module Cost'] = this.calculateModuleCost(parsedRowObj);

           
            if(parsedRowObj['Length(00:00:00)'] !== ''){
                rebuiltDoc.push(parsedRowObj);
            }
            
        });
        
        for(let objKey in rebuiltDoc[0]){
            this.composedHeaders.push(objKey);
        }
        this.composedRows = rebuiltDoc;

        return this.composedRows;
    }

    calculateModuleCost(module){
        
        const duration = moment.duration(module['Length(00:00:00)']);
        const mins = duration.asSeconds() / 60;
        
        let cost = parseFloat(mins * this.pricePerMin);

        this.courseTotal += cost;
        this.totalRunTime += mins;
        
        return accounting.formatMoney(cost);
    
    }

    getCourseTotalCost(){

        if(this.courseTotal === 0){
            this.parseDocRows();
            return accounting.formatMoney(this.courseTotal);
        }
        return accounting.formatMoney(this.courseTotal); 
    }

    getTotalRunTime(){
        if(this.totalRunTime === 0){
            this.parseDocRows();
            return moment.duration(this.totalRunTime, 'minutes').format('hh:mm:ss');
        }
        return moment.duration(this.totalRunTime, 'minutes').format('hh:mm:ss');
    }

    buildForJsonToMD(){

        const rowObjects = this.parseDocRows();
        const headers = this.composedHeaders;

        return {columns: headers, object: rowObjects }
    }
}

module.exports = MediaDocument;