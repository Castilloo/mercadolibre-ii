const { resolveObjectURL } = require('buffer');
const fs = require('fs');
const path = require('path');
const modelProducts = require('../data/modelProducts');

// const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
// const modelProducts = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const products = modelProducts.getProducts();

const controller = {
	index: (req, res) => {
		const lastVisited = products.filter(prod => prod.category == 'visited');
		const inSale = products.filter(prod => prod.category == 'in-sale');
		res.render('index', {lastVisited, inSale});
	},
	search: (req, res) => {
		const textToSearch = req.query.keywords;
		const result = [];
		products.forEach((product) => {
			let textProduct = product.name.toLowerCase();
			if (textProduct.includes(textToSearch.toLowerCase())){
				result.push(product);
			} 
		});
		// console.log(result);
		res.render('results', {result, textToSearch});
	},
};

module.exports = controller;
