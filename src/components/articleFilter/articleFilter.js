import React from 'react';
import Aux from '../../hoc/Auxi';

const articleFilter = (props) => {
    console.log(props);
    return (
        <Aux>
            {
                props.articlesByTag[props.articleFilter] ?
                    props.articlesByTag[props.articleFilter].map((article) => {
                        return <p key={'fl' + article.id}>{article.id}</p>
                    }) : <p>No articles with this tag!!</p>
            }
        </Aux>
    )
}

export default articleFilter;