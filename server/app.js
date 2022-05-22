const express = require('express');
const path = require("path");   // LIbrary to manage path
const Web3Contract = require('./Web3Contract.js');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const contractAddress = "0x5A2C34F8d08b3bAdF6e04931F08bF68441D647d7"
const address = "0x5154bE9474673cC5C1134Ff021DEce8369ae9743"

const w3contract = new Web3Contract(contractAddress, address);

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Here we associate handlebars

const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

// app.use(express.static(path.join(__dirname, '../client/index.html')));
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


app.get('/', (req, res) => {
    res.render('home', {
        post: {
            author: 'Janith Kasun',
            image: 'https://picsum.photos/500/500',
            comments: []
        }
    });

})


app.get('/current-manager', (req, response) => {

    return w3contract.getCurrentRouteManager(0, address).then((res) => {
        console.log(res)
        response.end(res);
        //response.render('home', { managerAddress: res});
    });

    // return w3contract.contract.methods.getCurrentRouteManager(0).call({ from: address })
    // .then((res) => {
    //         console.log("The current manager's address is: " + res);
    //         return res;
    //     })
})


app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not found ☕_☕')
})


app.listen(port, () => console.log(`Deployed in port ${port} `))