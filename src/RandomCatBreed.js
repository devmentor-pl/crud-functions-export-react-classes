import React from 'react';
import { get } from './catFactsProvider';

class RandomCatBreed extends React.Component {
    state = { cat: {} };

    componentDidMount = () => {
        get('/breeds').then(resp => {
            const random =
                resp.data[Math.floor(Math.random() * resp.data.length)];
            this.setState({ cat: random });
        });
    };

    render() {
        return <p>– {this.state.cat.breed} –</p>;
    }
}

export default RandomCatBreed;
