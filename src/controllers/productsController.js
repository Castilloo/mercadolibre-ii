const fs = require('fs');
const path = require('path');
const { render } = require('../app');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

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
const convertAndSave = (products) => {
	const productsJSON = JSON.stringify(products, null, 4);
		//Escribir nueva lista de productos en JSON
	fs.writeFileSync(productsFilePath, productsJSON);
}

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

		console.log(newProduct);
		//Ingresar el ID de acuerdo el orden
		if (newProduct.id - 1 == products.length) {
			products.push(newProduct);
		} else {
			products.splice(newProduct.id - 1, 0, newProduct);
		}

		convertAndSave(products);

		res.send('Creado');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;
		const productToEdit = products.find(prod => prod.id == id);
		res.render('product-edit-form', {productToEdit});
	},
	// Update - Method to update
	update: (req, res) => {
		const productEdited = {
			...req.body,
		}
		const indexProduct = products.findIndex(product => product.id == req.params.id);
		products[indexProduct] = productEdited;

		convertAndSave(products);
		// res.send('Modificado');
		res.redirect('/');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const {id} = req.params;
		const productDelete = products.filter(product => product.id != id);
		console.log(productDelete);
		// res.send('Eliminado')
		convertAndSave(productDelete);
		res.redirect('/');
	}
};

module.exports = controller;