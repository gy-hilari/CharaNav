const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const { ipcMain } = require('electron');
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');
const { readdirSync } = require('fs');

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

const imgDir = "images";
if (!fs.existsSync('.' + `/${imgDir}`)) {
    fs.mkdirSync('.' + `/${imgDir}`);
}

const getDirs = (path) => {
    let dirs = {};
    readdirSync(path, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dirs[dir.name] = getFiles(dir.name));
    return dirs;
}

const getFiles = (dir) => {
    let validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".bmp"
    ];
    return readdirSync(`./images/${dir}`, { withFileTypes: true })
        .filter(file => !file.isDirectory())
        .filter(file => validExtensions.includes(path.extname(file.name)))
        .map(file => file.name);
}

console.log(`Current image dir: ${path.resolve('./images')}`);
console.log(getDirs('./images'));

const db = new sqlite3.Database(path.join('.', `/${dbDir}/${dbName}.db`));

//#endregion

//#region  CREATE ELECTRON WINDOW

function createWindow() {
    let state = windowStateKeeper({
        defaultWidth: 800, defaultHeight: 600
    })

    mainWindow = isDev ?
        new BrowserWindow({
            x: state.x, y: state.y,
            width: state.width, height: state.height,
            minWidth: 700, minHeight: 600,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webSecurity: false,
                preload: path.join(__dirname, "/preload.js")
            },

            frame: true
        })
        :
        new BrowserWindow({
            x: state.x, y: state.y,
            width: state.width, height: state.height,
            minWidth: 700, minHeight: 600,
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
    // mainWindow.webContents.openDevTools();

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
                zIndex: { foreignKey: false, string: 'INT NOT NULL' }, // MAKE A LINKED LIST FOR THESE!
                character: { foreignKey: false, string: 'TEXT NOT NULL' },
                createdAt: { foreignKey: false, string: 'TEXT NOT NULL' },
                charKey: { foreignKey: true, string: 'FOREIGN KEY (character) REFERENCES character(_id)' }
            },
            {
                tableName: 'article',
                name: { foreignKey: false, string: 'TEXT NOT NULL' },
                text: { foreignKey: false, string: 'TEXT NOT NULL' },
                imagePath: { foreignKey: false, string: 'TEXT NOT NULL' },
                comp: { foreignKey: false, string: 'TEXT' }, // CAN BE NULL IF ARTICLE IS 'GLOBAL'
                compKey: { foreignKey: true, string: 'FOREIGN KEY (comp) REFERENCES comp(_id)' }
            },
            {
                tableName: 'character_article',
                positionX: { foreignKey: false, string: 'INT NOT NULL' },
                positionY: { foreignKey: false, string: 'INT NOT NULL' },
                scale: { foreignKey: false, string: 'INT NOT NULL' },
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
});

promiseIpc.on('/get/imageDir', () => {
    console.log('Getting image dirs!');
    let dirData = {};
    dirData['master'] = path.resolve('./images');
    dirData['directories'] = getDirs('./images');
    return dirData;
});

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

promiseIpc.on('/delete/comp', (compId) => {
    return new Promise((resolve, reject) => {
        DeleteCompendiumById(compId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            resolve(`Compendium [${compId}] not found!`)
        });
    })
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

promiseIpc.on('/delete/char', (charId) => {
    return new Promise((resolve, reject) => {
        DeleteCharacterById(charId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            resolve(`Character [${charId}] not found!`)
        });
    })
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

promiseIpc.on('/delete/layer', (lyrId) => {
    return new Promise((resolve, reject) => {
        DeleteLayerById(lyrId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            resolve(`Layer [${lyrId}] not found!`)
        });
    })
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

promiseIpc.on('/delete/article', (artId) => {
    return new Promise((resolve, reject) => {
        DeleteArticleById(artId).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            resolve(`Article [${artId}] not found!`)
        });
    })
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
    return new Promise((resolve, reject) => {
        GetArticleById(id).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => reject(err));
    });
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

promiseIpc.on('/put/char/layer/pos', (form) => {
    return new Promise((resolve, reject) => {
        UpdateCharacterLayerPosition(form).then((res) => {
            console.log(res);
            resolve(res);
        })
    }).catch((err) => {
        console.log(err);
    });
});

promiseIpc.on('/put/char/layer/reset', (charArtId) => {
    return new Promise((resolve, reject) => {
        ResetCharacterLayerByCharArtId(charArtId).then((res) => {
            console.log(res);
            resolve(res);
        })
    }).catch((err) => {
        console.log(err);
    });
});

promiseIpc.on('/put/layer/swap', (form) => {
    return new Promise((resolve, reject) => {
        SwapLayerZIndex(form).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            resolve(err);
        });
    });
});

promiseIpc.on('/put/layer/name', (form) => {
    return new Promise((resolve, reject) => {
        UpdateLayerName(form).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            resolve(err);
        });
    });
});

promiseIpc.on('/put/char/layer/scale', (form) => {
    return new Promise((resolve, reject) => {
        UpdateCharacterLayerScale(form).then((res) => {
            console.log(res);
            resolve(res);
        }).catch((err) => {
            console.log(err);
            resolve(err);
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
        if (form.name) db.serialize(() => {
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
        if (form.name) db.serialize(() => {
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

function CreateLayer(form) {
    return new Promise((resolve, reject) => {
        GetNewestLayerByCharId(form.charId).then((layer) => {
            console.log(layer[0] ? layer[0] : 'No layer found');
            let zValue = layer[0] ? layer[0].zIndex + 1 : 0;
            if (!form.name) reject('Invalid form');
            db.serialize(() => {
                let stmt = db.prepare(
                    `INSERT INTO layer (
                        _id,
                        name,
                        zIndex,
                        createdAt,
                        character
                    )
                    VALUES (
                        $id,
                        $name,
                        $zIndex,
                        $createdAt,
                        $charId
                    )`
                );
                let lyrId = uniqid('lyr_');
                stmt.run({
                    $id: lyrId,
                    $name: `Layer [${zValue}]`,
                    $zIndex: zValue,
                    $createdAt: new Date(Date.now()).toISOString(),
                    $charId: form.charId
                });
                stmt.finalize();
                resolve(`Character [${lyrId}] created successfully!`);
            });
        });
    });
}

function UpdateLayerName(form) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`UPDATE layer SET name = '${form.name}' WHERE _id = '${form.id}'`, (err, char) => {
                if (err) reject(err);
                resolve(`Updated name of layer [${form.id}] to [${form.name}]`);
            });
        });
    });
}

function GetLayersByCharId(charId) {
    return new Promise((resolve, reject) => {
        console.log(`Getting layers of char: [${charId}]`);
        db.serialize(() => {
            db.all(`SELECT _id as id, name, createdAt, zIndex FROM layer WHERE character = '${charId}' ORDER BY zIndex DESC`, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
        });
    })
}

function GetNewestLayerByCharId(charId) {
    return new Promise((resolve, reject) => {
        console.log(`Getting newest layer of char: [${charId}]`);
        db.serialize(() => {
            db.all(`SELECT _id as id, name, createdAt, zIndex FROM layer WHERE character = '${charId}' ORDER BY zIndex DESC LIMIT 1`, (err, char) => {
                if (err) reject(err);
                resolve(char);
            });
        });
    })
}

function SwapLayerZIndex(form) {
    // QUERY TARGET LAYER WHERE Z-INDEX === CURRENT zIndex - 1
    // IF UNDEFINED, REJECT
    return new Promise((resolve, reject) => {
        GetLayerById(form.targetLayerId).then((layer) => {
            let targetLayer = layer ? layer : null;
            if (!targetLayer) reject(`No layer with target id: [${form.targetLayerId}]`);
            // SHIFT VALUE = 1 OR -1
            let shiftValue = targetLayer.zIndex + form.shiftValue;
            console.log(`Shift Value: ${shiftValue}`);
            if (shiftValue < 0) reject(`No layers below layer: [${form.targetLayerId}]`);
            GetLayerByZIndex({ zIndex: shiftValue, character: targetLayer.character }).then((sLayer) => {
                console.log(sLayer);
                let swapLayer = sLayer ? sLayer : null;
                if (!swapLayer) reject(`No layer with swap zIndex: [${shiftValue}]`);
                let swap = swapLayer.zIndex;
                UpdateLayerZIndex({ layer: swapLayer, zIndex: targetLayer.zIndex }).then((res) => {
                    console.log(res);
                    UpdateLayerZIndex({ layer: targetLayer, zIndex: swap }).then((res) => {
                        console.log(res);
                        resolve(`Swapped zIndex of [${targetLayer.id}] & [${swapLayer.id}] successfully!`);
                    });
                });
                // swapLayer.zIndex = targetLayer.zIndex;
                // targetLayer.zIndex = swap;
            });
        });
    })
}

function GetLayerById(layerId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `SELECT _id as id, name, createdAt, zIndex, character FROM layer WHERE id = '${layerId}'`;
            db.get(sql, (err, layer) => {
                if (err) reject(err);
                resolve(layer);
            });
        });
    });
}

function GetLayerByZIndex(form) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `SELECT _id as id, name, createdAt, zIndex, character FROM layer WHERE zIndex = '${form.zIndex}' AND character = '${form.character}'`;
            db.get(sql, (err, layer) => {
                if (err) reject(err);
                resolve(layer);
            });
        });
    });
}

function UpdateLayerZIndex(form) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`UPDATE layer SET zIndex = '${form.zIndex}' WHERE _id = '${form.layer.id}' AND character = '${form.layer.character}'`, (err, layer) => {
                if (err) reject(err);
                resolve(`Updated zIndex of layer [${form.layerId}] with value [${form.zIndex}]`);
            });
        });
    });
}

function GetArticleById(id) {
    console.log(`Getting article: [${id}]`);
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `SELECT _id as id, name, text, imagePath, comp FROM article WHERE id = '${id}'`;
            db.get(sql, (err, char) => {
                if (err) reject(err);
                resolve(char);
            });
        });
    });
}

function CreateArticle(form) {
    return new Promise((resolve, reject) => {
        console.log(form.image);
        if (!form.image) reject('Invalid form');
        if (form.image) db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO article (
                    _id,
                    name,
                    text,
                    imagePath,
                    comp
                )
                VALUES (
                    $id,
                    $name,
                    $text,
                    $imagePath,
                    $comp
                )`
            );
            let artId = uniqid('art_');
            stmt.run({
                $id: artId,
                $name: form.name,
                $text: form.text,
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
            db.all(`SELECT _id as id, name, text, imagePath FROM article WHERE comp = '${compId}'`, (err, chars) => {
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
        if (form.artId) db.serialize(() => {
            let stmt = db.prepare(
                `INSERT INTO character_article (
                    _id,
                    positionX,
                    positionY,
                    scale,
                    character,
                    article,
                    layer
                )
                VALUES (
                    $id,
                    $positionX,
                    $positionY,
                    $scale,
                    $character,
                    $article,
                    $layer
                )`
            );
            let charLyr = uniqid('chrlr_');
            stmt.run({
                $id: charLyr,
                $positionX: form.positionX,
                $positionY: form.positionY,
                $scale: 15,
                $character: form.charId,
                $article: form.artId,
                $layer: form.layerId
            });
            stmt.finalize();
            resolve(`Article [${form.artId}] assigned to [${form.charId}]  on layer [${form.layerId}] successfully!`);
        });
    });
}

function UpdateCharacterLayerPosition(form) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`UPDATE character_article SET positionX = '${form.posX}', positionY = '${form.posY}' WHERE _id = '${form.id}'`, (err, char) => {
                if (err) reject(err);
                resolve(`Updated position of character_article [${form.id}] with position [${form.posX}, ${form.posY}]`);
            });
        });
    });
}

function UpdateCharacterLayerScale(form) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`UPDATE character_article SET scale = '${form.scale}' WHERE _id = '${form.charArtId}'`, (err, char) => {
                if (err) reject(err);
                resolve(`Updated scale of character_article [${form.charArtId}] to: [${form.scale}]`);
            });
        });
    });
}

function ResetCharacterLayerByCharArtId(charArtId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all(`UPDATE character_article SET scale = 15, positionX = '2', positionY = '350' WHERE _id = '${charArtId}'`, (err, char) => {
                if (err) reject(err);
                resolve(`Reset position and scale of character_article [${charArtId}] to defaults`);
            });
        });
    });
}

function GetAssignedArticlesByCharacterId(charId) {
    return new Promise((resolve, reject) => {
        console.log(`Getting assigned articles of char: [${charId}]`);
        db.serialize(() => {
            db.all(`SELECT 
                    _id as id, 
                    positionX, 
                    positionY, 
                    scale,
                    character, 
                    article, 
                    layer 
                    FROM character_article WHERE character = '${charId}'`, (err, chars) => {
                if (err) reject(err);
                resolve(chars);
            });
        });
    });
}

function DeleteCompendiumById(id) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            DeleteCharactersByCompId(id).then(() => {
                DeleteArticlesByCompId(id).then(() => {
                    let sql = `DELETE FROM comp WHERE _id = '${id}'`;
                    db.all(sql, (err) => {
                        if (err) reject(err);
                        resolve(`Deleted compendium [${id}]`);
                    });
                });
            });
        });
    });
}

function DeleteCharactersByCompId(compId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            GetCharactersByCompId(compId).then((chars) => {
                Promise.all(chars.map(char => {
                    Promise.all([
                        DeleteLayersByCharId(char.id),
                        DeleteCharArtsByCharId(char.id)
                    ]);
                })).then(() => {
                    let sql = `DELETE FROM character WHERE comp = '${compId}'`;
                    db.all(sql, (err) => {
                        if (err) reject(err);
                        resolve(`Deleted characters from comp: [${compId}]`);
                    });
                });
            });
        });
    });
}

function DeleteCharacterById(charId) {
    return new Promise((resolve, reject) => {
        Promise.all([
            DeleteLayersByCharId(charId),
            DeleteCharArtsByCharId(charId)
        ]).then(() => {
            let sql = `DELETE FROM character WHERE _id = '${charId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted character: [${charId}]`);
            });
        });

    });
}

function DeleteLayersByCharId(charId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `DELETE FROM layer WHERE character = '${charId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted layers of character: [${charId}]`);
            });
        });
    });
}

function DeleteCharArtsByCharId(charId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `DELETE FROM character_article WHERE character = '${charId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted charArts of character: [${charId}]`);
            });
        });
    });
}

function DeleteArticlesByCompId(compId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            GetArticlesByCompId(compId).then((articles) => {
                Promise.all(articles.map(article => {
                    DeleteCharArtsByArticleId(article.id);
                })).then(() => {
                    let sql = `DELETE FROM article WHERE comp = '${compId}'`;
                    db.all(sql, (err) => {
                        if (err) reject(err);
                        resolve(`Deleted articles from comp: [${compId}]`);
                    });
                });
            });
        });
    });
}

function DeleteArticleById(artId) {
    return new Promise((resolve, reject) => {
        DeleteCharArtsByArticleId(artId).then(() => {
            let sql = `DELETE FROM article WHERE _id = '${artId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted article: [${artId}]`);
            });
        });

    });
}

function DeleteCharArtsByArticleId(artId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `DELETE FROM character_article WHERE article = '${artId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted charArts of article: [${artId}]`);
            });
        });
    });
}

function DeleteLayerById(lyrId) {
    return new Promise((resolve, reject) => {
        DeleteCharArtsByLayerId(lyrId).then(() => {
            let sql = `DELETE FROM layer WHERE _id = '${lyrId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted article: [${lyrId}]`);
            });
        });

    });
}

function DeleteCharArtsByLayerId(lyrId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let sql = `DELETE FROM character_article WHERE layer = '${lyrId}'`;
            db.all(sql, (err) => {
                if (err) reject(err);
                resolve(`Deleted charArts of layer: [${lyrId}]`);
            });
        });
    });
}


//#endregion