var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

// I delete the sensitive data
mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""

})

var app = express();

app.use(express.static('public'));
app.use(express.static('views'));
app.set('view engine', 'ejs');

app.listen(8888);
app.use(bodyParser.urlencoded({ extended: true }));



app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));




// localhost:8080
app.get('/', function(req, res) {

    var con = mysql.createConnection({
        host: "",
        user: "",
        password: "",
        database: ""
    })

    con.query("Select * from produto", (err, result) => {
        res.render('pages/index', { result: result });
    })

});

function calculoTotal(cart, req) {
    total = 0;
    for (let i = 0; i < cart.lenght; i++){

        if (cart[i].desconto) {
            total = total + (cart[i].desconto * cart[i].quantity);
        } else {
            total = total + (cart[i].preco * cart[i].quantity);

        }
    }
    req.session.total = total;
    return total;

}


function isProductInCart(cart, id_produto) {
    for (let i = 0; i < cart.length; i++){
        if(cart[i].id_produto == id_produto){
            return true;
        }
    }
    return false;
    }

    app.post('/add_to_card', function(req, res) {

        var id_produto = req.body.id_produto;
        var Nome = req.body.Nome;
        var preco = req.body.preco;
        var desconto = req.body.desconto;
        var quantity = req.body.quantity;
        var image = req.body.image;
        var produto = { id_produto: id_produto, Nome: Nome, preco: preco, desconto: desconto, quantity: quantity, image: image };

        if (req.session.cart) {
            var cart = req.session.cart;

            if (!isProductInCart(cart, id_produto)) {
                cart.push(produto);
            }
        } else {

            req.session.cart = [produto];
            var cart = req.session.cart;
        }

        // conta total
        calculoTotal(cart, req);

        // retorno pra pg de cart
        res.redirect('/cart');

    });

    app.get('/cart', function (req, res){

        var cart = req.session.cart;
        var total = req.session.total;
        res.render('pages/cart', { cart: cart, total: total });


    }); 



app.post('/remove_produto', function(req, res) {

    var id_produto = req.body.id_produto;
    var cart = req.session.cart;

    for (let i = 0; i < cart.lenght; i++) {
        if (cart[i].id_produto == id_produto) {
            cart.splice(cart.indexOf(i), 1);
        }
    }

    // calculo dnovo
    calculoTotal(cart, req);
    // retorno pra pg de cart
    res.redirect('/cart');
});

app.post('/edit_product_quantity', function(req, res) {
    var id_produto = req.body.id_produto;
    var quantity = req.body.quantity;
    var increase_btn = req.body.increase_product_quantity;
    var decrease_btn = req.body.decrease_product_quantity;
    
    var cart = req.session.cart;

    if (increase_btn) {
        for (let i = 0; i < cart.lenght; i++) {
            if (cart[i].id_produto == id_produto) {
                if (cart[i].quantity > 0) {
                    cart[i].quantity = parseInt(cart[i].quantity) + 1;

                }
            }
        }

    }


    if (decrease_btn) {
        for (let i = 0; i < cart.lenght; i++) {
            if (cart[i].id_produto == id_produto) {
                if (cart[i].quantity > 1) {
                    cart[i].quantity = parseInt(cart[i].quantity) - 1;

                }
            }
        }

    }

    // calculo dnovo
    calculoTotal(cart, req);
    // retorno pra pg de cart
    res.redirect('/cart');

})