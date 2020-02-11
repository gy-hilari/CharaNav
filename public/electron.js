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

const dbDir = "data";
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
    CheckOrCreateModels().then(res => console.log(res));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
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
    // RETURNS THE WHOLE PROMISE!! :)
    return new Promise((resolve, reject) => {
        let tables = [
            'lorem',
            'chara',
            'comp',
            'article',
            'tag'
        ];

        db.serialize(() => {
            tables.forEach(t => {
                db.run(
                    `CREATE TABLE IF NOT EXISTS ${t} (
                        _id TEXT,
                        name TEXT
                    )`
                );
            });

            let stmt = db.prepare(
                `INSERT INTO chara (
                    _id,
                    name
                )
                VALUES (
                    $id,
                    $name
                )`
            );
            for (let i = 0; i < 10; i++) {
                stmt.run({ $id: uniqid('chr-'), $name: `Name # ${i}` });
            }
            stmt.finalize();

            db.all(`SELECT _id as id, name FROM chara`, (err, res) => {
                resolve(res);
            });
        });
        db.close();
    });
}

promiseIpc.on('test', () => {
    return "Testing IPC!!!";
})

promiseIpc.on('/get/comp', () => {
    return GetCompendiums();
});

promiseIpc.on('/get/article', () => {
    return GetArticles();
});

promiseIpc.on('/get/comp/id', (id) => {
    return GetCompendiumById(id);
});

promiseIpc.on('/post/comp', (form) => {
    // let txn = env.beginTxn();
    // let allComps = new Set(JSON.parse(txn.getString(dbi, "Compendiums")));
    // let compId = uniqid('cm-');
    // let newComp = {
    //     id: compId,
    //     type: 'comp',
    //     name: form.name,
    //     characters: []
    // };
    // allComps.add(compId);
    // txn.putString(dbi, "Compendiums", JSON.stringify([...allComps]));
    // txn.putString(dbi, compId, JSON.stringify(newComp));
    // txn.commit();
    // return GetCompendiums();
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
    // console.log('Getting Compendiums!');
    // let txn = env.beginTxn();
    // let allComps = new Set(JSON.parse(txn.getString(dbi, "Compendiums")));
    // let compArray = [];
    // txn.abort();
    // for (let key of allComps) {
    //     compArray.push(GetCompendiumById(key));
    // }
    // return compArray;
}

function GetCompendiumById(id) {
    // console.log(`Getting ${id}`);
    // let txn = env.beginTxn();
    // let comp = JSON.parse(txn.getString(dbi, id));
    // txn.abort();
    // return comp ? comp : null;
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