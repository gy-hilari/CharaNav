import React from 'react';
import Aux from '../../hoc/Auxi';
import './compendiumList.css'

const CompendiumList = (props) => {
    return props.comps ?
        (
            <Aux>
                <div className="comp-scroller">
                    <div className="buffer"></div>
                {
                    props.comps.map((elm, idx) => {
                        // let num = idx + 1;
                        return (
                            <Aux key={elm.id}>
                                    <div className="comp-card">
                                        <h4 className='Compendium' onClick={() => {
                                            props.getChars(elm.id);
                                            props.getArticles(elm.id);
                                            props.clearChar();
                                            props.getComp(elm.id);
                                        }}>{`${elm.name}`}</h4>
                                        {/* <button onClick={() => {
                                            props.delete(elm.id);
                                        }}>Delete</button> */}
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
};
export default CompendiumList;