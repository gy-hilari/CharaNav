import React from 'react';
import Aux from '../../hoc/Auxi';

const characterBrowse = (props) => {
    return props.browseMode === 'char' ? (
        <Aux>
            {
                props.chars.length > 0 &&
                props.chars.map((elm, idx) => {
                    let num = idx + 1;
                    return (
                        <Aux key={elm.id}>
                            <p onClick={() => {
                                props.setActiveImg(null);
                                props.setImgBrowse(false);
                                props.getLayers(elm.id);
                                props.getArticles(elm.id);
                                props.getChar(elm.id);
                            }} className='Character tooltip'>
                                <span className='tooltiptext'>{elm.id}</span>
                                {`${num}.) Name: ${elm.name}`}
                            </p>
                        </Aux>
                    );
                })
            }
            {
                !props.chars.length > 0 &&
                <p>
                    No characters available!
                </p>
            }
        </Aux>
    ) : null;
};

export default characterBrowse

