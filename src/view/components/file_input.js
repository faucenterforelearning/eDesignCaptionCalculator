import React from 'react';
import ReactDOM from 'react-dom';
import {ipcRenderer} from 'electron';
import fs from 'fs';
import $ from 'jquery';
const HtmlTableToJson = require('html-table-to-json');

class FileInput extends React.Component{

    constructor(props){
        super(props);
        this.state = {error: '', price: "0.00"}

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

            const formData = {
                docResult,
                pricePerMin: this.state.price
            }
            console.log(formData);
            ipcRenderer.send('document:submit', formData);
        }
    }

    render(){
        return (
            <div>
                <form  >
                    <div>
                        <label for = "price">Enter caption Price Per Minute: </label>
                        $
                        <input 
                            id = "price"
                            style= {{width: "4em"}}
                            ref = 'price' 
                            type = "number"
                            label = "Enter Price Per Minute for Captions"
                            name = "Price"
                            value = {this.state.price}
                            onChange = {(e)=>{this.setState({price: e.target.value})}}
                            onFocus = {(e)=>{this.setState({price: ''})}}
                            maxLength = "5"
                        />
                    </div>
                    <p />
                    <div>
                        <label for = "file">Load the course media template document: </label>
                        <p/>
                        <input 
                            id = "file"
                            ref = "file" 
                            type = "file"
                            label = "Select HTML File"
                            name = "File" 
                        />
                    </div>
                    <p/>
                    <div style= {{alignItems: "center"}}>
                        <button type = "submit" onClick = {(e)=>{e.preventDefault(); this.processDocument();}}>Submit</button>
                    </div>
                    
                </form>
            </div>
        );
    }

}

export default FileInput;