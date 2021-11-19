const fs = require('fs');
const path = require('path');
const { render } = require('../app');

const modelProducts = require('../data/modelProducts');

// const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
// const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const products = modelProducts.getProducts();

//crear un ID
let createId = () => {
	let ID = 0;
	products.forEach((product, index) => {
		if(product.id == ++index) {
			ID++;
		};
	});
	return ID + 1;
}

//Buscar ID
// let findIndexProduct = (id) => {
// 	const idFound = products.findId(product => product.id == id);
// 	return idFound;
// }

//Convertir lista de productos a JSON y sobreescribirlos
// const convertAndSave = (products) => {
// 	const productsJSON = JSON.stringify(products, null, 4);
// 		//Escribir nueva lista de productos en JSON
// 	fs.writeFileSync(productsFilePath, productsJSON);
// }

//Controlador
const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {products});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const {id} = req.params;
		const productFound = products.find(prod => prod.id == id);
		res.render('detail', {productFound});
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		console.log(req.file);
		let image = '';
		(req.file) 
			? image = req.file.filename
			: image = 'default-image.png';

		const newProduct = {
			id: createId(),
			...req.body,
			image
		}
	
		modelProducts.createProduct(newProduct);

		res.redirect('/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;
		const productToEdit = products.find(prod => prod.id == id);
		res.render('product-edit-form', {productToEdit});
	},

	// Update - Method to update
	update: (req, res) => {
		const {id} = req.params;
		const oldProduct = products.find(product => product.id == id);
		const productEdited = {
			id: parseInt(id),
			...req.body,
			image: oldProduct.image
		}
		// console.log(productEdited)
		modelProducts.updateProduct(productEdited);

		res.redirect('/');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const {id} = req.params;
		console.log(id);
		modelProducts.deleteProduct(id);
		res.redirect('/');
	}
};

module.exports = controller;