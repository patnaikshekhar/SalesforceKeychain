'use strict';

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
const Datastore = require('nedb');
const db = new Datastore({ filename: `${__dirname}/data.db`, autoload: true });
const ipc = require('ipc');

// Initialize the Application
function initialize() {
  
  // Create the tray icon
  let appIcon = new Tray(`${__dirname}/logo.png`);
  
  // Get the list of items from the store
  refreshAccounts((err, docs) => {
    var storeMenuItems = [
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio' },
        { label: 'Item4', type: 'radio' }
    ];
    
    // Concatanate the fixed items
    var menuItems = storeMenuItems.concat([
        {
            type: 'separator',
            label: undefined
        },
        {
            label: 'Add Account',
            type: undefined,
            click: () => {
                // TODO: Show Add Accounts screen 
            }
        }
    ]);
    
    let contextMenu = Menu.buildFromTemplate(menuItems);
    
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);      
  });
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

// Refreshes the accounts and calls the callback
function refreshAccounts(callback) {
    db.find({}, function(err, docs) {
        callback(err, docs);
    });
}

// Handle Set in database message
ipc.on('putDB', function (event, args) {
    // Actual document to be inserted
    let doc = args.doc;
    
    // Request Id
    let id = args.id;
    
    // Insert into database and send event back to sender
    db.insert(doc, function (err, newDoc) {
        event.sender.send('putDBCompleted', {
            error: err,
            id: id
        });
    });
});

// Handle Get from database message
ipc.on('getDBAll', function (event, args) {
    
    // Request Id
    let id = args.id;
    
    // Find in database and send documents back to sender
    refreshAccounts((err, docs) => {
        event.sender.send('putDBCompleted', {
            err: err,
            docs: docs,
            id: id
        });    
    });
});

app.on('activate', function () {});
