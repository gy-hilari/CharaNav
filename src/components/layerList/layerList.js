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
        dragState: 'disabled',
        editing: false,
        editLayer: null
    }

    layerMode = (mode) => {
        this.setState({ assigningLayer: mode });
    }

    setActiveCharArt = (id) => {
        this.setState({ activeCharArt: id });
    }

    shiftLayerZIndex = (form) => {
        window.api.promise('/put/layer/swap', form, (res) => {
            console.log(res);
            this.refreshLayers();
        });
    }

    updateCharName = (form) => {
        window.api.promise('/put/char/name', form, (res) => {
            console.log(res);
            this.props.refreshAll(this.props.charId);
        });
    }

    updateLayerName = (form) => {
        window.api.promise('/put/layer/name', form, (res) => {
            console.log(res);
            this.refreshLayers();
        });
    }

    updateCharArtScale = (form) => {
        window.api.promise('/put/char/layer/scale', form, (res) => {
            console.log(res);
            this.refreshCharArts();
            this.refreshCharacter();
            document.getElementById(`${form.charArtId}-range`).value = form.scale;
            console.log(document.getElementById(`${form.charArtId}-range`).value);
        });
    }

    updateCharArtStartPos = (charArtId, x, y) => {
        console.log(`UPDATING charArt : ${charArtId}`);
        window.api.promise('/put/char/layer/pos', { id: charArtId, posX: x, posY: y }, (res) => {
            console.log(res);
            this.refreshCharArts();
            this.refreshCharacter();
        });
    }

    resetCharArtPosAndScale = (charArtId) => {
        console.log(`RESETTING charArt : ${charArtId}`);
        window.api.promise('/put/char/layer/reset', charArtId, (res) => {
            console.log(res);
            this.refreshCharArts();
        });
    }

    refreshLayers = () => {
        console.log('REFRESHING LAYERS!');
        this.props.refresh(this.props.charId);
    }

    refreshCharArts = () => {
        console.log('REFRESHING CHARARTS!');
        this.props.getArticles(this.props.charId);
    }

    refreshCharacter = () => {
        this.props.getChar(this.props.charId);
    }

    deleteCharArtById = (charArtId) => {
        window.api.promise('/delete/article/char/layer', charArtId, (res) => {
            console.log(res);
            this.refreshCharArts();
            this.refreshCharacter();
        });
    }

    render() {
        return this.props.layers ?
            (
                <Aux>
                    {
                        <div className="canvas-interface" id="canvas-interface">
                            {
                                !this.state.editing &&
                                <h2 onDoubleClick={() => {
                                    this.setState({ editing: true });
                                }}>{this.props.char.name}</h2>
                            }{
                                this.state.editing &&
                                <input type="text"
                                    style={{ display: 'block', margin: '0px auto' }}
                                    id={`${this.props.charId}-edit`}
                                    placeholder={this.props.char.name}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            console.log(document.getElementById(`${this.props.charId}-edit`).value);
                                            this.updateCharName({
                                                id: this.props.charId,
                                                name: document.getElementById(`${this.props.charId}-edit`).value
                                            });
                                            this.setState({ editing: false });
                                        }
                                    }}
                                />
                            }
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
                                                                        zIndex={layer.zIndex}
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
                                                                        zIndex={layer.zIndex}
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
                                                                        zIndex={layer.zIndex}
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
                                <div className="layers-controls">
                                    <p>Lock Layers</p>
                                    <input type="checkbox" className="drag-toggle" id="character-edit-toggle" onChange={() => {
                                        // console.log(document.getElementById('character-edit-toggle').checked);
                                        this.setState({ dragState: this.state.dragState === true ? 'disabled' : true });
                                    }} defaultChecked />
                                    <button onClick={() => {
                                        this.props.newLayer({
                                            // name: `Layer`,
                                            zIndex: 100,
                                            charId: this.props.charId
                                        });
                                    }}>Add Layer</button>
                                </div>
                                <div className="layer-scroll">
                                    {
                                        this.props.layers.length > 0 &&
                                        this.props.layers.map((layer, idx) => {
                                            return (
                                                <Aux key={layer.id}>
                                                    <div className="layer-section">
                                                        {/* <p>{`Layer [${layer.zIndex}]`}</p> */}
                                                        {/* <p>{layer.name}</p> */}
                                                        {
                                                            this.state.editLayer !== layer.id &&
                                                            <p onDoubleClick={() => {
                                                                this.setState({ editLayer: layer.id });
                                                            }}>{layer.name}</p>
                                                        }
                                                        {
                                                            this.state.editLayer === layer.id &&
                                                            <Aux>
                                                                <input type="text" id={`${layer.id}-name`} defaultValue={layer.name} />
                                                                <button onClick={() => {
                                                                    console.log(document.getElementById(`${layer.id}-name`).value);
                                                                    this.updateLayerName({ id: layer.id, name: document.getElementById(`${layer.id}-name`).value });
                                                                    this.setState({ editLayer: null });
                                                                }}>Rename</button>
                                                            </Aux>
                                                        }
                                                        <button onClick={() => {
                                                            this.props.delete(layer.id);
                                                        }}>Delete Layer</button>
                                                        <hr />
                                                        <button onClick={() => {
                                                            console.log('test');
                                                            this.shiftLayerZIndex({ targetLayerId: layer.id, shiftValue: 1 });
                                                        }}>Up</button>
                                                        <button onClick={() => {
                                                            this.shiftLayerZIndex({ targetLayerId: layer.id, shiftValue: -1 });
                                                        }}>Down</button>
                                                        {
                                                            // this.state.assigningLayer === false &&
                                                            <button onClick={() => {
                                                                this.setState({ assigningLayer: true, activeLayerData: { layerId: layer.id, charId: this.props.charId } });
                                                            }}>Add Article</button>
                                                        }
                                                        {/* <p>{`${num}.) ${layer.name} | zIndex: ${layer.zIndex}`}</p> */}
                                                        {
                                                            this.props.charArts.map((charArt, idx) => {
                                                                return charArt.layer === layer.id ? (
                                                                    <Aux key={charArt.id}>
                                                                        <AssignedArticleList
                                                                            charArt={charArt}
                                                                            getArticle={this.props.getArticle}
                                                                            dragMode={false}
                                                                            // ARTICLE SCALE
                                                                            getArticles={this.props.getArticles}
                                                                            master={this.props.master}
                                                                            setActive={this.setActiveCharArt}
                                                                        />
                                                                        {
                                                                            this.state.dragState === 'disabled' &&
                                                                            <Aux>
                                                                                <button onClick={() => {
                                                                                    this.updateCharArtScale({
                                                                                        charArtId: charArt.id,
                                                                                        scale: 15
                                                                                    });
                                                                                }}>Reset Scale</button>
                                                                                <button onClick={() => {
                                                                                    this.updateCharArtStartPos(charArt.id, 2, 350);
                                                                                }}>Re-Center</button>
                                                                            </Aux>
                                                                        }
                                                                        <p>
                                                                            {`Scale: ${charArt.scale}`}
                                                                        </p>
                                                                        <input type="range" id={`${charArt.id}-range`} defaultValue={charArt.scale}
                                                                            onMouseUp={() => {
                                                                                console.log(`charArt[${charArt.id}] scale value: ${document.getElementById(`${charArt.id}-range`).value}`);
                                                                                this.updateCharArtScale({
                                                                                    charArtId: charArt.id,
                                                                                    scale: document.getElementById(`${charArt.id}-range`).value
                                                                                });
                                                                            }} />
                                                                        <button onClick={() => {
                                                                            this.deleteCharArtById(charArt.id);
                                                                        }}>Unassign Article</button>
                                                                    </Aux>
                                                                ) : (
                                                                        null
                                                                    )
                                                            })
                                                        }
                                                    </div>
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