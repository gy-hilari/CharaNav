import React from 'react';
import Aux from '../../hoc/Auxi';

const articleBrowse = (props) => {
    return props.articles.length > 0 ? (
        <Aux>
            {
                props.articles.map((article, idx) => {
                    return (
                        <Aux key={article.id}>
                            <p>
                                {article.id}
                            </p>
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