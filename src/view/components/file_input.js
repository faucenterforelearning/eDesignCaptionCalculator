import React from 'react';
import ReactDOM from 'react-dom';
import {ipcRenderer} from 'electron';
import fs from 'fs';
import $ from 'jquery';
const HtmlTableToJson = require('html-table-to-json');

class FileInput extends React.Component{

    constructor(props){
        super(props);
        this.state = {error: ''}

    }

    processDocument(){
       const selectedFile = ReactDOM.findDOMNode(this.refs.file).files[0];
      
       if(selectedFile.type !== 'text/html'){
        this.setState({error: "Please submit an HTML version of the Media Links Document"});
       }else{

            const docResult = {};

            const htmlFile = fs.readFileSync(selectedFile.path, 'utf-8');
            
            const tables = $.parseHTML(htmlFile).filter((node)=> node.nodeName === 'TABLE');

            for(let i = 0; i <= tables.length - 1; i++){
                const container = document.createElement('div');
                container.appendChild(tables[i]); 
                const tableJson = new HtmlTableToJson(container.innerHTML);
                
                i === 0 ? docResult.docHead = tableJson.results : docResult.docBody = tableJson.results;
            }

            ipcRenderer.send('document:submit', docResult);
        }
    }

    render(){
        return (
            <div>
                <form onSubmit = {(e)=>{e.preventDefault(); this.processDocument();}} >
                    <input ref = "file" type = "file"></input>
                    <button type = "submit">Submit</button>
                </form>
            </div>
        );
    }

}

export default FileInput;