import React from 'react';
import Aux from '../../hoc/Auxi';
import './imageReciever.css'

const imageReciever = (props) => {
    return props.image ? (
        <Aux>
            <div className="small">
                <img className={props.image.class} src={props.image.path} alt="ERROR"/>
            </div>
        </Aux>
    ) : null;
};

export default imageReciever;
