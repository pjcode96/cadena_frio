const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');
const Web3Contract = require('./Web3Contract.js');
const url = require('url');
const path = require('path');
const { Router } = require('express');

const contractAddress = "0x9a420beAe19F55C4F02D7d3493C81114187B9Fb8"
const address = "0x5154bE9474673cC5C1134Ff021DEce8369ae9743"

const w3contract = new Web3Contract(contractAddress, address);
const menu = [
    {
        label: 'Route',
        submenu: [
            {
                label: 'Create Route',
                click() {
                    getSecondaryWindow('Create Route', 'views/create_route.html');
                }
            },
            {
                label: 'Get Route',
                click() {
                    getSecondaryWindow('Get Route', 'views/get_route.html');
                }
            }
        ]
    }
];


if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {})
}

let homeWindow;
let currentSecondaryWindow;
let route;
let id;

app.on('ready', () => {
    homeWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: 'Home',
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
    });

    homeWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/home.html'),
        protocol: 'file',
        slashes: true
    }))


    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
    homeWindow.webContents.openDevTools()
    homeWindow.on('closed', () => {
        app.quit();
    });

})

ipcMain.on('get_route', (event, routeId) => {
    id = routeId
    w3contract.getRouteData(routeId, address).then(
        (res) => {

            if (res) {
                route = {
                    routeId: routeId,
                    sender: res[0][0],
                    receiver: res[0][1],
                    destinationLatitude: res[0][2],
                    destinationLongitude: res[0][3],
                    currentManager: res[0][4],
                    sensor: {
                        limitTemperature: res[1][0],
                        higherTemperature: res[1][1]
                    }
                }

                homeWindow.webContents.send('receive_route', route);
                //currentSecondaryWindow.close();
            }

        }
    );
})

ipcMain.on('create_route', (event, routeParams) => {
    w3contract.createRoute(routeParams.sender,routeParams.receiver,routeParams.destinationLatitude,routeParams.destinationLongitude,routeParams.limitTemperature,routeParams.higherTemperature, address).then(
        (res) =>{
            id = res;
            w3contract.getRouteData(res, address).then(
                (res) => {
    
                    if (res) {
                        route = {
                            routeId: id,
                            sender: res[0][0],
                            receiver: res[0][1],
                            destinationLatitude: res[0][2],
                            destinationLongitude: res[0][3],
                            currentManager: res[0][4],
                            sensor: {
                                limitTemperature: res[1][0],
                                higherTemperature: res[1][1]
                            }
                        }
    
                        homeWindow.webContents.send('receive_route', route);
                        //currentSecondaryWindow.close();
                    }
    
                }
            )
        }
    );
})

ipcMain.on('change_manager', (event, data) => {
    w3contract.changeCurrentManager(data, id, address).then(
        () => {
            w3contract.getRouteData(id, address).then(
                (res) => {
        
                    if (res) {
                        route = {
                            routeId: id,
                            sender: res[0][0],
                            receiver: res[0][1],
                            destinationLatitude: res[0][2],
                            destinationLongitude: res[0][3],
                            currentManager: res[0][4],
                            sensor: {
                                limitTemperature: res[1][0],
                                higherTemperature: res[1][1]
                            }
                        }
        
                        homeWindow.webContents.send('receive_route', route);
                        //currentSecondaryWindow.close();
                    }
                }
            );
        }
    )
})

function getSecondaryWindow(title, filepath) {

    let secondaryWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: title,
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js')
        }
    })

    secondaryWindow.setMenu(null);

    secondaryWindow.loadURL(url.format({
        pathname: path.join(__dirname, filepath),
        protocol: 'file',
        slashes: true
    }));

    secondaryWindow.on('closed', () => {
        secondaryWindow = null;
    });
    secondaryWindow.webContents.openDevTools()
    return currentSecondaryWindow = secondaryWindow;
}


