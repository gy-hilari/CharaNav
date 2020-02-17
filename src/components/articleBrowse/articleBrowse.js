import React from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever';
import './articleBrowse.css';

const articleBrowse = (props) => {
    return props.articles.length > 0 ? (
        <Aux>
            {
                props.articles.map((article, idx) => {
                    return (
                        <Aux key={article.id}>
                            {/* <p>
                                {`id: ${article.id} | name: ${article.name}`}
                            </p> */}
                            <div className="targetArticle articleTooltip" onClick={() => {
                                props.getArticle(article.id);
                            }}>
                                <p className="tooltiptext">
                                    {/* {`id: ${article.id} | name: ${article.name}`} */}
                                    {article.name}
                                </p>
                                <ImageReciever
                                    image={{ path: article.imagePath, class: 'fit hover', wrapSize: 'tiny', master: props.master}}
                                />
                            </div>
                            {/* <p>
                                {article.text}
                            </p> */}
                            {/* <hr/> */}
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