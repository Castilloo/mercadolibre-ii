// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// ************ Controller Require ************
const productsController = require('../controllers/productsController');

//*************Create multer storage**************/
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename : function(req, file, cb){
        cb(null, `img-${Date.now()}${path.extname(file.originalname)}`);
    }});

    const upload = multer({
        storage,
        limits: {fieldSize: 2000000},
        fileFilter: (req, file, cb) => {
            if(file){
            const mimetype = /jpeg|gif|jpg|png/.test(file.mimetype);
            const extname = /jpeg|gif|jpg|png/.test(path.extname(file.originalname));
            (mimetype && extname) ? cb(null, true) : cb ('Error al subir archivo, debe tener un formato de imagen')
            } else {
                cb(null, true);
            }
        }
    }).single('image');

/*** GET ALL PRODUCTS ***/ 
router.get('/', productsController.index); 

/*** CREATE ONE PRODUCT ***/ 
router.get('/create', productsController.create); 
router.post('/', upload, productsController.store); 


/*** GET ONE PRODUCT ***/ 
router.get('/detail/:id', productsController.detail); 

/*** EDIT ONE PRODUCT ***/ 
router.get('/:id/edit', productsController.edit); 
router.put('/:id', productsController.update); 


/*** DELETE ONE PRODUCT***/ 
router.delete('/:id', productsController.destroy); 


module.exports = router;
