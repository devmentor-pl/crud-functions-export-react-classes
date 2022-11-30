import React from 'react';
import './App.css';

import { get } from './catFactsProvider.js';
// import { update, remove, create } from './catFactsProvider.js';
import RandomCatBreed from './RandomCatBreed';

class App extends React.Component {
    state = { catFact: '' };

    componentDidMount = () => {
        // update('/kittens', 1, { name: 'Gigi' });
        // remove('/kittens', 2);
        // create('/kittens', { name: 'Max', age: '3 months' });
        get('/fact').then(resp => {
            this.setState({ catFact: resp.fact });
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                {/* <p>testujesz JSON Server - sprawdź zmiany w pliku data.json</p> */}
                    <p>{this.state.catFact}</p>
                    <RandomCatBreed />
                </header>
            </div>
        );
    }
}

export default App;

