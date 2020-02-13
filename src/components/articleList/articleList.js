import React from 'react';
import Aux from '../../hoc/Auxi';

const articleList = (props) => {
    return !props.articles.length > 0 ? (
        <Aux>
            {/* <p>Showing articles of character : {`[${props.charId}]`}</p> */}
            <p>No articles created in compendium yet!</p>
        </Aux>
    )
        :
        (

            <Aux>
                {/* <p>Showing articles of character : {`[${props.charId}]`}</p> */}
                <select id={`${props.layerId}-sel`}>
                    {
                        props.articles.map((elm, idx) => {
                            return (
                                <Aux key={elm.id}>
                                    <option value={elm.id}>{elm.name}</option>
                                </Aux>
                            )
                        })
                    }
                </select>
                <button onClick={() => {
                    props.assign({
                        position: '100, 100',
                        charId: props.charId,
                        artId: document.getElementById(`${props.layerId}-sel`).value,
                        layerId: props.layerId
                    });
                }}>Add Article</button>
            </Aux>
        );
};

export default articleList;