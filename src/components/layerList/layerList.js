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
        activeLayerImage: null,
        activeCharArt: null,
        dragState : 'disabled'
    }

    layerMode = (mode) => {
        this.setState({ assigningLayer: mode });
    }

    setActiveCharArt = (id) => {
        this.setState({ activeCharArt: id });
    }

    render() {
        return this.props.layers ?
            (
                <Aux>
                    {
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
                                                                        dragMode={this.state.dragState}
                                                                        dragScale={.96}
                                                                        posX={charArt.positionX}
                                                                        posY={charArt.positionY}
                                                                        getArticles={this.props.getArticles}
                                                                        master={this.props.master}
                                                                        activeCharArt={this.state.activeCharArt}
                                                                    />
                                                                </MediaQuery>
                                                                <MediaQuery minWidth={875} maxWidth={1320}>
                                                                    <AssignedArticleList
                                                                        charArt={charArt}
                                                                        getArticle={this.props.getArticle}
                                                                        dragMode={this.state.dragState}
                                                                        dragScale={0.82}
                                                                        posX={charArt.positionX}
                                                                        posY={charArt.positionY}
                                                                        getArticles={this.props.getArticles}
                                                                        master={this.props.master}
                                                                        activeCharArt={this.state.activeCharArt}
                                                                    />
                                                                </MediaQuery>
                                                                <MediaQuery maxWidth={875}>
                                                                    <AssignedArticleList
                                                                        charArt={charArt}
                                                                        getArticle={this.props.getArticle}
                                                                        dragMode={this.state.dragState}
                                                                        dragScale={0.58}
                                                                        posX={charArt.positionX}
                                                                        posY={charArt.positionY}
                                                                        getArticles={this.props.getArticles}
                                                                        master={this.props.master}
                                                                        activeCharArt={this.state.activeCharArt}
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
                                <p>Lock Layers</p>
                                <input type="checkbox" className="drag-toggle" id="character-edit-toggle" onChange={()=>{
                                    // console.log(document.getElementById('character-edit-toggle').checked);
                                    this.setState({dragState: this.state.dragState === true ? 'disabled' : true});
                                }} defaultChecked/>
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
                                            return (
                                                <Aux key={layer.id}>
                                                    <p>{`Layer [${layer.zIndex}]`}</p>
                                                    {
                                                        // this.state.assigningLayer === false &&
                                                        <button onClick={() => {
                                                            this.setState({ assigningLayer: true, activeLayerData: { layerId: layer.id, charId: this.props.charId } });
                                                        }}>Add Article</button>
                                                    }
                                                    {/* <p>{`${num}.) ${layer.name} | zIndex: ${layer.zIndex}`}</p> */}
                                                    <hr />
                                                    {
                                                        this.props.charArts.map((charArt, idx) => {
                                                            return charArt.layer === layer.id ? (
                                                                <Aux key={charArt.id}>
                                                                    <AssignedArticleList
                                                                        charArt={charArt}
                                                                        getArticle={this.props.getArticle}
                                                                        dragMode={false}
                                                                        // dragScale={.96}
                                                                        // posX={charArt.positionX}
                                                                        // posY={charArt.positionY}
                                                                        getArticles={this.props.getArticles}
                                                                        master={this.props.master}
                                                                        setActive={this.setActiveCharArt}
                                                                    />
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
                                    {
                                        !this.props.layers.length > 0 &&
                                        <p>
                                            No layers yet!
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {
                        this.state.assigningLayer === true &&
                        <Aux>
                            <div className="article-modal">
                                <h2>Assigning article to layer {`[${this.state.activeLayerData.layerId}]`}</h2>
                                <ArticleList
                                    articles={this.props.articles}
                                    layerId={this.state.activeLayerData.layerId}
                                    charId={this.props.charId}
                                    layerMode={this.layerMode}
                                    assign={this.props.assign}
                                    getArticles={this.props.getArticles}
                                    master={this.props.master}
                                />
                            </div>
                            <div className="backdrop"></div>
                        </Aux>

                    }
                </Aux>
            ) : null;
    }
};

export default LayerList;