import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import ArticleForm from '../articleForm/articleForm';
import ArticleBrowse from '../articleBrowse/articleBrowse';
import CharacterBrowse from '../characterBrowse/characterBrowse';
import CharacterForm from '../characterForm/characterForm';
import './viewCompendium.css'

class viewCompendium extends Component {

    state = {
        editing: false
    }

    refreshForms = () => {
        this.props.setActiveImg(null);
        this.props.setImgBrowse(false);
    }

    updateCompName = (form) => {
        window.api.promise('/put/comp/name', form, (res) => {
            console.log(res);
        });
    }

    render() {
        return this.props.comp ? (
            <Aux>
                {
                    !this.state.editing &&
                    <h2 onDoubleClick={() => {
                        this.setState({ editing: true });
                    }}>{this.props.comp.name}</h2>
                }
                {
                    this.state.editing &&
                    <Aux>
                        <input
                            type="text"
                            id={`${this.props.comp.id}-edit`}
                            placeholder={this.props.comp.name}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    console.log(document.getElementById(`${this.props.comp.id}-edit`).value);
                                    this.updateCompName({
                                        id: this.props.comp.id,
                                        name: document.getElementById(`${this.props.comp.id}-edit`).value
                                    });
                                    this.props.refresh(this.props.comp.id);
                                    this.setState({ editing: false });
                                }
                            }}
                        />
                        <hr />
                    </Aux>
                }
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
                    delete={this.props.deleteChar}
                />
                <ArticleBrowse
                    articles={this.props.compArts}
                    getArticle={this.props.getArticle}
                    master={this.props.master}
                    browseMode={this.props.browseMode}
                    delete={this.props.deleteArticle}
                />
            </Aux>
        ) : null;
    }
};

export default viewCompendium;