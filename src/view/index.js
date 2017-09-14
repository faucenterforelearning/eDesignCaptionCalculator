import React from 'react';
import ReactDOM from 'react-dom';
import FileInput from './components/file_input';
import {ipcRenderer} from 'electron';

const App = ()=>{

    ipcRenderer.on('pdf:rendered',(event, message)=>{
        alert(message);
    });
    

    return(
        <div>
            <FileInput />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#container'));

