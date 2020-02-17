import React from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';

const viewArticle = (props) => {
    return (
        <Aux>
            <p>
                Viewing article: {props.article.id}
            </p>
            <hr />
            <ImageReciever
                image={{ path: props.article.imagePath, class: 'fit', wrapSize: 'full', master: props.master}}
            />
            <p>
                {props.article.text}
            </p>
        </Aux>
    );
};

export default viewArticle;