const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const Web3Contract = require('./Web3Contract.js');
const url = require('url');
const path = require('path');

const contractAddress = "0x26A29A5783070efB0013266BC9f5147B029b4260"
const address = "0xce287098d0f683d7b2053e949b64e1433d223639"

const w3contract = new Web3Contract(contractAddress, address);

const menu = [
    {
        label: 'Route',
        submenu: [
            {
                label: 'Alerts',
                click() {
                    currentSecondaryWindow = getSecondaryWindow('Create Route', 'views/alerts.html');
                }

            }

        ]
    }
]


if(process.env.NODE_ENV !== 'production') {
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
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    homeWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/home.html'),
        protocol: 'file',
        slashes: true
    }))


    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
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
            }

        }
    );
})

ipcMain.on('create_route', (event, routeParams) => {
    w3contract.createRoute(routeParams.sender, routeParams.receiver, routeParams.destinationLatitude, routeParams.destinationLongitude, routeParams.limitTemperature, routeParams.higherTemperature, address).then(
        (res) => {
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
                    }
                }
            );
        }
    )
})

ipcMain.on('change_destination', (event, data) => {
    w3contract.setNewDestination(id, data.destinationLatitude, data.destinationLongitude, address).then(
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
                    }
                }
            );
        }
    )
})


ipcMain.on('check_temperature', (event, temperature) => {
    w3contract.checkTemperature(temperature, id, address);
})

ipcMain.on('change_temperatures', (event, data) => {
    w3contract.setNewTemperatureValues(id, data.limitTemperature, data.higherTemperature, address).then(
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
                    }
                }
            );
        }
    )
})

ipcMain.on('get_alerts', (event, data) => {
    w3contract.getAlertList(address).then(
        (alerts) => {
            let alertList = [];
            let date;
            for (var i = 0; i < alerts.length; i++) {
                date = new Date(parseInt(alerts[i].timestamp*1000));
                date = date.toLocaleString("es");
                alertList.push({
                    date: date,
                    registeredTemperature: alerts[i].registeredTemperature,
                    manager: alerts[i].manager
                })
            }
            currentSecondaryWindow.webContents.send('receive_alerts', alertList);
        }
    );
})

function getSecondaryWindow(title, filepath) {

    let secondaryWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: title,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
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
    return secondaryWindow;
}


