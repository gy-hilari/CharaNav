const { contextBridge, ipcRenderer } = require("electron");
const promiseIpc = require('electron-promise-ipc');

contextBridge.exposeInMainWorld(
    "api", {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = [
            "toMain",
            "/get/comp",
            "/post/comp"
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    promise: (channel, data, func) => {
        let validChannels = [
            "toMain",
            "/get/comp",
            "/get/comp/id",
            "/get/comp/char",
            "/get/comp/article",
            "/post/comp",
            "/delete/comp",
            "/put/comp/name",
            "/get/char/id",
            "/get/char/layer",            
            "/post/char",
            "/put/char/name",
            "/delete/char",
            "/post/article",
            "/delete/article",
            "/get/article",
            "/get/article/id",
            "/put/article/name",
            "/put/article/text",
            "/post/article/char",
            "/assign/article/char/layer",
            "/delete/article/char/layer",
            "/get/char/article",
            "/get/artTag",
            "/post/artTag",
            "/get/article/artTag",
            "/post/article/artTag",
            "/post/layer",
            "/delete/layer",
            "/get/imageDir",
            "/put/char/layer/pos",
            "/put/char/layer/scale",
            "/put/char/layer/reset",
            "/put/layer/swap",
            "/put/layer/name",
            "test"
        ];
        if (validChannels.includes(channel)) {
            promiseIpc.send(channel, data).then((res) => { func(res) });
            // ADD CATCH ROUTE TO PROCESS FRONT-END VALIDATION!!!
        } else {
            console.log(`[${channel}] is an invalide route!`);
        }
    },
    receive: (channel, func) => {
        let validChannels = [
            "fromMain",
            "/get/comp"
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
}
);