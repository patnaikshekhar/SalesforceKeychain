'use strict';

// Electron related imports
const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;  
const AutoLaunch = require('auto-launch');

// Used as the Data Storage mechanism
const Datastore = require('nedb');
const db = new Datastore({ filename: `${__dirname}/data.db`, autoload: true });

// Used for login
const openWindow = require('./openWindow');

// Get Settings
const Settings = require('./settings');

let appIcon = null;
let addAccountPopup = null;

// Initialize the Application
function initialize() {
  // Create the tray icon
  appIcon = new Tray(`${__dirname}/logo.png`);
  appIcon.setToolTip('This is my application.');
  
  createMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', initialize);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function updateLastAccessed(accounts, id) {
    
    let accountsUpdated = accounts.map((acc) => {
        if (acc.id == id) {
            acc.lastAccessed = Date.now();
        } 
        
        return acc;
    });
    
    //accountsUpdated.sort((a1, a2) => a2.lastAccessed - a1.lastAccessed);
    
    insertAccounts(accountsUpdated, () => {});
}

function createMenu() {
    // Get the list of items from the store
    refreshAccounts((err, docs) => {
        
        Settings.getAllSettings((settings) => {
            var storeMenuItems = docs.map(doc => ({
                label: doc.name,
                type: 'radio',
                click: () => {
                    openWindow(doc.url, doc.username, doc.password);
                    updateLastAccessed(docs, doc.id);
                }
            }));
            
            // Concatanate the fixed items
            var menuItems = storeMenuItems.concat([
                {
                    type: 'separator',
                    label: undefined
                },
                {
                    label: 'Manage Accounts',
                    type: undefined,
                    click: () => {
                        // Show Add Accounts screen
                        if (!addAccountPopup) {
                            addAccountPopup = new BrowserWindow({ width: 600, height: 600, show: false });
                            addAccountPopup.loadURL(`file://${__dirname}/index.html`);    
                            addAccountPopup.on('closed', function() {
                                addAccountPopup = null;
                            });
                        } 
                        
                        addAccountPopup.show();
                        //addAccountPopup.webContents.openDevTools();
                    }
                },
                {
                    label: 'Start when Computer boots',
                    type: 'checkbox',
                    checked: settings.AutoLaunch ? true : false,
                    click: (e) => {
                        
                        //Set Auto Launch
                        var appLauncher = new AutoLaunch({
                            name: 'Salesforce Keychain'
                        });
                        
                        if (!settings.AutoLaunch) {
                            appLauncher.enable((err) => {
                                if (!err) {
                                    settings = Object.assign(settings, { AutoLaunch: true} )
                                    Settings.setSettings(settings, () => {});  
                                }
                            }); 
                        } else {
                            appLauncher.disable((err) => {
                                if (!err) {
                                    settings = Object.assign(settings, { AutoLaunch: false} )
                                    Settings.setSettings(settings, () => {});  
                                }
                            });
                        }
                        
                        
                        // Set Setting
                    }
                }
            ]);
            
            let contextMenu = Menu.buildFromTemplate(menuItems);
            
            appIcon.setContextMenu(contextMenu);      
        });
              
    });
    
}

// Refreshes the accounts and calls the callback
function refreshAccounts(callback) {
    db.find({}).sort({ lastAccessed: -1 }).exec((err, docs) => {
        callback(err, docs);
    });
}

// Insert Account into Database
function insertAccounts(doc, callback) {
    
    db.remove({}, {multi: true}, (err) => {
        db.insert(doc, function (err, newDoc) {
            callback(err);
            
            // Refresh Menu
            createMenu();
        });
    });
}

// Handle Set in database message
ipc.on('putDB', function (event, args) {
    
    // Actual document to be inserted
    let doc = args.doc;
    
    // Request Id
    let id = args.id;
    
    // Insert into database and send event back to sender
    insertAccounts(doc, (err) => {
        // Send back done
        event.sender.send('putDBCompleted', {
            error: err,
            id: id
        });
    });
});

// Handle Get from database message
ipc.on('getDB', function (event, args) {
    
    // Request Id
    let id = args.id;
    
    // Find in database and send documents back to sender
    refreshAccounts((err, docs) => {
        event.sender.send('getDBCompleted', {
            err: err,
            docs: docs,
            id: id
        });    
    });
});

// Handle open window message
ipc.on('openWindow', function (event, args) {
    // Find in database and send documents back to sender
    openWindow(args.url, args.username, args.password);
});

app.on('activate', function () {});
