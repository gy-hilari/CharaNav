import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';
import './assignedArticleList.css';

class AssignedArticleList extends Component {
    state = {
        articlePath: null,
        dragClass: ''
    }

    componentDidMount() {
        if (this.props.charArt) {
            this.getArticle(this.props.charArt.article);
            // console.log(this.props.posX);
            // this.getArticleLayerPositions(this.props.charArt.character);
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


    //

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
                        this.state.articlePath &&
                        <Draggable
                            scale={this.props.dragScale}
                            bounds={`parent`}
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
                            <img onContextMenu={() => { this.props.getArticle(this.props.charArt.article) }} className={`layer-article ${this.state.dragClass}`} id={this.props.charArt.id} src={`${this.props.master}${this.state.articlePath}`} alt="" />
                        </Draggable>
                    }
                </Aux>
            )
    }
};

export default AssignedArticleList;