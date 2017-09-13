
const moment = require('moment');


const getColHeaders = (doc)=>{
    return doc.docBody[0][0];
}

const getDocRows = (doc)=>{
    let newDoc = doc.docBody[0];
    newDoc.shift();
    return newDoc;
}

const parseDocRows = (docRows, docHeaders)=>{
    const rebuiltDoc = [];
    docRows.forEach((row)=>{
        const parsedRowObj = {};
        for(let objKey in row){
            parsedRowObj[docHeaders[objKey]] = row[objKey]; 
        }
        rebuiltDoc.push(parsedRowObj);
    });

    return rebuiltDoc;
} 

const calculateModuleCost = (module, pricePerMin) =>{

    const pricePerMin = pricePerMin || 2.50;
    const duration = moment.duration(module['Length(00:00:00)']);
    const mins = duration.asMinutes().parseInt();

    const cost = mins * pricePerMin;

    module['Module Cost'] = cost;

    return module;
}

module.exports = (event, doc)=>{
     
   //console.log(docResult); 
   const docHeaders = getColHeaders(doc);
   const docRows = getDocRows(doc); 
   const rebuiltDoc = parseDocRows(docRows, docHeaders);

   
}