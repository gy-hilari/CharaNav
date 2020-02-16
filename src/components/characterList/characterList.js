import React from 'react';
import Aux from '../../hoc/Auxi';
import ArticleImageSelector from '../../components/articleImageSelector/articleImageSelector';
import ImageReciever from '../imageReciever/imageReciever';
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
            <hr />
            <button onClick={() => {
                props.newArticle({
                    compId: props.compId,
                    name: `Child Article of compendium: [${props.compId}]`,
                    image: `${__dirname}`
                });
            }}>
                Create Article
            </button>
            <hr />
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
                <ImageReciever
                    image={props.activeImg}
                />
                <input id="article-name" type="text" placeholder="Article Name" />
                <button onClick={() => { props.toggleImgBrowse(); }}>
                    Browse Images
                </button>
                <button onClick={() => { props.refreshDir(); }}>
                    Refresh Images
                </button>
                {
                    Object.keys(props.imgDir.directories).map((dir, idx) => {
                        return (
                            <ArticleImageSelector
                                key={`${props.imgDir.master}-elm-${idx}`}
                                master={props.imgDir.master}
                                dirName={dir}
                                imgDir={props.imgDir.directories[dir]}
                                display={props.imgBrowse}
                                setActiveImg={props.setActiveImg}
                            />
                        )
                    })
                }
                {/* <img className='article-img-sel' src={`${props.imgDir.master}/newFolder/` + props.imgDir.directories.newFolder[0]} alt="ERROR" /> */}
                <hr />
                <button onClick={() => {
                    props.newArticle({
                        compId: props.compId,
                        name: document.getElementById('article-name').value,
                        image: props.activeImg ? props.activeImg.path : null
                    });
                }}>
                    Create Article
                </button>
                <hr />
                <button onClick={() => {
                    props.newChar({
                        compId: props.compId,
                        name: `Child Character of compendium: [${props.compId}]`
                    });
                }}>Create Character</button>
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