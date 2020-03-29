import React, { Component } from 'react';
import MediaQuery from 'react-responsive'
import Aux from '../../hoc/Auxi';
import ArticleList from '../articleList/articleList';
import AssignedArticleList from '../assignedArticleList/assignedArticleList';
import './layerList.css';
import up from './up.svg';
import down from './down.svg';

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
                                <h2 className="character-title" onDoubleClick={() => {
                                    this.setState({ editing: true });
                                }}>{this.props.char.name}</h2>
                            }{
                                this.state.editing &&
                                <Aux>
                                    <div className="character-rename">
                                        <input type="text"
                                            id={`${this.props.charId}-edit`}
                                            defaultValue={this.props.char.name}
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
                                        <h4 className="rename-cancel" onClick={() => {
                                            this.setState({ editing: false });
                                        }}>Cancel</h4>
                                        <h4 className="rename-confirm" onClick={() => {
                                            if(/\S/.test(document.getElementById(`${this.props.charId}-edit`).value)){
                                                console.log(document.getElementById(`${this.props.charId}-edit`).value);
                                                this.updateCharName({
                                                    id: this.props.charId,
                                                    name: document.getElementById(`${this.props.charId}-edit`).value
                                                });
                                                this.setState({ editing: false });
                                            }
                                        }}>Rename</h4>
                                    </div>
                                    <div className="backdrop"></div>
                                </Aux>
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
                                                                        dragScale={.94}
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
                                                                        dragScale={0.55}
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
                                <div className="layers-controls">
                                    <div className="layer-locker">
                                        <h2>Lock Layers</h2>
                                        <label className="switch">
                                            <input className="layer-lock" type="checkbox" id="character-edit-toggle" onChange={() => {
                                                this.setState({ dragState: this.state.dragState === true ? 'disabled' : true });
                                            }} defaultChecked />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                    <h4 className="layer-control" onClick={() => {
                                        this.props.newLayer({
                                            zIndex: 100,
                                            charId: this.props.charId
                                        });
                                    }}>Add Layer</h4>
                                </div>
                                <div className="layer-scroll">
                                    {
                                        this.props.layers.length > 0 &&
                                        this.props.layers.map((layer, idx) => {
                                            return (
                                                <Aux key={layer.id}>
                                                    <div className="layer-section">
                                                        <div className="layer-control-section">
                                                            {
                                                                this.state.editLayer !== layer.id &&
                                                                <p className="layer-title" onDoubleClick={() => {
                                                                    this.setState({ editLayer: layer.id });
                                                                }}>{layer.name}</p>
                                                            }
                                                            {
                                                                this.state.editLayer === layer.id &&
                                                                <Aux>
                                                                    <div className="layer-edit-controls">
                                                                        <input className="layer-edit" type="text" id={`${layer.id}-name`} defaultValue={layer.name}
                                                                            onKeyPress={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    this.updateLayerName({ id: layer.id, name: document.getElementById(`${layer.id}-name`).value });
                                                                                    this.setState({ editLayer: null });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <h5 className="rename-confirm rename-charart charart-control" onClick={() => {
                                                                            console.log(document.getElementById(`${layer.id}-name`).value);
                                                                            if(/\S/.test(document.getElementById(`${layer.id}-name`).value)){
                                                                                this.updateLayerName({ id: layer.id, name: document.getElementById(`${layer.id}-name`).value });
                                                                                this.setState({ editLayer: null });
                                                                            }
                                                                        }}>Rename</h5>
                                                                        <h5 className="rename-cancel rename-charart charart-control" onClick={() => {
                                                                            this.setState({ editLayer: null });
                                                                        }}>Cancel</h5>
                                                                    </div>
                                                                </Aux>
                                                            }
                                                            <div className="character-z-controls">
                                                                <img onClick={() => {
                                                                    this.shiftLayerZIndex({ targetLayerId: layer.id, shiftValue: 1 });
                                                                }} className="charart-z-button z-up" src={up} alt=""/>
                                                                <img onClick={() => {
                                                                    this.shiftLayerZIndex({ targetLayerId: layer.id, shiftValue: -1 });
                                                                }} className="charart-z-button z-down" src={down} alt=""/>
                                                            </div>
                                                            {
                                                                <h5 className="layer-control" onClick={() => {
                                                                    this.setState({ assigningLayer: true, activeLayerData: { layerId: layer.id, charId: this.props.charId, name: layer.name } });
                                                                }}>Add Article</h5>
                                                            }
                                                        </div>
                                                        {
                                                            this.props.charArts.map((charArt, idx) => {
                                                                return charArt.layer === layer.id ? (
                                                                    <Aux key={charArt.id}>
                                                                        <div className="charart-section">
                                                                            <div className="assigned-article">
                                                                                <AssignedArticleList
                                                                                    charArt={charArt}
                                                                                    getArticle={this.props.getArticle}
                                                                                    dragMode={false}
                                                                                    getArticles={this.props.getArticles}
                                                                                    master={this.props.master}
                                                                                    setActive={this.setActiveCharArt}
                                                                                />
                                                                            </div>
                                                                            {
                                                                                this.state.dragState === 'disabled' &&
                                                                                <Aux>
                                                                                    <div>
                                                                                        <h5 className="layer-control" onClick={() => {
                                                                                            this.updateCharArtScale({
                                                                                                charArtId: charArt.id,
                                                                                                scale: 15
                                                                                            });
                                                                                        }}>Reset Scale</h5>
                                                                                        <h5 className="layer-control" onClick={() => {
                                                                                            this.updateCharArtStartPos(charArt.id, 2, 350);
                                                                                        }}>Re-Center</h5>
                                                                                    </div>
                                                                                </Aux>
                                                                            }
                                                                            <p>
                                                                                {`Scale: ${charArt.scale}`}
                                                                            </p>
                                                                            <div className="slidecontainer">
                                                                                <input className="z-slider" type="range" id={`${charArt.id}-range`} defaultValue={charArt.scale}
                                                                                    onMouseUp={() => {
                                                                                        console.log(`charArt[${charArt.id}] scale value: ${document.getElementById(`${charArt.id}-range`).value}`);
                                                                                        this.updateCharArtScale({
                                                                                            charArtId: charArt.id,
                                                                                            scale: document.getElementById(`${charArt.id}-range`).value
                                                                                        });
                                                                                    }} />
                                                                            </div>
                                                                            <h5 className="layer-control layer-delete" onClick={() => {
                                                                                this.deleteCharArtById(charArt.id);
                                                                            }}>Unassign Article</h5>
                                                                        </div>
                                                                    </Aux>
                                                                ) : (
                                                                        null
                                                                    )
                                                            })
                                                        }
                                                        <div className="delete-section">
                                                            <h5 className="layer-control layer-delete" onClick={() => {
                                                                this.props.delete(layer.id);
                                                            }}>Delete Layer</h5>
                                                        </div>
                                                    </div>
                                                </Aux>
                                            )
                                        })
                                    }
                                    {
                                        !this.props.layers.length > 0 &&
                                        <h4>
                                            No layers yet!
                                        </h4>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    {
                        this.state.assigningLayer === true &&
                        <Aux>
                            <div className="article-modal">
                                <h2>Assigning article to layer {`[${this.state.activeLayerData.name}]`}</h2>
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