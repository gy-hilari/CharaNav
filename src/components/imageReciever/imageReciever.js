import React from 'react';
import Aux from '../../hoc/Auxi';
import './imageReciever.css'

const imageReciever = (props) => {
    return props.image ? (
        <Aux>
            <div className={`wrap ${props.image.wrapSize}`}>
                {
                    !props.hover &&
                    <img onClick={props.click} className={props.image.class} src={`${props.image.master}${props.image.path}`} alt="ERROR" />
                }
                {
                    props.hover &&
                    <img
                        onMouseEnter={props.hover.on}
                        onMouseLeave={props.hover.off}
                        onClick={props.click}
                        className={props.image.class} src={`${props.image.master}${props.image.path}`} alt="ERROR" />
                }
            </div>
        </Aux>
    ) : null;
};

export default imageReciever;
