import React from 'react';
import Aux from '../../hoc/Auxi';
import './imageReciever.css'

const imageReciever = (props) => {
    return props.image ? (
        <Aux>
            <div className={`wrap ${props.image.wrapSize}`}>
                {
                    !props.hover &&
                    <img onError={(e) => {
                        e.target.src= process.env.PUBLIC_URL + 'imageError.png';
                    }} onClick={props.click} className={props.image.class} src={`${props.image.master}${props.image.path}`} alt="ERROR" />
                }
                {
                    props.hover &&
                    <img onError={(e) => {
                        e.target.src= process.env.PUBLIC_URL + 'imageError.png';
                    }}
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