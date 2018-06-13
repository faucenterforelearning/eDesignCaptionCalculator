import React from 'react';
import ReactDOM from 'react-dom';
import {ipcRenderer} from 'electron';
const $ = require('jquery');
const HtmlTableToJson = require('html-table-to-json');

class FileInput extends React.Component{

    constructor(props){
        super(props);
        this.state = {error: '', price: '1.95', destination: 'Downloads' };

    }

    componentWillMount(){
        this.startListeners();
    }

    submit(){
        const selectedFile = ReactDOM.findDOMNode(this.refs.file).files[0];
        const filePath = selectedFile.path;
        if(parseFloat(this.state.price) <= 0){
            alert('Price must be greater than 0');
            return;
        }

        if(selectedFile.type !== 'application/zip'){
            alert('The file must be zip file');
            return;
        }

        const formData = {
            filePath,
            pricePerMin: this.state.price
        };
        ipcRenderer.send('document:submit', formData);
        
    }

    startListeners(){

        ipcRenderer.on('document:error', (event, message)=>{
            alert(message);
        });

        ipcRenderer.on('pdf:rendered',(event, message)=>{
            alert(message);
        });
        
        ipcRenderer.on('document:selectedDestination', (event, outputPath)=>{
            this.setState({destination: outputPath});
        });

        ipcRenderer.on('document:processHTML', (event, htmlFile)=>{
            const tables = $.parseHTML(htmlFile).filter((node)=> node.nodeName === 'TABLE');
            const docResult = {};
            for(let i = 0; i <= tables.length - 1; i++){
                const container = document.createElement('div');
                container.appendChild(tables[i]); 
                const tableJson = new HtmlTableToJson(container.innerHTML);
                
                i === 0 ? docResult.docHead = tableJson.results : docResult.docBody = tableJson.results;
            }
            ipcRenderer.send('document:tables', docResult);
        });
    }

    getDestination(){
        ipcRenderer.send('document:destination');
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
                            style= {{width: '4em'}}
                            ref = 'price' 
                            type = "number"
                            label = "Enter Price Per Minute for Captions"
                            name = "Price"
                            value = {this.state.price}
                            onChange = {(e)=>{this.setState({price: e.target.value})}}
                            onFocus = {()=>{this.setState({price: ''})}}
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
                    <div>
                        <input style = {{width: '80%'}}value = {this.state.destination} readOnly type = 'text'></input>
                        <button onClick = {(e)=>{e.preventDefault(); this.getDestination();}}>Save To</button>
                    </div>
                    <p/>
                    <div style= {{alignItems: 'center'}}>
                        <button type = "submit" onClick = {(e)=>{e.preventDefault(); this.submit();}}>Submit</button>
                    </div>
                </form>
            </div>
        );
    }

}

export default FileInput;