const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        let visited = products.filter(element => element.category === "visited")  
		let offer = products.filter(element => element.category ==="in-sale")
		
		res.render('index', {toThousand, visited, offer})
	},
	search: (req, res) => {
		const search = req.query.keywords.trim()
		if (search !== '') {
			const result = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
			res.render('results', {result, toThousand, search})
		} else {
			res.redirect('/products')
		}
	}
};

module.exports = controller;
