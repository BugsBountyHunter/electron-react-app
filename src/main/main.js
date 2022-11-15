const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let trayWindow;
let aboutWindow;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:1234'); //parcel port 1234

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};
const createAboutWindow = () => {
  const aboutWindow = new BrowserWindow({
    width: 400,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, 'about.preload.js'),
    },
  });
  aboutWindow.loadURL(path.join(__dirname, '..', 'renderer', 'about.html'));
};

const createTrayWindow = () => {
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '..', '..', 'assets', 'logo.png')
  );
  trayWindow = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'About',
      type: 'normal',
      click: (menuItem, browserWindow, event) => {
        createAboutWindow();
      },
    },
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        //TODO:- Open settings page.
        createWindow();
      },
    },
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);

  trayWindow.setContextMenu(contextMenu);
  trayWindow.setToolTip('This is my application');
  trayWindow.setTitle('This is my title');
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  // When close all windows will add a tray  icon
  if (trayWindow === undefined) {
    console.log('Create a new Try Icon!');
    createTrayWindow();
  } else {
    console.log("Can't create new Tray icon because it already exits!");
  }

  //if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
