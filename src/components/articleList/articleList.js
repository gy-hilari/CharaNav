import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever'
import './articleList.css';

class ArticleList extends Component {
    state = {
        assigningLayer: false,
        activeLayerImage: null
    }
    render() {
        return !this.props.articles.length > 0 ? (
            <Aux>
                <p>No articles created in compendium yet!</p>
            </Aux>
        )
            :
            (
                <Aux>
                    {
                        this.state.activeLayerImage &&
                        <ImageReciever
                            image={{ path: this.state.activeLayerImage, class: 'fit', wrapSize: 'tiny', master: this.props.master }}
                        />
                    }
                    {
                        // REFACTOR TO PARENT COMPONENT
                        this.state.assigningLayer === false &&
                        <button onClick={() => {
                            this.setState({ assigningLayer: true });
                        }}>Add Article</button>

                    }
                    {
                        this.state.assigningLayer &&
                        <Aux>
                            <div className="article-option-wrap">
                                <table className='article-options'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.articles.map((art, idx) => {
                                                return (
                                                    <tr key={art.id}>
                                                        <td onClick={() => {
                                                            this.setState({ activeLayerImage: art.imagePath });
                                                            document.getElementById(`${this.props.layerId}-sel`).value = art.id
                                                        }}>
                                                            <ImageReciever
                                                                image={{ path: art.imagePath, class: 'fit hover', wrapSize: 'tinier', master: this.props.master }}
                                                            />
                                                        </td>
                                                        <td>
                                                            {art.name}
                                                        </td>
                                                    </tr>
                                                )
                                            })

                                        }
                                    </tbody>
                                </table>
                            </div>
                            <input type="hidden" id={`${this.props.layerId}-sel`} />
                            <button onClick={() => {
                                this.props.assign({
                                    positionX: 2,
                                    positionY: 350,
                                    charId: this.props.charId,
                                    artId: document.getElementById(`${this.props.layerId}-sel`).value,
                                    layerId: this.props.layerId
                                });
                                this.props.getArticles(this.props.charId);
                                this.setState({ activeLayerImage: null });
                            }}>Confirm</button>
                            <button onClick={() => {
                                this.setState({ assigningLayer: false });
                                this.setState({ activeLayerImage: null });
                            }}>Cancel</button>
                        </Aux>
                    }
                </Aux>
            );
    }
};

export default ArticleList;