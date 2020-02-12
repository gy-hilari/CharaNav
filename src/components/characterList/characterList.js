import React from 'react';
import Aux from '../../hoc/Auxi';
import './characterList.css'

const characterList = (props) => {
    return !props.chars ? (
        <Aux>
            <p>Showing character list of {`[${props.compId}]`}!</p>
            <hr />
            <button onClick={() => {
                props.newChar({
                    compId: props.compId,
                    name: `Child Character of compendium: [${props.compId}]`
                });
            }}>Create Character</button>
            <button>
                Create Article
            </button>
            <hr />
        </Aux>
    ) :
        (
            <Aux>
                <p>Showing character list of {`[${props.compId}]`}!</p>
                <hr />
                <button onClick={() => {
                    props.newChar({
                        compId: props.compId,
                        name: `Child Character of compendium: [${props.compId}]`
                    });
                }}>Create Character</button>
                <button>
                    Create Article
                </button>
                <hr />
                {
                    props.chars.map((elm, idx) => {
                        let num = idx + 1;
                        return (
                            <Aux key={elm.id}>
                                <p onClick={() => { props.getChar(elm.id) }} className='Character tooltip'>
                                    <span className='tooltiptext'>{elm.id}</span>
                                    {`${num}.) Name: ${elm.name}`}
                                </p>
                            </Aux>
                        );
                    })
                }
            </Aux>
        );
};

export default characterList;