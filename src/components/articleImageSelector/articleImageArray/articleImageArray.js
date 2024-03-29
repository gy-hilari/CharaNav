import React from 'react';
import Aux from '../../../hoc/Auxi';
import ImageReciever from '../../imageReciever/imageReciever';
import './articleImageArray.css';

const articleImageArray = (props) => {
    return props.display ? (
        <Aux>
            {
                props.imgDir.map((img, idx) => {
                    let imgSrc = `/${props.dirName}/${img}`;
                    return (
                        <Aux key={`${props.dirName}-elm-${idx}`}>
                            <div onClick={() => { props.setActiveImg(imgSrc); }} src={imgSrc} className="image-select">
                                <ImageReciever
                                    image={{ path: imgSrc, class: 'fit hover', wrapSize: 'tiny', master: props.master }}
                                />
                            </div>
                        </Aux>
                    )
                })
            }
        </Aux>
    ) : null;
};

export default articleImageArray;