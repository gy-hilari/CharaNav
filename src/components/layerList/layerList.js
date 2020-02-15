import React from 'react';
import Aux from '../../hoc/Auxi';
import ArticleList from '../articleList/articleList';
import AssignedArticleList from '../assignedArticleList/assignedArticleList';

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
                    props.layers.map((layer, idx) => {
                        let num = idx + 1;
                        return (
                            <Aux key={layer.id}>
                                <p>{`${num}.) ${layer.name} | zIndex: ${layer.zIndex}`}</p>
                                <ArticleList
                                    articles={props.articles}
                                    layerId={layer.id}
                                    charId={props.charId}
                                    assign={props.assign}
                                    getArticles={props.getArticles}
                                />
                                {
                                    props.charArts.map((charArt, idx) => {
                                        return charArt.layer === layer.id ? (
                                            <Aux key={charArt.id}>
                                                <AssignedArticleList
                                                    charArt={charArt}
                                                />
                                            </Aux>
                                        ) : (
                                            null
                                        )
                                    })
                                }
                                <hr />
                            </Aux>
                        )
                    })
                }
            </Aux>
        );
};

export default layerList;