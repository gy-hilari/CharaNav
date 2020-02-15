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
                comp: { foreignKey: false, string: 'TEXT' }, // CAN BE NULL IF ARTICLE IS 'GLOBAL'
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
                // console.log(sql);
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
    return new Promise((resolve, reject) => {
        GetCharacterById(id).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => reject(err));
    });
});

promiseIpc.on('/post/char', (form) => {
    return new Promise((resolve, reject) => {
        CreateCharacter(form).then((res) => {
            console.log(res);
            GetCharactersByCompId(form.compId).then((res) => {
                console.log(res);
                resolve(res);
            });
        }).catch((err) => {
            console.log(err);
            GetCharactersByCompId(form.compId).then((res) => {
                console.log(res);
                resolve(res);
            });
        });
    });
});

promiseIpc.on('/post/char/article', (form) => {
    return new Promise((resolve, reject) => {
        AssignArticleToCharacterLayer();
    });
});

promiseIpc.on('/get/comp/char', (compId) => {
    return new Promise((resolve, reject) => {
        GetCharactersByCompId(compId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
});

promiseIpc.on('/post/layer', (form) => {
    return new Promise((resolve, reject) => {
        CreateLayer(form).then((res) => {
            console.log(res);
            GetLayersByCharId(form.charId).then((res) => {
                console.log(res);
                resolve(res);
            });
        }).catch((err) => {
            console.log(err);
            GetLayersByCharId(form.charId).then((res) => {
                console.log(res);
                resolve(res);
            });
        });
    });
});

promiseIpc.on('/get/char/layer', (charId) => {
    return new Promise((resolve, reject) => {
        GetLayersByCharId(charId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
});

promiseIpc.on('/get/article', () => {
});


promiseIpc.on('/post/article', (form) => {
    return new Promise((resolve, reject) => {
        CreateArticle(form).then((res) => {
            console.log(res);
            GetArticlesByCompId(form.compId).then((res) => {
                console.log(res);
                resolve(res);
            });
        }).catch((err) => {
            console.log(err);
            GetArticlesByCompId(form.compId).then((res) => {
                console.log(res);
                resolve(res);
            });
        });
    });
});

promiseIpc.on('/get/comp/article', (compId) => {
    return new Promise((resolve, reject) => {
        GetArticlesByCompId(compId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
});

promiseIpc.on('/get/article/id', (id) => {
    return GetArticleById(id);
});

promiseIpc.on('/post/article/char', (form) => {
    return CreateAndAssignArticle(form);
});

promiseIpc.on('/assign/article/char/layer', (form) => {
    return new Promise((resolve, reject) => {
        AssignArticleToCharacterLayer(form).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
        });
    });
});

promiseIpc.on('/get/char/article', (charId) => {
    return new Promise((resolve, reject) => {
        GetAssignedArticlesByCharacterId(charId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
        });
    });
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

function GetCharactersByCompId(compId) {
    console.log(`Getting characters of comp: [${compId}]`);
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT _id as id, name FROM character WHERE comp = '${compId}'`, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
        });
    });
}

function CreateCharacter(form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form');
        db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO character (
                    _id,
                    name,
                    comp
                )
                VALUES (
                    $id,
                    $name,
                    $comp
                )`
            );
            let charId = uniqid('chr_');
            stmt.run({ $id: charId, $name: form.name, $comp: form.compId });
            stmt.finalize();
            resolve(`Character [${charId}] created successfully!`);
        });
    });
}

function GetCharacterById(id) {
    console.log(`Getting character with id: [${id}]`);
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `SELECT _id as id, name, comp FROM character WHERE id = '${id}'`;
            db.get(sql, (err, char) => {
                if (err) reject(err);
                resolve(char);
            });
        });
    });
}

function GetArticleById(id) {
}

function CreateLayer(form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form');
        db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO layer (
                    _id,
                    name,
                    zIndex,
                    character
                )
                VALUES (
                    $id,
                    $name,
                    $zIndex,
                    $charId
                )`
            );
            let lyrId = uniqid('lyr_');
            stmt.run({
                $id: lyrId,
                $name: form.name,
                $zIndex: form.zIndex,
                $charId: form.charId
            });
            stmt.finalize();
            resolve(`Character [${lyrId}] created successfully!`);
        });
    });
}

function GetLayersByCharId(charId) {
    return new Promise((resolve, reject) => {
        console.log(`Getting layers of char: [${charId}]`);
        db.serialize(() => {
            db.all(`SELECT _id as id, name, zIndex FROM layer WHERE character = '${charId}'`, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
        });
    })
}

function CreateArticle(form) {
    return new Promise((resolve, reject) => {
        if (!form.name) reject('Invalid form');
        db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO article (
                    _id,
                    name,
                    imagePath,
                    comp
                )
                VALUES (
                    $id,
                    $name,
                    $imagePath,
                    $comp
                )`
            );
            let artId = uniqid('art_');
            stmt.run({
                $id: artId,
                $name: form.name,
                $imagePath: form.image,
                $comp: form.compId
            });
            stmt.finalize();
            resolve(`Character [${artId}] created successfully!`);
        });
    });
}

function GetArticlesByCompId(compId) {
    console.log(`Getting articles of comp: [${compId}]`);
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`SELECT _id as id, name, imagePath FROM article WHERE comp = '${compId}'`, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
        });
    });
}

function AssignArticleToCharacterLayer(form) {
    // Check if entry already exists!!
    return new Promise((resolve, reject) => {
        if (!form.artId) reject('Invalid form');
        db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO character_article (
                    _id,
                    position,
                    character,
                    article,
                    layer
                )
                VALUES (
                    $id,
                    $position,
                    $character,
                    $article,
                    $layer
                )`
            );
            let charLyr = uniqid('chrlr_');
            stmt.run({
                $id: charLyr,
                $position: form.position,
                $character: form.charId,
                $article: form.artId,
                $layer: form.layerId
            });
            stmt.finalize();
            resolve(`Article [${form.artId}] assigned to [${form.charId}]  on layer [${form.layerId}] successfully!`);
        });
    });
}

function GetAssignedArticlesByCharacterId(charId) {
    return new Promise((resolve, reject) => {
        console.log(`Getting assigned articles of char: [${charId}]`);
        db.serialize(() => {
            db.all(`SELECT _id as id, position, character, article, layer FROM character_article WHERE character = '${charId}'`, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
        });
    });
}

function GetAssignedArticlesByLayerId(layerId) {
    return new Promise((resolve, reject) => {

    });
}

function GetAssignedArticle(form) {
    return new Promise((resolve, reject) => {
        // if (err) resolve(false);
        // resolve(true);
    });
}

//#endregion