import React from 'react';
import Aux from '../../hoc/Auxi';
import './articleBrowse.css';
import imageError from '../../imageError.png';


const articleBrowse = (props) => {
    return props.browseMode === 'article' ? (
        <Aux>
            {
                props.articles.length > 0 &&
                props.articles.map((article, idx) => {
                    return (
                        <Aux key={article.id}>
                            <div className="targetArticle articleTooltip">
                                <div className="image-wrap" onClick={() => {
                                    props.getArticle(article.id);
                                }}>
                                    <img onError={(e) => {
                                        e.target.src= imageError;
                                    }} src={`${props.master}${article.imagePath}`} alt="ERROR" />
                                </div>
                                <h2 className="article-name">{article.name}</h2>
                                <h4 className="article-delete" onClick={() => {
                                    console.log(article.id);
                                    props.deleteConfirm({ route: "art", name: article.name, id: article.id });
                                }}>{`Delete [${article.name}]`}</h4>
                            </div>

                        </Aux>
                    )
                })
            }
            {
                !props.articles.length > 0 &&
                <h2 className="article-error">
                    No articles available!
                </h2>
            }
        </Aux>
    ) : null;
};

export default articleBrowse;