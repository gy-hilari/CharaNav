import React, { Component } from 'react';
import MediaQuery from 'react-responsive'
import Aux from '../../hoc/Auxi';
import ArticleList from '../articleList/articleList';
import AssignedArticleList from '../assignedArticleList/assignedArticleList';
import './layerList.css';

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
                <div className="clip-interface">
                    <div className="canvas-interface" id="canvas-interface">
                        <div className="article-canvas">
                            {
                                props.layers.map((layer) => {
                                    return (
                                        <Aux key={`${layer.id}-articles`}>
                                            {
                                                props.charArts.map((charArt, idx) => {
                                                    return charArt.layer === layer.id ? (
                                                        <Aux key={charArt.id}>
                                                            <MediaQuery minWidth={1320}>
                                                                <AssignedArticleList
                                                                    charArt={charArt}
                                                                    getArticle={props.getArticle}
                                                                    dragScale={1}
                                                                    posX={charArt.positionX}
                                                                    posY={charArt.positionY}
                                                                    getArticles={props.getArticles}
                                                                    master={props.master}
                                                                />
                                                            </MediaQuery>
                                                            <MediaQuery minWidth={875} maxWidth={1320}>
                                                                <AssignedArticleList
                                                                    charArt={charArt}
                                                                    getArticle={props.getArticle}
                                                                    dragScale={0.82}
                                                                    posX={charArt.positionX}
                                                                    posY={charArt.positionY}
                                                                    getArticles={props.getArticles}
                                                                    master={props.master}
                                                                />
                                                            </MediaQuery>
                                                            <MediaQuery maxWidth={875}>
                                                                <AssignedArticleList
                                                                    charArt={charArt}
                                                                    getArticle={props.getArticle}
                                                                    dragScale={0.58}
                                                                    posX={charArt.positionX}
                                                                    posY={charArt.positionY}
                                                                    getArticles={props.getArticles}
                                                                    master={props.master}
                                                                />
                                                            </MediaQuery>
                                                        </Aux>
                                                    ) : (
                                                            null
                                                        )
                                                })
                                            }
                                        </Aux>
                                    )
                                })
                            }
                        </div>
                        <div className="layers-ui">
                            <button onClick={() => {
                                props.newLayer({
                                    name: `Layer of char : [${props.charId}]`,
                                    zIndex: 100,
                                    charId: props.charId
                                });
                            }}>Add Layer</button>
                            <hr />
                            <div className="layer-scroll">
                                {
                                    props.layers.map((layer, idx) => {
                                        let num = idx + 1;
                                        return (
                                            <Aux key={layer.id}>
                                                <p>{`Layer [${num}]`}</p>
                                                {/* <p>{`${num}.) ${layer.name} | zIndex: ${layer.zIndex}`}</p> */}
                                                <ArticleList
                                                    articles={props.articles}
                                                    layerId={layer.id}
                                                    charId={props.charId}
                                                    assign={props.assign}
                                                    getArticles={props.getArticles}
                                                    master={props.master}
                                                />
                                                <hr />
                                            </Aux>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Aux>
        );
};

export default layerList;