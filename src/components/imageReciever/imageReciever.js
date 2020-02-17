import React from 'react';
import Aux from '../../hoc/Auxi';
import './imageReciever.css'

const imageReciever = (props) => {
    return props.image ? (
        <Aux>
            <div className={`wrap ${props.image.wrapSize}`}>
                <img className={props.image.class} src={`${props.image.master}${props.image.path}`} alt="ERROR" />
            </div>
        </Aux>
    ) : null;
};

export default imageReciever;
