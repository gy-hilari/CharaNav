import React from 'react';
import Aux from '../../hoc/Auxi'
import ImageReciever from '../imageReciever/imageReciever';
import ArticleImageSelector from '../articleImageSelector/articleImageSelector';

const articleForm = (props) => {
    return props.formMode === 'article' ? (
        <Aux>
            {
                props.activeImg &&
                <ImageReciever
                    image={props.activeImg}
                />

            }
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
            <hr />
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
            <button onClick={() => {
                props.setFormMode(null);
            }}>
                Cancel
            </button>
            <hr />
        </Aux>
    ) : null;
};

export default articleForm;