import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import ArticleForm from '../articleForm/articleForm';
import ArticleBrowse from '../articleBrowse/articleBrowse';
import CharacterBrowse from '../characterBrowse/characterBrowse';
import CharacterForm from '../characterForm/characterForm';
import './viewCompendium.css'

class viewCompendium extends Component {

    refreshForms = () => {
        this.props.setActiveImg(null);
        this.props.setImgBrowse(false);
    }
    render() {
        return this.props.comp ? (
            <Aux>
                <p>Showing character list of {`[${this.props.comp.name}]`}!</p>
                <button onClick={() => {
                    this.refreshForms();
                    // this.props.setScene('character-browse');
                    this.props.setFormMode('null');
                    this.props.setBrowseMode('char');
                }}>
                    Browse Characters
                    </button>
                <button onClick={() => {
                    this.refreshForms();
                    // this.props.setScene('article-browse');
                    this.props.setFormMode('null');
                    this.props.setBrowseMode('article');
                }}>
                    Browse Articles
                    </button>
                <hr />
                {
                    this.props.browseMode === 'char' &&
                    <Aux>
                        {
                            this.props.formMode === 'char' ? null :
                                <Aux>
                                    <button onClick={() => {
                                        this.props.setFormMode('char');
                                    }}>
                                        New Character
                                    </button>
                                    <hr />
                                </Aux>
                        }
                        <CharacterForm
                            formMode={this.props.formMode}
                            compId={this.props.comp.id}
                            newChar={this.props.newChar}
                            setFormMode={this.props.setFormMode}
                        />
                    </Aux>
                }
                {
                    this.props.browseMode === 'article' &&
                    <Aux>
                        {
                            this.props.formMode === 'article' ? null :
                                <Aux>
                                    <button onClick={() => {
                                        this.props.setFormMode('article');
                                    }}>
                                        New Article
                                    </button>
                                    <hr />
                                </Aux>
                        }
                        <ArticleForm
                            newArticle={this.props.newArticle}
                            setImgBrowse={this.props.setImgBrowse}
                            imgBrowse={this.props.imgBrowse}
                            refreshDir={this.props.refreshDir}
                            imgDir={this.props.imgDir}
                            imgBrowse={this.props.imgBrowse}
                            setActiveImg={this.props.setActiveImg}
                            compId={this.props.comp.id}
                            activeImg={this.props.activeImg}
                            formMode={this.props.formMode}
                            setFormMode={this.props.setFormMode}
                            refresh={this.refreshForms}
                        />
                    </Aux>
                }


                <CharacterBrowse
                    chars={this.props.chars}
                    getChar={this.props.getChar}
                    setActiveImg={this.props.setActiveImg}
                    getLayers={this.props.getLayers}
                    getArticles={this.props.getArticles}
                    setImgBrowse={this.props.setImgBrowse}
                    browseMode={this.props.browseMode}
                />
                <ArticleBrowse
                    articles={this.props.compArts}
                    getArticle={this.props.getArticle}
                    master={this.props.master}
                    browseMode={this.props.browseMode}
                />
            </Aux>
        ) : null;
    }
};

export default viewCompendium;