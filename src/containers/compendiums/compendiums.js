import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import CompendiumList from '../../components/compendiumList/compendiumList'
import CharacterList from '../../components/characterList/characterList';
import LayerList from '../../components/layerList/layerList';
import ArticleBrowse from '../../components/articleBrowse/articleBrowse';
import ImageReciever from '../../components/imageReciever/imageReciever';

class Compendiums extends Component {
    state = {
        scene: 'comps',
        activeComp: {},
        activeChar: {},
        comps: [],
        compChars: {},
        compArts: {},
        charLayers: {},
        charArts: {},
        imgDir: null,
        imgBrowse: false,
        activeImageSelect: null
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

    toggleImageDirBrowser = () => {
        this.setState({ imgBrowse: !this.state.imgBrowse });
    }

    setActiveImageSelect = (path) => {
        console.log(path);
        this.setState({ activeImageSelect: { path: path, class: 'fit' } });
    }

    // getImageData = (dir) => {
    //     console.log(dir);
    //     let imgData = {};
    //     imgData['path'] = dir;
    //     let img = new Image();
    //     img.src = dir;
    //     img.onload = () => {
    //         console.log(`Image width: ${img.width}`);
    //         console.log(`Image height: ${img.height}`);
    //         if (img.width === img.height) {
    //             imgData['class'] = 'square';
    //         }
    //         if (img.width > img.height) {
    //             imgData['class'] = 'landscape';
    //         }
    //         if (img.width < img.height) {
    //             imgData['class'] = 'portrait';
    //         }
    //         this.setState({ activeImageSelect: imgData });
    //     }
    // }

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
            console.log(res);
            this.setState({ charArts: res });
        });
    }

    setScene = (sceneName) => {
        this.setState({ scene: sceneName })
    }

    render() {
        if (this.state.scene === 'comps') {
            return (
                <Aux>
                    <button onClick={() => this.createComp({ name: 'Test' })}>CREATE COMPENDIUM</button>
                    <hr />
                    <CompendiumList
                        comps={this.state.comps}
                        getComp={this.getComp}
                        getChars={this.getCompChars}
                        getArticles={this.getCompArticles}
                    />
                </Aux>
            );
        }
        if (this.state.scene === 'comp') {
            return (
                <Aux>
                    <button onClick={() => {
                        this.setState({imgBrowse: false});
                        this.setState({ scene: 'comps' });
                    }}>Go Back</button>
                    <hr />
                    <CharacterList
                        newChar={this.createChar}
                        newArticle={this.createArticle}
                        getLayers={this.getCharLayers}
                        compId={this.state.activeComp.id}
                        chars={this.state.compChars}
                        getChar={this.getChar}
                        getArticles={this.getCharArticles}
                        setScene={this.setScene}
                        imgDir={this.state.imgDir}
                        toggleImgBrowse={this.toggleImageDirBrowser}
                        imgBrowse={this.state.imgBrowse}
                        activeImg={this.state.activeImageSelect}
                        setActiveImg={this.setActiveImageSelect}
                        refreshDir={this.getImageDir}
                    />
                </Aux>
            );
        }
        if (this.state.scene === 'char') {
            return (
                <Aux>
                    <button onClick={() => { this.setState({ scene: 'comp' }) }}>Go Back</button>
                    <hr />
                    <LayerList
                        articles={this.state.compArts}
                        layers={this.state.charLayers}
                        newLayer={this.createLayer}
                        charId={this.state.activeChar.id}
                        charArts={this.state.charArts}
                        assign={this.assignArticleToChar}
                        getArticles={this.getCharArticles}
                    />
                </Aux>
            )
        }
        if (this.state.scene === 'article') {
            return (
                <Aux>
                    <button onClick={() => { this.setState({ scene: 'comp' }) }}>Go Back</button>
                    <hr />
                    <ArticleBrowse
                        articles={this.state.compArts}
                    />
                </Aux>
            )
        }
    };
}

export default Compendiums;