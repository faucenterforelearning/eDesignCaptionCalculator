import React from 'react';
import ReactDOM from 'react-dom';
import FileInput from './components/file_input';

const App = ()=>{
    return(
        <div>
            <FileInput />
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector('#container'));

