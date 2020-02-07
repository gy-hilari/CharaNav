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
            "/post/comp",
            "/get/char/id",
            "/post/char",
            "/post/article",
            "/get/article",
            "/get/article/id",
            "/post/article/char",
            "/assign/article/char",
            "/get/char/article",
            "/get/artTag",
            "/post/artTag",
            "/get/article/artTag",
            "/post/article/artTag",
            "test"
        ];
        if (validChannels.includes(channel)) {
            promiseIpc.send(channel, data).then((res) => {func(res)});
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