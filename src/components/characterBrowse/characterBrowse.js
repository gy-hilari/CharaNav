import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import './characterBrowse.css';

class CharacterBrowse extends Component {
    state = {
        hoverChar: null
    };

    render() {
        return this.props.browseMode === 'char' ? (
            <Aux>
                {
                    this.props.chars.length > 0 &&
                    this.props.chars.map((elm, idx) => {
                        let num = idx + 1;
                        return (
                            <Aux key={elm.id}>
                                <div className="char-card"
                                    onMouseEnter={() => { this.setState({ hoverChar: elm.id }); }}
                                    onMouseLeave={() => { this.setState({ hoverChar: null }); }}
                                >
                                    <h4 className="tooltip" onClick={() => {
                                        this.props.setActiveImg(null);
                                        this.props.setImgBrowse(false);
                                        this.props.getLayers(elm.id);
                                        this.props.getArticles(elm.id);
                                        this.props.getChar(elm.id);
                                    }}>
                                        <span className='tooltiptext'>{elm.id}</span>
                                        {`${elm.name}`}
                                    </h4>
                                    {
                                        this.state.hoverChar === elm.id &&
                                        <h5 className="char-delete" onClick={() => {
                                            this.props.delete(elm.id);
                                        }}>{`Delete ${elm.name}`}</h5>
                                    }
                                </div>
                            </Aux>
                        );
                    })
                }
                {
                    !this.props.chars.length > 0 &&
                    <h2 className="char-error">
                        No characters available!
                    </h2>
                }
            </Aux>
        ) : null;
    }
};

export default CharacterBrowse

