import React, { Component } from 'react';
import MediaQuery from 'react-responsive'
import Aux from '../../hoc/Auxi';
import ArticleList from '../articleList/articleList';
import AssignedArticleList from '../assignedArticleList/assignedArticleList';
import './layerList.css';

class LayerList extends Component {
    state = {
        assigningLayer: false,
        activeLayerData: null,
        activeLayerImage: null
    }

    render() {
        return this.props.layers ?
            (
                <Aux>
                    <div className="canvas-interface" id="canvas-interface">
                        <div className="article-canvas">
                            {
                                this.props.layers.map((layer) => {
                                    return (
                                        <Aux key={`${layer.id}-articles`}>
                                            {
                                                this.props.charArts.map((charArt, idx) => {
                                                    return charArt.layer === layer.id ? (
                                                        <Aux key={charArt.id}>
                                                            <MediaQuery minWidth={1320}>
                                                                <AssignedArticleList
                                                                    charArt={charArt}
                                                                    getArticle={this.props.getArticle}
                                                                    dragScale={.96}
                                                                    posX={charArt.positionX}
                                                                    posY={charArt.positionY}
                                                                    getArticles={this.props.getArticles}
                                                                    master={this.props.master}
                                                                />
                                                            </MediaQuery>
                                                            <MediaQuery minWidth={875} maxWidth={1320}>
                                                                <AssignedArticleList
                                                                    charArt={charArt}
                                                                    getArticle={this.props.getArticle}
                                                                    dragScale={0.82}
                                                                    posX={charArt.positionX}
                                                                    posY={charArt.positionY}
                                                                    getArticles={this.props.getArticles}
                                                                    master={this.props.master}
                                                                />
                                                            </MediaQuery>
                                                            <MediaQuery maxWidth={875}>
                                                                <AssignedArticleList
                                                                    charArt={charArt}
                                                                    getArticle={this.props.getArticle}
                                                                    dragScale={0.58}
                                                                    posX={charArt.positionX}
                                                                    posY={charArt.positionY}
                                                                    getArticles={this.props.getArticles}
                                                                    master={this.props.master}
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
                            {
                                // ADD MODE & MENU: "ASSIGN ARTICLE FORM" --> CONVERT TO CLASS
                                // STATE / PROPS: CURRENT ACTIVE LAYER
                            }
                            <button onClick={() => {
                                this.props.newLayer({
                                    name: `Layer of char : [${this.props.charId}]`,
                                    zIndex: 100,
                                    charId: this.props.charId
                                });
                            }}>Add Layer</button>
                            <hr />
                            <div className="layer-scroll">
                                {
                                    this.props.layers.length > 0 &&
                                    this.props.layers.map((layer, idx) => {
                                        let num = idx + 1;
                                        return (
                                            <Aux key={layer.id}>
                                                <p>{`Layer [${num}]`}</p>
                                                {
                                                    this.state.assigningLayer === false &&
                                                    <button onClick={() => {
                                                        this.setState({ assigningLayer: true, activeLayerData: {layerId: layer.id, charId: this.props.charId}});
                                                    }}>Add Article</button>
                                                }
                                                {/* <p>{`${num}.) ${layer.name} | zIndex: ${layer.zIndex}`}</p> */}
                                                <ArticleList
                                                    articles={this.props.articles}
                                                    layerId={layer.id}
                                                    charId={this.props.charId}
                                                    assign={this.props.assign}
                                                    getArticles={this.props.getArticles}
                                                    master={this.props.master}
                                                />
                                                <hr />
                                            </Aux>
                                        )
                                    })
                                }
                                {
                                    !this.props.layers.length > 0 &&
                                    <p>
                                        No layers yet!
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                </Aux>
            ) : null;
    }
};

export default LayerList;