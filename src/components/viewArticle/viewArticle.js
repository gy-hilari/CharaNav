import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';
import ArticleImageSelector from '../articleImageSelector/articleImageSelector';
import './viewArticle.css';

class ViewArticle extends Component {
    state = {
        editName: false,
        editDesc: false,
        editImg: false,
        activeImg: null
    }

    updateArticleName = (form) => {
        window.api.promise('/put/article/name', form, (res) => {
            console.log(res);
            this.props.refresh(this.props.article.id);
        });
    }

    updateArticleText = (form) => {
        window.api.promise('/put/article/text', form, (res) => {
            console.log(res);
            this.props.refresh(this.props.article.id);
        });
    }

    updateArticleImage = (form) => {
        window.api.promise('/put/article/image', form, (res) => {
            console.log(res);
            this.props.refresh(this.props.article.id);
        });
    }

    render() {
        return (
            <Aux>
                <div className="liner"></div>
                {
                    !this.state.editName &&
                    <h2 className="article-title renamable" onDoubleClick={() => {
                        this.setState({ editName: true });
                    }}>
                        {this.props.article.name}
                    </h2>
                }
                {
                    this.state.editName &&
                    <Aux>
                        <div className="article-rename">
                            <input type="text"
                                id={`${this.props.article.id}-edit-name`}
                                placeholder={this.props.article.name}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        console.log(document.getElementById(`${this.props.article.id}-edit-name`).value);
                                        this.updateArticleName({
                                            id: this.props.article.id,
                                            name: document.getElementById(`${this.props.article.id}-edit-name`).value
                                        });
                                        this.setState({ editName: false });
                                    }
                                }}
                            />
                            <h4 className="rename-cancel" onClick={() => {
                                this.setState({ editName: false });
                            }}>Cancel</h4>
                            <h4 className="rename-confirm" onClick={() => {
                                console.log(document.getElementById(`${this.props.article.id}-edit-name`).value);
                                this.updateArticleName({
                                    id: this.props.article.id,
                                    name: document.getElementById(`${this.props.article.id}-edit-name`).value
                                });
                                this.setState({ editName: false });
                            }}>Rename</h4>
                        </div>
                        <div className="backdrop"></div>
                    </Aux>
                }
                <div className="article-image-wrap"
                >
                    <ImageReciever
                        image={{ path: this.props.article.imagePath, class: 'fit-wide hover', wrapSize: 'full', master: this.props.master }}
                        click={() => {
                            console.log(`Editing image of article [${this.props.article.name}]`);
                            this.setState({ editImg: true });
                        }}
                    />
                </div>
                {
                    this.state.editImg &&
                    <Aux>
                        <div className="article-image-edit">
                            <h2 className="article-form-title">Editing Image of {`[${this.props.article.name}]`}</h2>
                            <ImageReciever image={this.state.activeImg} />
                            <div className="article-image-scroller">
                                {
                                    Object.keys(this.props.directories).map((dir, idx) => {
                                        return (
                                            <ArticleImageSelector
                                                key={`${this.props.master}-elm-${idx}`}
                                                master={this.props.master}
                                                dirName={dir}
                                                imgDir={this.props.directories[dir]}
                                                display={true}
                                                setActiveImg={(path) => {
                                                    console.log(`New image path for article [${this.props.article.name}]: ${path}`);
                                                    this.setState({
                                                        activeImg: {
                                                            master: this.props.master,
                                                            path: path,
                                                            class: 'fit',
                                                            wrapSize: 'small'
                                                        }
                                                    });
                                                }}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <h2
                                className="art-form-button art-form-confirm"
                                onClick={() => {
                                    this.setState({ activeImg: null, editImg: false });
                                    if (this.state.activeImg) {
                                        this.updateArticleImage({
                                            id: this.props.article.id,
                                            path: this.state.activeImg.path
                                        });
                                    }
                                }}>Confirm</h2>
                            <h2
                                className="art-form-button art-form-cancel"
                                onClick={() => {
                                    this.setState({ activeImg: null, editImg: false });
                                }}>Cancel</h2>
                        </div>
                        <div className="backdrop"></div>
                    </Aux>
                }
                {
                    !this.state.editDesc &&
                    <Aux>
                        <div className="article-text">
                            <p onDoubleClick={() => {
                                this.setState({ editDesc: true });
                            }}>
                                {this.props.article.text}
                            </p>
                        </div>
                    </Aux>
                }
                {
                    this.state.editDesc &&
                    <Aux>
                        <div className="article-retype-section">
                            <textarea type="text"
                                className="article-retype"
                                id={`${this.props.article.id}-edit-desc`}
                                defaultValue={this.props.article.text}
                                cols="30"
                                rows="10"
                            ></textarea>
                            <div className="article-retype-ui">
                                <h4 className="rename-cancel" onClick={() => {
                                    this.setState({ editDesc: false });
                                }}>Cancel</h4>
                                <h4 className="rename-confirm" onClick={() => {                                    
                                    if(/\S/.test(document.getElementById(`${this.props.article.id}-edit-desc`).value)){
                                        this.updateArticleText({
                                            id: this.props.article.id,
                                            text: document.getElementById(`${this.props.article.id}-edit-desc`).value
                                        });
                                        this.setState({ editDesc: false });
                                    }
                                }}>Submit</h4>
                            </div>
                        </div>
                        <div className="backdrop"></div>
                    </Aux>
                }
            </Aux>
        );
    }
};

export default ViewArticle;