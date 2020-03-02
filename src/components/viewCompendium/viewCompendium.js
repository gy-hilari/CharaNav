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
                    <h2 className="comp-title" onDoubleClick={() => {
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
                    </Aux>
                }
                <div>
                    <h4 className="browse-button" onClick={() => {
                        this.refreshForms();
                        // this.props.setScene('character-browse');
                        this.props.setFormMode('null');
                        this.props.setBrowseMode('char');
                    }}>
                        Browse Characters
                        </h4>
                    <h4 className="browse-button" onClick={() => {
                        this.refreshForms();
                        // this.props.setScene('article-browse');
                        this.props.setFormMode('null');
                        this.props.setBrowseMode('article');
                    }}>
                        Browse Articles
                        </h4>
                </div>
                {
                    this.props.browseMode === 'char' &&
                    <Aux>
                        {
                            this.props.formMode === 'char' ?
                                <Aux>
                                    <div className="char-form">
                                        <CharacterForm
                                            formMode={this.props.formMode}
                                            compId={this.props.comp.id}
                                            newChar={this.props.newChar}
                                            setFormMode={this.props.setFormMode}
                                        />
                                    </div>
                                    <div className="backdrop"></div>
                                </Aux>
                                :
                                <Aux>
                                    <div className="form-ui">
                                        <h4 className="form-button" onClick={() => {
                                            this.props.setFormMode('char');
                                        }}>
                                            New Character
                                        </h4>
                                    </div>
                                </Aux>
                        }
                    </Aux>
                }
                {
                    this.props.browseMode === 'article' &&
                    <Aux>
                        <div className="form-ui">
                            {
                                this.props.formMode === 'article' ?
                                    <Aux>
                                        <div className="article-form">
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
                                        </div>
                                        <div className="backdrop"></div>
                                    </Aux>
                                    :
                                    <Aux>
                                        <h4 className="form-button" onClick={() => {
                                            this.props.setFormMode('article');
                                        }}>
                                            New Article
                                        </h4>
                                    </Aux>
                            }
                        </div>
                    </Aux>
                }
                <div className="scroller">
                    <div className="buffer"></div>
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
                </div>
            </Aux>
        ) : null;
    }
};

export default viewCompendium;
