const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const app = electron.app;
const { ipcMain } = require('electron');
const BrowserWindow = electron.BrowserWindow;
const fs = require('fs');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const lmdb = require('node-lmdb');
const uniqid = require('uniqid');
const promiseIpc = require('electron-promise-ipc');


let mainWindow;

//#region  INITIALIZE LMDB ENVIRONMENT
const dir = "/mydata";
if (!fs.existsSync(__dirname + dir)) {
    fs.mkdirSync(__dirname + dir);
}

let mapSize = 2 * 1024 * 1024 * 1024;
let env = new lmdb.Env();
env.open({
    path: __dirname + dir,
    mapSize: mapSize, // maximum database size
    maxDbs: 3
});
const dbi = env.openDbi({
    name: "charaNavDB",
    create: true // will create if database did not exist
})
//#endregion

//#region  CREATE ELECTRON WINDOW
function createWindow() {
    let dir = './mydata';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    let state = windowStateKeeper({
        defaultWidth: 800, defaultHeight: 600
    })

    console.log(path.join(__dirname, '/preload.js'));
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

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', () => {
    createWindow();
    CheckOrCreateModels();
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

ipcMain.on('request-mainprocess-action', (event, arg) => {
    console.log(
        arg
    );
});

function CheckOrCreateModels() {
    let txn = env.beginTxn();
    let Compendiums = txn.getString(dbi, "Compendiums");
    let Characters = txn.getString(dbi, "Characters");
    let Articles = txn.getString(dbi, "Articles");
    let Tags = txn.getString(dbi, "Tags");
    if (Compendiums === null) txn.putString(dbi, "Compendiums", "[]");
    if (Characters === null) txn.putString(dbi, "Characters", "[]");
    if (Articles === null) txn.putString(dbi, "Articles", "[]");
    if (Tags === null) txn.putString(dbi, "Tags", "[]");
    txn.commit();
}

// ipcMain.on('/get/comp', (event, arg) => {
//     console.log(arg);
//     let txn = env.beginTxn();
//     let allComps = txn.getString(dbi, "Compendiums");
//     event.sender.send("/get/comp", JSON.parse(allComps));
//     txn.commit();
// });

promiseIpc.on('/get/comp', () => {
    let txn = env.beginTxn();
    let allComps = txn.getString(dbi, "Compendiums");
    txn.commit();
    return JSON.parse(allComps);
});

// ipcMain.on('/post/comp', (event, form) => {
//     console.log(form);
//     let txn = env.beginTxn();
//     // console.log(JSON.parse(txn.getString(dbi, "Compendiums")));
//     let allComps = new Set(JSON.parse(txn.getString(dbi, "Compendiums")));
//     let compId = uniqid('cm-');
//     let newComp = {
//         id: compId,
//         type: 'comp',
//         name: form.name
//     };
//     allComps.add(compId);
//     txn.putString(dbi, "Compendiums", JSON.stringify([...allComps]));
//     txn.putString(dbi, compId, JSON.stringify(newComp));
//     event.sender.send("/get/comp", [...allComps]);
//     txn.commit();
// });

promiseIpc.on('/post/comp', (form) => {
    console.log(form);
    let txn = env.beginTxn();
    let allComps = new Set(JSON.parse(txn.getString(dbi, "Compendiums")));
    let compId = uniqid('cm-');
    let newComp = {
        id: compId,
        type: 'comp',
        name: form.name
    };
    allComps.add(compId);
    txn.putString(dbi, "Compendiums", JSON.stringify([...allComps]));
    txn.putString(dbi, compId, JSON.stringify(newComp));
    txn.commit();
    return [...allComps];
});

promiseIpc.on('test', () => {
    return "Testing IPC!!!";
})


//#endregion