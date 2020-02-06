import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import CompendiumList from '../../components/compendiumList/compendiumList'
// const {ipcRenderer} = window.require('electron');


class Compendiums extends Component {
    state = {
        comps: [],
        bool: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.comps !== nextState.comps;
    }

    componentDidMount() {
        this.getComps();
    }
    
    getComps = () => {
        window.api.promise('/get/comp', { message: "Querying Compendiums..." }, (res) => {
            this.setState({ comps: res });
        });
    }
    
    createComp = (form) => {
        window.api.promise('/post/comp', form, (res) => {
            this.setState({ comps: res });
        });
    }

    render() {
        return (
            <Aux>
                <button onClick={() => this.createComp({ name: 'Test' })}>CREATE COMPENDIUM</button>
                <CompendiumList
                    comps={this.state.comps}
                />
            </Aux>
        );
    };
}

export default Compendiums;