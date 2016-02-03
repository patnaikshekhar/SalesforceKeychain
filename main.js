'use strict';

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;

// Initialize the Application
function initialize() {
  
  // Create the tray icon
  let appIcon = new Tray(`${__dirname}/logo.png`);
  
  // TODO: Get the list of items from the store
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

app.on('activate', function () {});
