import React from 'react';
import Aux from '../../hoc/Auxi';
import './compendiumList.css'

const CompendiumList = (props) => {
    return props.comps ? 
    (
        <Aux>
            {
                props.comps.map((elm, idx) => {
                    let num = idx + 1;
                    return (
                        <Aux key={elm.id}>
                            <p className='Compendium' onClick={() => {
                                props.getChars(elm.id);
                                props.getArticles(elm.id);
                                props.getComp(elm.id);
                            }}>{`${num}.)id: ${elm.id} Name: ${elm.name}`}</p>
                        </Aux>
                    );
                })
            }
        </Aux>
    ) 
    :
    null;
};
export default CompendiumList;