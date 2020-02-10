import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import CompendiumList from '../../components/compendiumList/compendiumList'
// import ArticleFilter from '../../components/articleFilter/articleFilter'


class Compendiums extends Component {
    state = {
        comps: [],
        compChars: {},
        articles: [],
        charArticles: {},
        // artTags: [],
        // articlesByTag: {},
        // articleFilter: '',
        bool: false
    };

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.comps !== nextState.comps;
    // }

    componentDidMount() {
        this.getComps();
        this.getSortedChars();
        // this.getArticles();
        // this.getSortedArticles();
        // this.getArticleTags();
        // this.getArticlesByTag();
        // this.filterArticle();
        // this.filterArticle(document.getElementById('filter-articles').value);
    }

    getComps = () => {
        window.api.promise('/get/comp', { message: "Querying Compendiums..." }, (res) => {
            this.setState({ comps: res });
        });
    }

    getComp = (id) => {
        console.log('Getting Comp!');
        window.api.promise('/get/comp/id', id, (res) => {
            console.log(res);
        });
    }

    createComp = (form) => {
        window.api.promise('/post/comp', form, (res) => {
            this.setState({ comps: res });
        });
    }

    getSortedChars = () => {
        window.api.promise('/get/comp/char', {}, (res) => {
            this.setState({ compChars: res });
            console.log(res);
        });
    }

    getChar = (id) => {
        console.log('Getting Char!');
        window.api.promise('/get/char/id', id, (res) => {
            console.log(res);
        });
    }

    createChar = (form) => {
        console.log(form);
        window.api.promise('/post/char', form, (res) => {
            console.log(res);
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
        return (
            <Aux>
                <button onClick={() => this.createComp({ name: 'Test' })}>CREATE COMPENDIUM</button>
                {/* <img src={process.env.PUBLIC_URL + '/logo192.png'} alt=""/> */}
                <hr />
                {
                    //#region OLD ARTICLE / TAG TESTS
                    /* <button onClick={() => { this.createArticle({ name: 'Article Test' }) }}>Create Article</button>
                    <form onSubmit={() => {
                        this.assignArticleTag({
                            articleId: document.getElementById(`assignArtTag-Article`).value,
                            artTagId: document.getElementById(`assignArtTag-Tag`).value
                        })
                    }}>
                        <select id={`assignArtTag-Article`}>
                            {
                                this.state.articles.map((article) => {
                                    return (
                                        <option key={`del+${article.id}`} value={article.id}>{article.id}</option>
                                    )
                                })
                            }
                        </select>
                        <select id={`assignArtTag-Tag`}>
                            {
                                this.state.artTags.map((tg) => {
                                    return (
                                        <option key={`del+${tg.id}`} value={tg.id}>{tg.id}</option>
                                    )
                                })
                            }
                        </select>
    
                        <input type="submit" value="Tag Article" />
                    </form>
                    <button>Delete Article:</button>
                    <select>
                        {
                            this.state.articles.map((article) => {
                                return (
                                    <option key={`del+${article.id}`} value={article.id}>{article.id}</option>
                                )
                            })
                        }
                    </select>
                    <p onClick={() => { this.filterArticle(document.getElementById('filter-articles').value)}}>Filter Articles:</p>
                    <select id='filter-articles' onChange={() => { this.filterArticle(document.getElementById('filter-articles').value) }}>
                        {
                            this.state.artTags.map((tg) => {
                                return (
                                    <option key={`del+${tg.id}`} value={tg.id}>{tg.id}</option>
                                )
                            })
                        }
                    </select>
                    <ArticleFilter
                        articlesByTag={this.state.articlesByTag}
                        articleFilter={this.state.articleFilter}
                    />
                    <input type="text" />
                    <button onClick={() => { this.createArticleTag({ name: 'Tag Test' }) }}>Create Article Tag</button>
                    <p>Manage Article Tags:</p>
                    <select>
                        {
                            this.state.artTags.map((tg) => {
                                return (
                                    <option key={`del+${tg.id}`} value={tg.id}>{tg.id}</option>
                                )
                            })
                        }
                    </select>
                    <button>Delete Tag</button> */
                    //#endregion
                }
                <CompendiumList
                    comps={this.state.comps}
                    compChars={this.state.compChars}
                    getComp={this.getComp}
                    newChar={this.createChar}
                    getChar={this.getChar}
                    articles={this.state.articles}
                    assignArticle={this.assignArticle}
                    charArticles={this.state.charArticles}
                />
            </Aux>
        );
    };
}

export default Compendiums;