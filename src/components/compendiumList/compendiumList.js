import React from 'react';
import Aux from '../../hoc/Auxi';
import './compendiumList.css'

const CompendiumList = (props) => {
    return (
        <Aux>
            {
                props.comps.map((elm, idx) => {
                    let num = idx + 1;
                    return (
                        <Aux key={elm.id}>
                            <p className='Compendium' onClick={() => { props.getComp(elm.id) }}>{`${num}.) ${elm.id}`}</p>
                            <hr />
                            <button onClick={() => {
                                props.newChar({
                                    compId: elm.id,
                                    name: `Child Character of entry: [${num}]`
                                });
                            }}>Create Character</button>
                            <hr />
                            {
                                props.compChars[elm.id] ?
                                    props.compChars[elm.id].map((char) => {
                                        return (
                                            <Aux key={char.id}>
                                                {/* <div className="tooltip"> */}
                                                    <p className='Character tooltip' onClick={() => { props.getChar(char.id) }}>
                                                        <span className="tooltiptext">
                                                            {char.id}
                                                        </span>
                                                        {char.id}
                                                    </p>
                                                    {/* <form onSubmit={() => { props.assignArticle({ charId: char.id, articleId: document.getElementById(`sel-${char.id}`).value }) }}>
                                                        <select id={`sel-${char.id}`}>
                                                            {
                                                                props.articles.map((article) => {
                                                                    return (
                                                                        <option key={'sel' + char.id + article.id} value={article.id}>{article.id}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        <input type="submit" value="Add Article" />
                                                    </form>
                                                    {
                                                        props.charArticles[char.id] ?
                                                            props.charArticles[char.id].map((article) => {
                                                                return (
                                                                    <p key={char.id + article.id}>{article.id}</p>
                                                                )
                                                            })
                                                            : null
                                                    } */}
                                                {/* </div> */}
                                                <hr />
                                            </Aux>
                                        )
                                    })
                                    : null
                            }
                        </Aux>
                    );
                })
            }
        </Aux>
    );
};
export default CompendiumList;