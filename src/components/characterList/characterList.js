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
                <button onClick={() => { props.setImgBrowse(!props.imgBrowse); }}>
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
                <hr />
                <textarea id="article-text" cols="30" rows="10"></textarea>
                <hr/>
                <button onClick={() => {
                    props.newArticle({
                        compId: props.compId,
                        name: document.getElementById('article-name').value,
                        text: document.getElementById('article-text').value,
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
                    props.setActiveImg(null);
                    props.setImgBrowse(false);
                    props.setScene('article-browse');
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
                                    props.setActiveImg(null);
                                    props.setImgBrowse(false);
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