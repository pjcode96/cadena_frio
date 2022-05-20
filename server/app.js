const express = require('express');
const path = require("path");   // LIbrary to manage path
const Web3Contract = require('./Web3Contract.js');



const contractAddress = "0x58bAA8CFB788Fbf64c1a6498d6dAe5ADC4B8EF7a"
const address = "0x5154bE9474673cC5C1134Ff021DEce8369ae9743"

const contract = new Web3Contract(contractAddress, address);

const port = 3000;
const app = express();

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
        }});

})


app.get('/about', (req, res) => {
    res.type('text/plain')
    res.send('Server Expresso ☕ About')
})


app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not found ☕_☕')
})


app.listen(port,() => console.log(`Deployed in port ${port} `))