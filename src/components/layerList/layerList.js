import React from 'react';
import Aux from '../../hoc/Auxi';
import ArticleList from '../articleList/articleList';

const layerList = (props) => {
    return !props.layers.length > 0 ? (
        <Aux>
            <button onClick={() => {
                props.newLayer({
                    name: `Layer of char : [${props.charId}]`,
                    zIndex: 100,
                    charId: props.charId
                });
            }}>Add Layer</button>
            <hr />
            <p>No layers yet!</p>
        </Aux>
    )
        :
        (
            <Aux>
                <button onClick={() => {
                    props.newLayer({
                        name: `Layer of char : [${props.charId}]`,
                        zIndex: 100,
                        charId: props.charId
                    });
                }}>Add Layer</button>
                <hr />
                {
                    props.layers.map((elm, idx) => {
                        let num = idx + 1;
                        return (
                            <Aux key={elm.id}>
                                <p>{`${num}.) ${elm.name} | zIndex: ${elm.zIndex}`}</p>
                                <ArticleList
                                    articles={props.articles}
                                    layerId={elm.id}
                                    charId={props.charId}
                                    assign={props.assign}
                                />
                                <hr />
                            </Aux>
                        )
                    })
                }
            </Aux>
        );
};

export default layerList;