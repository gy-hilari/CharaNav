import React from 'react';
import Aux from '../../hoc/Auxi';

const CompendiumList = (props) => {    
    return (
        <Aux>
            {
                props.comps.map((elm, idx) => {
                    let num = idx + 1;
                    return <p key={elm}>{`${num}.) ${elm}`}</p>
                })
            }
        </Aux>
    );
};

export default CompendiumList;