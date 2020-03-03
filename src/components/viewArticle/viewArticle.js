import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';
import './viewArticle.css';

class ViewArticle extends Component {
    state = {
        editName: false,
        editDesc: false
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
                <div className="article-image-wrap">
                    <ImageReciever
                        image={{ path: this.props.article.imagePath, class: 'fit', wrapSize: 'full', master: this.props.master }}
                    />
                </div>
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
                                // onKeyPress={(e) => {
                                //     if (e.key === 'Enter') {
                                //     }
                                // }}
                                cols="30"
                                rows="10"
                            ></textarea>
                            <div className="article-retype-ui">
                                <h4 className="rename-cancel" onClick={() => {
                                    this.setState({ editDesc: false });
                                }}>Cancel</h4>
                                <h4 className="rename-confirm" onClick={() => {
                                    console.log(document.getElementById(`${this.props.article.id}-edit-desc`).value);
                                    this.updateArticleText({
                                        id: this.props.article.id,
                                        text: document.getElementById(`${this.props.article.id}-edit-desc`).value
                                    });
                                    this.setState({ editDesc: false });
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