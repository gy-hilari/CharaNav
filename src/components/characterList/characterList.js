import React from 'react';
import Aux from '../../hoc/Auxi';
import './characterList.css'

const characterList = (props) => {
    return !props.chars ? (
        <Aux>
            <p>Showing character list of {`[${props.compId}]`}!</p>
            <hr />
            <button onClick={() => {
                props.newChar({
                    compId: props.compId,
                    name: `Child Character of compendium: [${props.compId}]`
                });
            }}>Create Character</button>
            <button onClick={() => {
                props.newArticle({
                    compId: props.compId,
                    name: `Child Article of compendium: [${props.compId}]`,
                    image: `${__dirname}`
                });
            }}>
                Create Article
            </button>
            <button>
                Browse Articles
            </button>
            <hr />
        </Aux>
    ) :
        (
            <Aux>
                <p>Showing character list of {`[${props.compId}]`}!</p>
                <hr />
                <button onClick={() => {
                    props.newChar({
                        compId: props.compId,
                        name: `Child Character of compendium: [${props.compId}]`
                    });
                }}>Create Character</button>
                <button onClick={() => {
                    props.newArticle({
                        compId: props.compId,
                        name: `Child Article of compendium: [${props.compId}]`,
                        image: `${__dirname}`
                    });
                }}>
                    Create Article
                </button>
                <button onClick={() => {
                    props.setScene('article');
                }}>
                    Browse Articles
                </button>
                <hr />
                {
                    props.chars.map((elm, idx) => {
                        let num = idx + 1;
                        return (
                            <Aux key={elm.id}>
                                <p onClick={() => {
                                    // get layers by char id
                                    // get character_articles by char id
                                    props.getLayers(elm.id);
                                    props.getArticles(elm.id);
                                    props.getChar(elm.id);
                                }} className='Character tooltip'>
                                    <span className='tooltiptext'>{elm.id}</span>
                                    {`${num}.) Name: ${elm.name}`}
                                </p>
                            </Aux>
                        );
                    })
                }
            </Aux>
        );
};

export default characterList;