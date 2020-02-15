import React from 'react';
import Aux from '../../hoc/Auxi';

const assignedArticleList = (props) => {
    return !props.charArt ? (
        <Aux>
            <p>
                Error -- missing article prop
            </p>
        </Aux>
    )
        :
        (
            <Aux>
                <p>
                    {props.charArt.id}
                </p>
            </Aux>
        )
};

export default assignedArticleList;