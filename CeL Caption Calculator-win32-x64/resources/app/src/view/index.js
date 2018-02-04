import React from 'react';
import ReactDOM from 'react-dom';
import FileInput from './components/file_input';


class App extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <FileInput />
            </div>
        );
    }

}

ReactDOM.render(<App />, document.querySelector('#container'));

