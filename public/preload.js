const { contextBridge, ipcRenderer } = require("electron");
const promiseIpc = require('electron-promise-ipc');
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
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
            "/post/comp",
            "test"
        ];
        if (validChannels.includes(channel)) {
            promiseIpc.send(channel, data).then((res) => {func(res)});
        }       
    },
    receive: (channel, func) => {
        let validChannels = [
            "fromMain",
            "/get/comp"
        ];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
}
);