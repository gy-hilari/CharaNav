import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import CompendiumList from '../../components/compendiumList/compendiumList'
import CharacterList from '../../components/characterList/characterList';
// import ArticleFilter from '../../components/articleFilter/articleFilter'


class Compendiums extends Component {
    state = {
        scene: 'comps',
        activeComp: {},
        comps: [],
        compChars: {},
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
        });
    }

    createChar = (form) => {
        console.log(form);
        window.api.promise('/post/char', form, (res) => {
            console.log(res);
            this.setState({ compChars: res });
        });
    }

    // getArticles = () => {
    //     window.api.promise('/get/article', { message: "Querying Articles..." }, (res) => {
    //         this.setState({ articles: res });
    //         console.log(this.state.articles);
    //     });
    // }

    // createArticle = (form) => {
    //     window.api.promise('/post/article', form, (res) => {
    //         console.log(res);
    //     });
    // }

    // assignArticle = (form) => {
    //     window.api.promise('/assign/article/char', form, (res) => {
    //         console.log(res);
    //     });
    // }

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
                        compId={this.state.activeComp.id}
                        chars={this.state.compChars}
                        getChar={this.getChar}
                    />
                </Aux>
            );            
        }
    };
}

export default Compendiums;