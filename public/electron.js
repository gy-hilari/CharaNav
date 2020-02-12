const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const { ipcMain } = require('electron');
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const uniqid = require('uniqid');
const promiseIpc = require('electron-promise-ipc');

// const lmdb = require('node-lmdb');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;

//#region  INITIALIZE DATABASE ENVIRONMENT

const dbDir = "charanavdata";
const dbName = "charanav";
if (!fs.existsSync('.' + `/${dbDir}/${dbName}.db`)) {
    fs.mkdirSync('.' + `/${dbDir}`);
    fs.createWriteStream('.' + `/${dbDir}/${dbName}.db`);
}

const db = new sqlite3.Database(path.join('.', `/${dbDir}/${dbName}.db`));

//#endregion

//#region  CREATE ELECTRON WINDOW

function createWindow() {
    let state = windowStateKeeper({
        defaultWidth: 800, defaultHeight: 600
    })

    mainWindow = new BrowserWindow({
        x: state.x, y: state.y,
        width: state.width, height: state.height,
        minWidth: 350, minHeight: 300,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "/preload.js")
        },

        frame: true
    });

    const startUrl = isDev ? process.env.ELECTRON_START_URL : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    if (isDev) mainWindow.webContents.openDevTools();

    state.manage(mainWindow);

    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {
    createWindow();
    CheckOrCreateModels().then(res => {
        console.log(res);
    }).catch((err) => console.log(err));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db.close();
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

//#endregion

//#region  DATABASE and API

function CheckOrCreateModels() {
    return new Promise((resolve, reject) => {
        let tables = [
            {
                tableName: 'comp',
                name: { foreignKey: false, string: 'TEXT NOT NULL' }
            },
            {
                tableName: 'character',
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                comp: { foreignKey: false, string: 'TEXT NOT NULL' },
                compkey: { foreignKey: true, string: 'FOREIGN KEY (comp) REFERENCES comp(_id)' }
            },
            {
                tableName: 'layer',
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                zIndex: { foreignKey: false, string: 'TEXT NOT NULL' }, // MAKE A LINKED LIST FOR THESE!
                character: { foreignKey: false, string: 'TEXT NOT NULL' },
                charKey: { foreignKey: true, string: 'FOREIGN KEY (character) REFERENCES character(_id)' }
            },
            {
                tableName: 'article',
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                imagePath: { foreignKey: false, string: 'TEXT NOT NULL' },
                comp: { foreignKey: false, string: 'TEXT NOT NULL' },
                compKey: { foreignKey: true, string: 'FOREIGN KEY (comp) REFERENCES comp(_id)' }
            },
            {
                tableName: 'character_article',
                position: { foreignKey: false, string: 'TEXT NOT NULL' },
                character: { foreignKey: false, string: 'TEXT NOT NULL' },
                article: { foreignKey: false, string: 'TEXT NOT NULL' },
                layer: { foreignKey: false, string: 'TEXT NOT NULL' },
                charKey: { foreignKey: true, string: 'FOREIGN KEY (character) REFERENCES character(_id)' },
                articleKey: { foreignKey: true, string: 'FOREIGN KEY (article) REFERENCES article(_id)' },
                layerKey: { foreignKey: true, string: 'FOREIGN KEY (layer) REFERENCES layer(_id)' }
            },
            {
                tableName: 'tag',
                name: { foreignKey: false, string: 'TEXT NOT NULL' }
            },
            {
                tableName: 'article_tag',
                article: { foreignKey: false, string: 'TEXT NOT NULL' },
                tag: { foreignKey: false, string: 'TEXT NOT NULL' },
                articleKey: { foreignKey: true, string: 'FOREIGN KEY (article) REFERENCES article(_id)' },
                tagKey: { foreignKey: true, string: 'FOREIGN KEY (tag) REFERENCES tag(_id)' }
            }
        ];

        db.serialize(() => {
            tables.forEach(t => {
                let sql =
                    `CREATE TABLE IF NOT EXISTS ${t.tableName} (
                    _id TEXT PRIMARY KEY,
                    `;

                let fields = Object.keys(t);
                for (let k = 0; k < fields.length; k++) {
                    if (fields[k] != 'tableName') {
                        sql += !t[fields[k]].foreignKey ? `${fields[k]} ${t[fields[k]].string}` : `${t[fields[k]].string}`;
                        if (k + 1 < fields.length) sql += `,
                        `;
                    }
                }
                sql += `
                )`;
                console.log(sql);
                let stmt = db.prepare(sql);
                stmt.run(err => {
                    reject(err);
                });
                stmt.finalize();
            });
            resolve('Models created!');
        });
    });
}

promiseIpc.on('test', () => {
    return "Testing IPC!!!";
})

promiseIpc.on('/get/comp', () => {
    return new Promise((resolve, reject) => {
        GetCompendiums().then((res) => {
            console.log(res);
            resolve(res);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
});

promiseIpc.on('/get/article', () => {
    return GetArticles();
});

promiseIpc.on('/get/comp/id', (id) => {
    return new Promise((resolve, reject) => {
        GetCompendiumById(id).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => reject(err));
    });
});

promiseIpc.on('/post/comp', (form) => {
    return new Promise((resolve, reject) => {
        CreateCompendium(form).then((res) => {
            console.log(res);
            GetCompendiums().then((res) => {
                console.log(res);
                resolve(res);
            });
        }).catch((err) => {
            console.log(err);
            GetCompendiums().then((res) => {
                console.log(res);
                resolve(res);
            });
        });
    });
});

promiseIpc.on('/get/char/id', (id) => {
    // return GetCharacterById(id);
});

promiseIpc.on('/post/char', (form) => {
    // let txn = env.beginTxn();
    // let allChars = new Set(JSON.parse(txn.getString(dbi, "Characters")));
    // let charId = uniqid('chr-');
    // let newChar = {
    //     id: charId,
    //     comp: form.compId,
    //     type: 'character',
    //     name: form.name,
    //     articles: []
    // };
    // allChars.add(charId);
    // let comp = JSON.parse(txn.getString(dbi, form.compId));
    // let compChars = new Set(comp.characters);
    // compChars.add(charId);
    // comp.characters = [...compChars];
    // txn.putString(dbi, form.compId, JSON.stringify(comp));
    // txn.putString(dbi, "Characters", JSON.stringify([...allChars]));
    // txn.putString(dbi, charId, JSON.stringify(newChar));
    // txn.commit();
    // return GetCharacterById(charId);
});

promiseIpc.on('/get/comp/char', () => {
    return GetCharactersOfCompendiums();
});

promiseIpc.on('/post/article', (form) => {
    return CreateArticle(form);
});

promiseIpc.on('/get/article/id', (id) => {
    return GetArticleById(id);
});

promiseIpc.on('/post/article/char', (form) => {
    return CreateAndAssignArticle(form);
});

promiseIpc.on('/assign/article/char', (form) => {
    return AssignArticle(form);
});

promiseIpc.on('/get/char/article', () => {
    return GetArticlesOfCharacters();
});

promiseIpc.on('/get/artTag', () => {
    return GetArtTags();
})

promiseIpc.on('/post/artTag', (form) => {
    return CreateArticleTag(form);
});

promiseIpc.on('/post/article/artTag', (form) => {
    return AssignArticleTag(form);
})

promiseIpc.on('/get/article/artTag', (form) => {
    return GetArticlesByTag();
})

function GetCompendiums() {
    console.log('Getting Compendiums!');
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT _id as id, name FROM comp`, (err, comps) => {
                if (err) reject(err);
                resolve(comps);
            });
        });
    });
}

function CreateCompendium(form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form!');
        db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO comp (
                    _id,
                    name
                )
                VALUES (
                    $id,
                    $name
                )`
            );
            let compId = uniqid('cmp_');
            stmt.run({ $id: compId, $name: form.name });
            stmt.finalize();
            resolve(`Compendium [${compId}] created successfully!`);
        });
    });
}

function GetCompendiumById(id) {
    console.log(id);
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `SELECT _id as id, name FROM comp WHERE id = '${id}'`; 
            db.get(sql, (err, comp) => {
                if (err) reject(err);
                resolve(comp);
            });
        });
    });
}

function GetCharacterById(id) {
    // let txn = env.beginTxn();
    // let char = JSON.parse(txn.getString(dbi, id));
    // txn.abort();
    // return char ? char : null;
}

function GetArticleById(id) {
    // let txn = env.beginTxn();
    // let article = JSON.parse(txn.getString(dbi, id));
    // txn.abort();
    // return article ? article : null;
}

function GetCharactersOfCompendiums() {
    // let txn = env.beginTxn();
    // let allComps = JSON.parse(txn.getString(dbi, "Compendiums"));
    // txn.abort();
    // let compChars = {};
    // allComps.forEach((i) => {
    //     let chars = [];
    //     let comp = GetCompendiumById(i);
    //     comp.characters.forEach((j) => {
    //         chars.push(GetCharacterById(j));
    //     });
    //     compChars[i] = chars;
    // });
    // // console.log(compChars);
    // return compChars;
}

function CreateArticle(form) {
    // console.log('Creating Article!');
    // let txn = env.beginTxn();
    // let allArticles = new Set(JSON.parse(txn.getString(dbi, "Articles")));
    // let articleId = uniqid('art-');
    // let newArticle = {
    //     id: articleId,
    //     type: 'article',
    //     name: form.name,
    //     tags: []
    // };
    // allArticles.add(articleId);
    // txn.putString(dbi, articleId, JSON.stringify(newArticle));
    // txn.putString(dbi, "Articles", JSON.stringify([...allArticles]));
    // txn.commit();
    // return GetArticleById(articleId);
}

function GetArticles() {
    // let txn = env.beginTxn();
    // let allArticles = new Set(JSON.parse(txn.getString(dbi, "Articles")));
    // let articleArray = [];
    // txn.abort();
    // for (let key of allArticles) {
    //     articleArray.push(GetArticleById(key));
    // }
    // return articleArray;
}

function CreateAndAssignArticle(charId, form) {
    // let txn = env.beginTxn();
    // let char = JSON.parse(txn.getString(dbi, charId));
    // let charArticles = new Set(char.articles);
    // let article = CreateArticle(form);
    // charArticles.add(article.id); // Convert to many to many join table
    // char.articles = [...charArticles];
    // txn.putString(dbi, charId, JSON.stringify(char));
    // txn.commit();
    // return GetArticleById(article.id);
}

function AssignArticle(form) {
    // let char = GetCharacterById(form.charId);
    // let charArticles = new Set(char.articles);
    // let article = GetArticleById(form.articleId)
    // charArticles.add(article.id); // Convert to many to many join table
    // char.articles = [...charArticles];
    // let txn = env.beginTxn();
    // txn.putString(dbi, form.charId, JSON.stringify(char));
    // txn.commit();
    // return GetArticleById(form.articleId);
}

function GetArticlesOfCharacters() {
    // let txn = env.beginTxn();
    // let allChars = JSON.parse(txn.getString(dbi, "Characters"));
    // txn.abort();
    // let charArticles = {};
    // allChars.forEach((i) => {
    //     let articles = [];
    //     let char = GetCharacterById(i);
    //     char.articles.forEach((j) => {
    //         articles.push(GetArticleById(j));
    //     });
    //     charArticles[i] = articles;
    // });
    // // console.log(charArticles);
    // return charArticles;
}

function GetArtTags() {
    // console.log('Getting Article Tags!!!')
    // let txn = env.beginTxn();
    // let allArtTags = new Set(JSON.parse(txn.getString(dbi, "ArtTags")));
    // let artTagArray = [];
    // txn.abort();
    // for (let key of allArtTags) {
    //     artTagArray.push(GetArtTagById(key));
    // }
    // return artTagArray;
}

function GetArtTagById(id) {
    // let txn = env.beginTxn();
    // let artTag = JSON.parse(txn.getString(dbi, id));
    // txn.abort();
    // return artTag ? artTag : null;
}

function CreateArticleTag(form) {
    // let txn = env.beginTxn();
    // let allArtTags = new Set(JSON.parse(txn.getString(dbi, "ArtTags")));
    // let artTagId = uniqid('tgArt-');
    // let newTag = {
    //     id: artTagId,
    //     type: 'articleTag',
    //     name: form.name
    // };    
    // allArtTags.add(artTagId);
    // txn.putString(dbi, artTagId, JSON.stringify(newTag));
    // txn.putString(dbi, "ArtTags", JSON.stringify([...allArtTags]));
    // txn.commit();
    // return GetArtTagById(artTagId);
}

function AssignArticleTag(form) {
    // let article = GetArticleById(form.articleId);
    // let artTag = GetArtTagById(form.artTagId);
    // let articleTags = new Set(article.tags);
    // articleTags.add(artTag.id); // Convert to many to many join table
    // article.tags = [...articleTags];
    // let txn = env.beginTxn();
    // txn.putString(dbi, form.articleId, JSON.stringify(article));
    // txn.commit();
    // return GetArtTagById(form.artTagId);
}

function GetArticlesByTag() { // REFACTOR TO MANY TO MANY JOIN TABLE!    
    // let txn = env.beginTxn();
    // let allArtTags = new Set(JSON.parse(txn.getString(dbi, "ArtTags")));
    // let allArticles = new Set(JSON.parse(txn.getString(dbi, "Articles")));
    // txn.abort();
    // let articlesByTag = {};
    // for (tag of allArtTags) {
    //     let articleArray = [];
    //     for (artId of allArticles) {
    //         let article = GetArticleById(artId);
    //         let articleTags = new Set(article.tags);
    //         if (articleTags.has(tag)) articleArray.push(article);
    //     }
    //     articlesByTag[tag] = articleArray;
    // }
    // return articlesByTag;
}

//#endregion