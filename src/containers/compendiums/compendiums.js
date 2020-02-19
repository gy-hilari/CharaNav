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
        browseMode: 'char'
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
        console.log(path);
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

    render() {
        if (this.state.scene === 'comps') {
            return (
                <Aux>
                    <button onClick={() => {console.log(new Date(Date.now()).toISOString())}}>Date Test</button>
                    <input type="text" id="create-comp-name"/>
                    <button onClick={() => this.createComp({ name: document.getElementById('create-comp-name').value })}>CREATE COMPENDIUM</button>
                    <hr />
                    <CompendiumList
                        comps={this.state.comps}
                        getComp={this.getComp}
                        getChars={this.getCompChars}
                        getArticles={this.getCompArticles}
                        clearChar={this.clearActiveChar}
                    />
                </Aux>
            );
        }
        if (this.state.scene === 'comp') {
            return (
                <Aux>
                    <button onClick={() => {
                        this.setState({ activeImageSelect: null });
                        this.setState({ imgBrowse: false });
                        this.setState({ scene: 'comps' });
                    }}>Go Back</button>
                    <hr />
                    <ViewCompendium
                        newChar={this.createChar}
                        newArticle={this.createArticle}
                        getLayers={this.getCharLayers}
                        comp={this.state.activeComp}
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

                        compArts={this.state.compArts}
                        getArticle={this.getArticle}
                        master={this.state.imgDir.master}
                    />
                </Aux>
            );
        }
        if (this.state.scene === 'char') {
            return (
                <Aux>
                    <div className="nav-ui">
                        <button onClick={() => {
                            this.clearActiveChar();
                            this.setState({ scene: 'comp' });
                        }}>Back to Compendium</button>
                    </div>
                    <LayerList
                        articles={this.state.compArts}
                        layers={this.state.charLayers}
                        newLayer={this.createLayer}
                        charId={this.state.activeChar.id}
                        charArts={this.state.charArts}
                        assign={this.assignArticleToChar}
                        getArticles={this.getCharArticles}
                        getArticle={this.getArticle}
                        master={this.state.imgDir.master}
                    />
                </Aux>
            )
        }
        if (this.state.scene === 'article-browse') {
            return (
                <Aux>
                    <button onClick={() => {
                        this.clearActiveChar();
                        this.setState({ scene: 'comp' });
                    }}>Back to Compendium</button>
                    {
                        this.state.activeChar &&
                        <button onClick={() => { this.setState({ scene: 'char' }); }}>
                            Back to Character
                        </button>
                    }
                    <hr />
                    <ArticleBrowse
                        articles={this.state.compArts}
                        getArticle={this.getArticle}
                        master={this.state.imgDir.master}
                    />
                </Aux>
            )
        }
        if (this.state.scene === 'article') {
            return (
                <Aux>
                    <button onClick={() => {
                        this.clearActiveChar();
                        this.setState({ scene: 'comp' });
                    }}>Back to Compendium</button>
                    {
                        this.state.activeChar &&
                        <button onClick={() => { this.setState({ scene: 'char' }); }}>
                            Back to Character
                        </button>
                    }
                    <hr />
                    <ViewArticle
                        article={this.state.activeArticle}
                        master={this.state.imgDir.master}
                    />
                </Aux>
            )
        }
    };
}

export default Compendiums;