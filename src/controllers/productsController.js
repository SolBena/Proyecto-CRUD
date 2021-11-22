const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//defino logica para que se efectue la cuenta matematica para que aparezca el precio final con descuento.
const finalPrice = (price, discount) => Math.round(price - (price * (discount / 100)));

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', { products, toThousand })
	},

	// Detail - Detail from one product
	//en la variable productDetail busco el producto con el id que me vino por parametro
	detail: (req, res) => {
		let productDetail = products.find(element => element.id === +req.params.id)
		res.render('detail', { productDetail, toThousand, finalPrice })
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Create -  Method to store
	//con req.body leo lo que me llega por el formulario
	//con product.id me aseguro que id sea uno mas que el id del ultimo producto
	//con products.push y fs.writeFileSync lo agrego al final del json de la base de datos
	//con res.redirect lo redirecciono a la vista de todos los productos una vez que se haya cargado.
	store: (req, res) => {
		let product = req.body
		product.id = products.length + 1
		product.image = req.file ? req.file.filaname : 'default-image.png'

		products.push(product)

		fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2))

		res.redirect('/products')
	},

	// Update - Form to edit
	//con products.find busco el id que me llega como parametro
	edit: (req, res) => {
		let product = products.find(element => element.id === +req.params.id)
		res.render('product-edit-form', {product})
	},
	// Update - Method to update
	//en la variable productUpdate busco el producto que me llega por parametro
	//en el if 
	update: (req, res) => {
		let productUpdate = products.find(element => element.id === +req.params.id )
		let { name , price , discount , category, description} = req.body
		if (productUpdate){
			productUpdate.name = name
			productUpdate.price = +price
			productUpdate.discount = +discount
			productUpdate.category = category
			productUpdate.description = description

			productUpdate.image = req.file ? req.file.filaname : 'default-image.png'

			fs.writeFileSync(productsFilePath, JSON.stringify(products))

			res.redirect('/products')
		} else {
		res.redirect('/')
			}
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		products = products.filter(p => p.id !== +req.params.id)
		fs.writeFileSync(productsFilePath, JSON.stringify(products))
		res.redirect('/')
	}
};

module.exports = controller;