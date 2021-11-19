const fs = require('fs');
const path = require('path');


const modelProducts = {
    isExist: function (id) {
        const isExist = this.getProducts().find((item) => item.id == id);
        return (isExist) ? true : false;
    },
    //***********************Read**************************
    getProducts: function()  {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "./productsDataBase.json"),{encoding: "utf8"}));
    },
    //**********************Create**************************
    createProduct: function (product) {
        const products = this.getProducts();
        if (this.isExist(product.id)) return "Ya existe";

        products.push(product);
        fs.writeFileSync(path.resolve(__dirname, "./productsDataBase.json"),
            JSON.stringify(products, null, 4),
            { encoding: "utf8" }
        );
        return "Creado";
    },
    //*************************Delete*********************
    deleteProduct: function (id) {
        if (!this.getProducts()) return 'La base de datos está vacía';

        if (this.isExist(id)) {
            const newDb = this.getProducts().filter(item => item.id != id);
            fs.writeFileSync(
                path.resolve(__dirname, "./productsDataBase.json"),
                JSON.stringify(newDb, null, 4),
                { encoding: "utf8" }
            );
            return ('Producto eliminado');
        } else {
            return 'El producto no se encuentra en la base de datos';
        }
    },
    //******************Update*************************
    updateProduct: function (product){
        const indiceBuscado = this.getProducts().findIndex(prod => prod.id == product.id);
        if(indiceBuscado<0) return "No existe este producto en la base de datos";

        let newDb = this.getProducts();
        newDb[indiceBuscado]=product;
        fs.writeFileSync(
            path.resolve(__dirname, "./productsDataBase.json"),
            JSON.stringify(newDb, null, 4),
            { encoding: "utf8" }
        );
        return "Actualizado con éxito"
    }
}

module.exports = modelProducts;

// console.log(modelProducts.deleteProduct(18));