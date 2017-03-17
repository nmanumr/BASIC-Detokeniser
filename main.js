const electron = require('electron');
const app = electron.app;
var BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

var mainWindow = null;

app.on('ready', function() {

    var eNotify = require('electron-notify');

    eNotify.setConfig({
        appIcon: null,
        borderRadius: 5,
        displayTime: 6000,
        animationSteps: 5,
        animationStepMs: 200,
        height: 100
    });

    // Initialize a new Electron window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 650,
        minHeight: 520,
        frame: false
    });

    // Load the index page
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, `/index.html`),
    //     protocol: 'file:',
    //     slashes: true
    // }));
    mainWindow.loadURL("http://localhost:4200/")

    // setTimeout(function() {
    //     eNotify.notify({ title: 'Notification title', text: 'Some text' });
    // }, 6000);
});