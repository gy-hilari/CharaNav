import React from 'react';
import Aux from '../../hoc/Auxi';
import ImageReciever from '../imageReciever/imageReciever'
import './articleList.css';

const articleList = (props) => {
    return !props.articles.length > 0 ? (
        <Aux>
            {/* <p>Showing articles of character : {`[${props.charId}]`}</p> */}
            <p>No articles created in compendium yet!</p>
        </Aux>
    )
        :
        (

            <Aux>
                {/* <p>Showing articles of character : {`[${props.charId}]`}</p> */}
                <table className='article-options'>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.articles.map((art, idx) => {
                                return (
                                    <tr key={art.id}>
                                        <td onClick={() => { document.getElementById(`${props.layerId}-sel`).value = art.id }}>
                                            <ImageReciever
                                                image={{ path: art.imagePath, class: 'fit hover', wrapSize: 'tiny', master: props.master }}
                                            />
                                        </td>
                                        <td>
                                            {art.name}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <input type="hidden" id={`${props.layerId}-sel`} />
                <button onClick={() => {
                    props.assign({
                        positionX: 2,
                        positionY: 350,
                        charId: props.charId,
                        artId: document.getElementById(`${props.layerId}-sel`).value,
                        layerId: props.layerId
                    });
                    props.getArticles(props.charId);
                }}>Add Article</button>
            </Aux>
        );
};

export default articleList;