import express from "express";
import { Product } from "../models/productModel.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

//CREATE NEW PRODUCT ROUTE
router.post('/', auth, async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.priceInCents ||
            !request.body.image ||
            !request.body.category
        ) {
            return response.status(400).send({
                message: 'Required fields are missing'
            });
        }

        const newProduct = {
            name: request.body.name,
            priceInCents: request.body.priceInCents,
            description: request.body.description,
            image: request.body.image,
            category: request.body.category
        };

        const product = await Product.create(newProduct);

        return response.status(201).send(product);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//GET ALL PRODUCTS ROUTE
router.get('/', async (request, response) => {
    try {
        const product = await Product.find({});

        return response.status(200).json({
            data: product
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//GET PRODUCT ROUTE
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const product = await Product.findById(id);

        return response.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//DELETE PRODUCT ROUTE
router.delete('/:id', auth, async (request, response) => {
    try {
        const { id } = request.params;
        
        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Product not found' });
        }

        response.status(200).json({ message: 'Product successfully deleted', deletedItem: result });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//UPDATE PRODUCT ROUTE
router.put('/:id', auth, async (request, response) => {
    try {
        if (
            !request.body.name ||
            !request.body.priceInCents ||
            !request.body.category
        ) {
            return response.status(400).send({
                message: 'Required fields are missing'
            });
        }

        const { id } = request.params;

        const result = await Product.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Product not found' });
        }

        return response.status(200).send({ message: 'Product updated' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;