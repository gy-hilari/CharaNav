import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';
import './assignedArticleList.css';
import imageError from '../../imageError.png';

class AssignedArticleList extends Component {
    state = {
        articlePath: null,
        dragClass: ''
    }

    componentDidMount() {
        if (this.props.charArt) {
            this.getArticle(this.props.charArt.article);
        }
    }

    getArticle = (id) => {
        window.api.promise('/get/article/id', id, (res) => {
            console.log('ASSIGNED ARTICLE:');
            console.log(res.imagePath);
            this.setState({ articlePath: res.imagePath });
        });
    }

    putArticleStartPos = (charArtId, x, y) => {
        console.log(`UPDATING charArt : ${charArtId}`);
        window.api.promise('/put/char/layer/pos', { id: charArtId, posX: x, posY: y }, (res) => {
            console.log(res);
        });
    }

    render() {
        return !this.props.charArt ? (
            <Aux>
                <p>
                    Error -- missing article prop
                </p>
            </Aux>
        )
            :
            (
                <Aux>
                    {
                        this.props.dragMode === true && this.state.articlePath && this.props.activeCharArt === this.props.charArt.id &&
                        <Draggable
                            scale={this.props.dragScale}
                            defaultPosition={{ x: parseInt(this.props.posX), y: parseInt(this.props.posY) }}
                            onStart={() => { this.setState({ dragClass: 'dragging' }); }}
                            onStop={() => {
                                this.setState({ dragClass: '' }); console.log('Finished Dragging!');
                                let regex = /[+-]?\d+(\.\d+)?/g;
                                let cssTarget = document.getElementById(this.props.charArt.id).style.transform;
                                let floats = cssTarget.match(regex).map((num) => {
                                    return parseFloat(num);
                                })
                                console.log(floats);
                                this.putArticleStartPos(this.props.charArt.id, floats[0], floats[1]);
                                this.props.getArticles(this.props.charArt.character);
                            }}
                        >
                            <img 
                                onError={(e) => {
                                    e.target.src = imageError;
                                }}
                                style={{
                                    zIndex: `${this.props.zIndex}`,
                                    height: `${this.props.charArt.scale}%`
                                }}
                                onContextMenu={() => { this.props.getArticle(this.props.charArt.article) }} className={`layer-article draggable dragging`} id={this.props.charArt.id} src={`${this.props.master}${this.state.articlePath}`} alt="" />
                        </Draggable>
                    }
                    {
                        this.props.dragMode === true && this.state.articlePath && this.props.activeCharArt !== this.props.charArt.id &&
                        <Draggable
                            scale={this.props.dragScale}
                            defaultPosition={{ x: parseInt(this.props.posX), y: parseInt(this.props.posY) }}
                            onStart={() => { this.setState({ dragClass: 'dragging' }); }}
                            onStop={() => {
                                this.setState({ dragClass: '' }); console.log('Finished Dragging!');
                                let regex = /[+-]?\d+(\.\d+)?/g;
                                let cssTarget = document.getElementById(this.props.charArt.id).style.transform;
                                let floats = cssTarget.match(regex).map((num) => {
                                    return parseFloat(num);
                                })
                                console.log(floats);
                                this.putArticleStartPos(this.props.charArt.id, floats[0], floats[1]);
                                this.props.getArticles(this.props.charArt.character);
                            }}
                        >
                            <img 
                                onError={(e) => {
                                    e.target.src = imageError;
                                }}
                                style={{
                                    zIndex: `${this.props.zIndex}`,
                                    height: `${this.props.charArt.scale}%`
                                }}
                                onContextMenu={() => { this.props.getArticle(this.props.charArt.article) }} className={`layer-article draggable ${this.state.dragClass}`} id={this.props.charArt.id} src={`${this.props.master}${this.state.articlePath}`} alt="" />
                        </Draggable>
                    }
                    {
                        this.props.dragMode === false && this.state.articlePath &&
                        <ImageReciever
                            hover={{
                                on: () => { this.props.setActive(this.props.charArt.id) },
                                off: () => { this.props.setActive(null) }
                            }}
                            click={() => { this.props.getArticle(this.props.charArt.article) }}
                            image={{ path: this.state.articlePath, class: 'fit hover', wrapSize: 'tinier', master: this.props.master }}
                        />
                    }
                    {
                        this.props.dragMode === 'disabled' && this.state.articlePath && this.props.activeCharArt === this.props.charArt.id &&
                        <img 
                            onError={(e) => {
                                e.target.src = imageError;
                            }}
                            style={
                                {
                                    transform: `translateX(${this.props.posX}px) translateY(${this.props.posY}px)`,
                                    zIndex: `${this.props.zIndex}`,
                                    height: `${this.props.charArt.scale}%`
                                }}
                            onClick={() => { this.props.getArticle(this.props.charArt.article) }} className={`layer-article static dragging`} id={this.props.charArt.id} src={`${this.props.master}${this.state.articlePath}`} alt="" />
                    }
                    {
                        this.props.dragMode === 'disabled' && this.state.articlePath && this.props.activeCharArt !== this.props.charArt.id &&
                        <img 
                            onError={(e) => {
                                e.target.src = imageError;
                            }}
                            style={
                                {
                                    transform: `translateX(${this.props.posX}px) translateY(${this.props.posY}px)`,
                                    zIndex: `${this.props.zIndex}`,
                                    height: `${this.props.charArt.scale}%`
                                }}

                            onClick={() => { this.props.getArticle(this.props.charArt.article) }} className={`layer-article static`} id={this.props.charArt.id} src={`${this.props.master}${this.state.articlePath}`} alt="" />
                    }
                </Aux>
            )
    }
};

export default AssignedArticleList;