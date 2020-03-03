import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import CompendiumList from '../../components/compendiumList/compendiumList'
import ViewCompendium from '../../components/viewCompendium/viewCompendium';
import LayerList from '../../components/layerList/layerList';
import ArticleBrowse from '../../components/articleBrowse/articleBrowse';
import ViewArticle from '../../components/viewArticle/viewArticle';
import './compendiums.css';

class Compendiums extends Component {
    state = {
        scene: 'comps',
        activeComp: {},
        activeChar: {},
        activeArticle: {},
        comps: [],
        compChars: {},
        compArts: {},
        charLayers: {},
        charArts: {},
        imgDir: null,
        imgBrowse: false,
        activeImageSelect: null,
        formMode: null,
        browseMode: 'char',
        creatingComp: false,
        deleting: false,
        deleteData: null
    };

    componentDidMount() {
        this.getComps();
        this.getImageDir();
    }

    getImageDir = () => {
        window.api.promise('/get/imageDir', { message: "Querying Compendiums..." }, (res) => {
            console.log(res);
            this.setState({ imgDir: res });
        });
    }

    setImageDirBrowser = (bool) => {
        this.setState({ imgBrowse: bool });
    }

    setActiveImageSelect = (path) => {
        if (path) console.log(path);
        this.setState({ activeImageSelect: path ? { path: path, class: 'fit', wrapSize: 'small', master: this.state.imgDir.master } : null });
    }

    getComps = () => {
        window.api.promise('/get/comp', { message: "Getting image dir..." }, (res) => {
            console.log(res);
            this.setState({ comps: res });
        });
    }

    getComp = (id) => {
        console.log('Getting Comp!');
        window.api.promise('/get/comp/id', id, (res) => {
            console.log(res);
            this.setState({ activeComp: res });
            this.setState({ scene: 'comp' });
        });
    }

    createComp = (form) => {
        window.api.promise('/post/comp', form, (res) => {
            this.setState({ comps: res });
        });
    }

    deleteCompById = (compId) => {
        window.api.promise('/delete/comp', compId, (res) => {
            console.log(res);
            this.getComps();
        });
    }

    getCompChars = (compId) => {
        window.api.promise('/get/comp/char', compId, (res) => {
            console.log(res);
            this.setState({ compChars: res });
        });
    }

    getChar = (id) => {
        window.api.promise('/get/char/id', id, (res) => {
            console.log(res);
            this.setState({ activeChar: res });
            this.setState({ scene: 'char' })
        });
    }

    createChar = (form) => {
        window.api.promise('/post/char', form, (res) => {
            console.log(res);
            this.setState({ compChars: res });
        });
    }

    deleteCharById = (charId) => {
        window.api.promise('/delete/char', charId, (res) => {
            console.log(res);
            this.getCompChars(this.state.activeComp.id);
        });
    }

    getCharLayers = (charId) => {
        window.api.promise('/get/char/layer', charId, (res) => {
            console.log(res);
            this.setState({ charLayers: res });
        });
    }

    createLayer = (form) => {
        window.api.promise('/post/layer', form, (res) => {
            console.log(res);
            this.setState({ charLayers: res });
        });
    }

    deleteLayerById = (layerId) => {
        window.api.promise('/delete/layer', layerId, (res) => {
            console.log(res);
            this.getCharLayers(this.state.activeChar.id);
        });
    }

    getArticle = (id) => {
        window.api.promise('/get/article/id', id, (res) => {
            console.log(res);
            this.setState({ activeArticle: res });
            this.setState({ scene: 'article' });
        });
    }

    createArticle = (form) => {
        window.api.promise('/post/article', form, (res) => {
            console.log(res);
            this.setState({ compArts: res });
        });
    }

    deleteArticleById = (artId) => {
        window.api.promise('/delete/article', artId, (res) => {
            console.log(res);
            this.getCompArticles(this.state.activeComp.id);
        });
    }

    getCompArticles = (compId) => {
        window.api.promise('/get/comp/article', compId, (res) => {
            console.log(res);
            this.setState({ compArts: res });
        });
    }

    assignArticleToChar = (form) => {
        window.api.promise('/assign/article/char/layer', form, (res) => {
            console.log(res);
        });
    }

    getCharArticles = (charId) => {
        window.api.promise('/get/char/article', charId, (res) => {
            console.log('CHARACTER ARTICLES:');
            console.log(res);
            this.setState({ charArts: res });
        });
    }

    setScene = (sceneName) => {
        this.setState({ scene: sceneName })
    }

    clearActiveChar = () => {
        this.setState({ activeChar: null });
    }

    setFormMode = (mode) => {
        this.setState({ formMode: mode });
    }

    setBrowseMode = (mode) => {
        this.setState({ browseMode: mode });
    }

    deleteConfirm = (delData) => {
        this.setState({ deleting: true, deleteData: delData });
    }

    render() {
        return (
            <Aux>
                <div className="main-scene">
                    {
                        this.state.deleting &&
                        <Aux>
                            <div className="delete-confirmer">
                                <h2>
                                    Delete <span>"{this.state.deleteData.name}"</span>?
                                </h2>
                                <h4 className="rename-cancel" onClick={() => {
                                    this.setState({ deleting: false });
                                }}>Cancel</h4>
                                <h4 className="rename-confirm" onClick={() => {
                                    if (this.state.deleteData.route === 'comp') {
                                        this.deleteCompById(this.state.deleteData.id);
                                    }
                                    if (this.state.deleteData.route === 'char') {
                                        this.deleteCharById(this.state.deleteData.id);
                                    }
                                    if (this.state.deleteData.route === 'art') {
                                        this.deleteArticleById(this.state.deleteData.id);
                                    }
                                    this.setState({ deleteData: null });
                                    this.setState({ deleting: false });
                                }}>Delete</h4>
                            </div>
                            <div className="backdrop"></div>
                        </Aux>
                    }
                    {
                        this.state.scene === 'comps' &&
                        <Aux>
                            {
                                // !this.state.creatingComp &&
                                // <Aux>
                                //     <button onClick={() => {
                                //         this.setState({ creatingComp: true });
                                //     }}>New Compendium</button>
                                // </Aux>
                            }
                            <h4 className="nav-button" onClick={() => {
                                this.setState({ creatingComp: true });
                            }}>New Compendium</h4>
                            {
                                this.state.creatingComp &&
                                <Aux>
                                    <div className="compendium-form">
                                        <input type="text" id="create-comp-name" placeholder="Compendium Name" />
                                        <h4 className="create-comp-confirm" onClick={() => {
                                            if (document.getElementById('create-comp-name').value.length > 0) {
                                                this.createComp({ name: document.getElementById('create-comp-name').value });
                                                this.setState({ creatingComp: false });
                                            }
                                        }}>Create Compendium</h4>
                                        <h4 className="create-comp-cancel" onClick={() => {
                                            this.setState({ creatingComp: false });
                                        }}>Cancel</h4>
                                    </div>
                                    <div className="backdrop"></div>
                                </Aux>
                            }
                            <div className="buffer"></div>
                            <CompendiumList
                                comps={this.state.comps}
                                getComp={this.getComp}
                                getChars={this.getCompChars}
                                getArticles={this.getCompArticles}
                                clearChar={this.clearActiveChar}
                                delete={this.deleteCompById}
                                deleteConfirm={this.deleteConfirm}
                            />
                        </Aux>
                    }
                    {
                        this.state.scene === 'comp' &&
                        <Aux>
                            <h4 className="nav-button" onClick={() => {
                                this.setState({ activeImageSelect: null });
                                this.setState({ imgBrowse: false });
                                this.setState({ scene: 'comps' });
                                this.setState({ browseMode: 'char' });
                            }}>Go Back</h4>
                            <ViewCompendium
                                newChar={this.createChar}
                                deleteChar={this.deleteCharById}
                                newArticle={this.createArticle}
                                deleteArticle={this.deleteArticleById}
                                getLayers={this.getCharLayers}
                                comp={this.state.activeComp}
                                refresh={(id) => {
                                    this.getComp(id);
                                    this.getComps();
                                }}
                                chars={this.state.compChars}
                                getChar={this.getChar}
                                getArticles={this.getCharArticles}
                                setScene={this.setScene}
                                imgDir={this.state.imgDir}
                                setImgBrowse={this.setImageDirBrowser}
                                imgBrowse={this.state.imgBrowse}
                                activeImg={this.state.activeImageSelect}
                                setActiveImg={this.setActiveImageSelect}
                                refreshDir={this.getImageDir}
                                formMode={this.state.formMode}
                                setFormMode={this.setFormMode}
                                setBrowseMode={this.setBrowseMode}
                                browseMode={this.state.browseMode}

                                deleteConfirm={this.deleteConfirm}

                                compArts={this.state.compArts}
                                getArticle={this.getArticle}
                                master={this.state.imgDir.master}
                            />
                        </Aux>
                    }
                    {
                        this.state.scene === 'char' &&
                        <Aux>
                            <h4 className="nav-button" onClick={() => {
                                this.clearActiveChar();
                                this.setState({ scene: 'comp' });
                            }}>Back to Compendium</h4>
                            <LayerList
                                articles={this.state.compArts}
                                layers={this.state.charLayers}
                                refreshAll={(id) => {
                                    this.getChar(id);
                                    this.getCompChars(this.state.activeComp.id);
                                }}
                                refresh={this.getCharLayers}
                                newLayer={this.createLayer}
                                char={this.state.activeChar}
                                charId={this.state.activeChar.id}
                                charArts={this.state.charArts}
                                assign={this.assignArticleToChar}
                                getArticles={this.getCharArticles}
                                getArticle={this.getArticle}
                                getChar={this.getChar}
                                master={this.state.imgDir.master}
                                delete={this.deleteLayerById}
                            />
                        </Aux>
                    }
                    {
                        this.state.scene === 'article-browse' &&
                        <Aux>
                            <h4 className="nav-button" onClick={() => {
                                this.clearActiveChar();
                                this.setState({ scene: 'comp' });
                            }}>Back to Compendium</h4>
                            {
                                this.state.activeChar &&
                                <h4 className="nav-button" onClick={() => { this.setState({ scene: 'char' }); }}>
                                    Back to Character
                                </h4>
                            }
                            <hr />
                            <ArticleBrowse
                                articles={this.state.compArts}
                                getArticle={this.getArticle}
                                master={this.state.imgDir.master}
                            />
                        </Aux>
                    }
                    {
                        this.state.scene === 'article' &&
                        <Aux>
                            <h4 className="nav-button" onClick={() => {
                                this.clearActiveChar();
                                this.setBrowseMode('article');
                                this.setState({ scene: 'comp' });
                            }}>Back to Compendium</h4>
                            {
                                this.state.activeChar &&
                                <h4 className="nav-button" onClick={() => { this.setState({ scene: 'char' }); }}>
                                    Back to Character
                                </h4>
                            }
                            <ViewArticle
                                article={this.state.activeArticle}
                                master={this.state.imgDir.master}
                                refresh={(id) => {
                                    this.getArticle(id);
                                    this.getCompArticles(this.state.activeComp.id);
                                }}
                            />
                        </Aux>
                    }
                </div>
            </Aux>
        );
    };
}

export default Compendiums;