import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import CompendiumList from '../../components/compendiumList/compendiumList'
import CharacterList from '../../components/characterList/characterList';
import LayerList from '../../components/layerList/layerList';

class Compendiums extends Component {
    state = {
        scene: 'comps',
        activeComp: {},
        activeChar: {},
        comps: [],
        compChars: {},
        compArts: {},
        charLayers: {}
        // articles: [],
        // charArticles: {},
        // artTags: [],
        // articlesByTag: {},
        // articleFilter: ''
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.comps !== nextState.comps;
    // }

    componentDidMount() {
        this.getComps();
    }

    getComps = () => {
        window.api.promise('/get/comp', { message: "Querying Compendiums..." }, (res) => {
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

    // getArticles = () => {
    //     window.api.promise('/get/article', { message: "Querying Articles..." }, (res) => {
    //         this.setState({ articles: res });
    //         console.log(this.state.articles);
    //     });
    // }

    createArticle = (form) => {
        window.api.promise('/post/article', form, (res) => {
            console.log(res);
            this.setState({compArts: res});
        });
    }

    getCompArticles = (compId) => {
        window.api.promise('/get/comp/article', compId, (res) => {
            console.log(res);
            this.setState({compArts: res});
        });
    }

    assignArticle = (form) => {
        window.api.promise('/assign/article/char/layer', form, (res) => {
            console.log(res);
        });
    }

    // getSortedArticles = () => {
    //     window.api.promise('/get/char/article', {}, (res) => {
    //         this.setState({ charArticles: res });
    //         console.log(res);
    //     });
    // }

    // getArticleTags = () => {
    //     window.api.promise('/get/artTag', { message: "Querying Article Tags..." }, (res) => {
    //         console.log('Article Tags:');
    //         console.log(res);
    //         this.setState({ artTags: res });
    //     });
    // }

    // getArticlesByTag = () => {
    //     window.api.promise('/get/article/artTag', { message: "Fetching Articles by Tags..." }, (res) => {
    //         console.log('Articles Sorted by Tags:');
    //         console.log(res);
    //         this.setState({ articlesByTag: res });
    //     });
    // }

    // createArticleTag = (form) => {
    //     window.api.promise('/post/artTag', form, (res) => {
    //         console.log(res);
    //     });
    // }

    // assignArticleTag = (form) => {
    //     window.api.promise('/post/article/artTag', form, (res) => {
    //         console.log('Assigned Article Tag:');
    //         console.log(res);
    //     });
    // }

    // filterArticle = (value) => {
    //     console.log('Filtering!');
    //     this.setState({ articleFilter: value });
    //     console.log(this.state.articleFilter);
    // }

    render() {
        if (this.state.scene === 'comps') return (
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
        if (this.state.scene === 'comp') {
            return (
                <Aux>
                    <button onClick={() => { this.setState({ scene: 'comps' }) }}>Go Back</button>
                    <hr />
                    <CharacterList
                        newChar={this.createChar}
                        newArticle={this.createArticle}
                        getLayers={this.getCharLayers}
                        compId={this.state.activeComp.id}
                        chars={this.state.compChars}
                        getChar={this.getChar}
                    />
                </Aux>
            );
        }
        if (this.state.scene === 'char') {
            return (
                <Aux>
                    <button onClick={() => { this.setState({ scene: 'comp' }) }}>Go Back</button>
                    <hr/>
                    <LayerList
                        articles={this.state.compArts}
                        layers={this.state.charLayers}
                        newLayer={this.createLayer}
                        charId={this.state.activeChar.id}
                        assign={this.assignArticle}
                    />
                </Aux>
            )
        }
    };
}

export default Compendiums;