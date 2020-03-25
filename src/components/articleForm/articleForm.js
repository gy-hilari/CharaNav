import React from 'react';
import Aux from '../../hoc/Auxi'
import ImageReciever from '../imageReciever/imageReciever';
import ArticleImageSelector from '../articleImageSelector/articleImageSelector';
import './articleForm.css';

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
            <h4 className="art-form-button" onClick={() => { props.setImgBrowse(!props.imgBrowse); }}>
                Browse Images
            </h4>
            <h4 className="art-form-button" onClick={() => { props.refreshDir(); }}>
                Refresh Images
            </h4>

            {
                props.imgBrowse &&
                <div className="article-image-scroller">
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
                </div>

            }

            <textarea id="article-text" cols="30" rows="10" placeholder="Article Description"></textarea>
            <h4 className="art-form-button art-form-confirm" onClick={() => {
                if (/\S/.test(document.getElementById('article-text').value)) {
                    props.newArticle({
                        compId: props.compId,
                        name: document.getElementById('article-name').value,
                        text: document.getElementById('article-text').value,
                        image: props.activeImg ? props.activeImg.path : null
                    });
                    if (
                        document.getElementById('article-name').value &&
                        document.getElementById('article-text').value
                    ) {
                        props.refresh();
                        props.setFormMode(null);
                    }
                }
            }}>
                Create Article
            </h4>
            <h4 className="art-form-button art-form-cancel" onClick={() => {
                props.setActiveImg(null);
                props.setImgBrowse(false);
                props.setFormMode(null);
            }}>
                Cancel
            </h4>
        </Aux>
    ) : null;
};

export default articleForm;