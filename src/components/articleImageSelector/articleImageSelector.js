import React, { Component } from 'react';
import Aux from '../../hoc/Auxi';
import ArticleImageArray from './articleImageArray/articleImageArray';
import './articleImageSelector.css';

class ArticleImageSelector extends Component {
    state = {
        display: false
    }

    toggleImagesDisplay = () => {
        this.setState({ display: !this.state.display });
    }

    render() {
        return this.props.imgDir.length > 0 && this.props.display ? (
            <Aux>
                <p className='DirTitle' onClick={() => { this.toggleImagesDisplay(); }}>
                    {`[${this.props.dirName}]`}
                </p>
                <ArticleImageArray
                    master={this.props.master}
                    imgDir={this.props.imgDir}
                    dirName={this.props.dirName}
                    display={this.state.display}
                    setActiveImg={this.props.setActiveImg}
                    getImgClass={this.getImageClass}
                />
            </Aux>

        ) : null;
    }
};

export default ArticleImageSelector;