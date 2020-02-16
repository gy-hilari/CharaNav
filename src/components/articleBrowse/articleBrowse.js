import React from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';

const articleBrowse = (props) => {
    return props.articles.length > 0 ? (
        <Aux>
            {
                props.articles.map((article, idx) => {
                    return (
                        <Aux key={article.id}>
                            
                            <p>
                                {`id: ${article.id} | name: ${article.name}`}
                            </p>
                            <ImageReciever 
                                image={{path: article.imagePath, class: 'fit'}}
                            />
                        </Aux>
                    )
                })
            }
        </Aux>
    )
        :
        (
        <Aux>
            <p>
                No articles available!
            </p>
        </Aux>
    )
};

export default articleBrowse;