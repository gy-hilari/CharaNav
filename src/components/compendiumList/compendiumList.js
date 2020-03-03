import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './compendiumList.css'

class CompendiumList extends Component {
    state = {
        compHover: null
    }

    render() {
        return this.props.comps ?
            (
                <Aux>
                    <div className="comp-scroller">
                        <div className="buffer"></div>
                        {
                            this.props.comps.map((elm, idx) => {
                                // let num = idx + 1;
                                return (
                                    <Aux key={elm.id}>
                                        <div className="comp-card"
                                            onMouseEnter={() => { this.setState({ compHover: elm.id }); }}
                                            onMouseLeave={() => { this.setState({ compHover: null }); }}
                                        >
                                            <h4 className='Compendium' onClick={() => {
                                                this.props.getChars(elm.id);
                                                this.props.getArticles(elm.id);
                                                this.props.clearChar();
                                                this.props.getComp(elm.id);
                                            }}>{`${elm.name}`}</h4>
                                            {
                                                this.state.compHover === elm.id &&
                                                <h5 className="comp-delete" onClick={() => {
                                                    this.props.deleteConfirm({ route: 'comp', name: elm.name, id: elm.id });
                                                }}>{`Delete ${elm.name}`}</h5>
                                            }
                                        </div>
                                    </Aux>
                                );
                            })
                        }
                    </div>
                </Aux>
            )
            :
            null;
    }
};
export default CompendiumList;