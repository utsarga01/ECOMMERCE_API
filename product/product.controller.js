import express from "express";
import { isSeller } from "../middleware/authentication.middleware.js";
import validateReqBody from "../middleware/validation.req.body.js";
import { addProductValidationSchema } from "./product.validation.js";
import validateMongoIdFromParams from "../middleware/validate.mongo.id.js";
import Product from "./product.model.js";

const router = express.Router();

// *add product
router.post(
  "/product/add",
  isSeller,
  validateReqBody(addProductValidationSchema),
  (req, res) => {
    return res.status(201).send("Adding product...");
  }
);
router.delete(
  "product/delete/:id",
  isSeller,
  validateMongoIdFromParams,
  async (req, res) => {
    //extract product id from req.params
    const productId = req.params.id;
    //find product using productId
    const product = await Product.findById(productId);

    //if not product found, throw error
    if (!product) {
      return res.status(404).send({ message: "Product does not exist" });
    }

    //check if loggedInUserId s owner of the product
    //const isProductOwner = product.sellerId.equals(req.loggedInUserId);
    //const isProductOwner =String(product.sellerId) === String(sell)

    //check if logged InUSERid is owner of the product
    const isProductOwner = checkMongoIdsEquality(
      product.sellerId,
      req.loggedInUserId
    );

    //if not owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product" });
    }

    //delete product
    await Product.findByIdAndDelete(productId);

    //send res
    res.status(200).send({ message: "The Product is deleted successfully" });
  }
);
router.put(
  "/product/edit/:id",
  isSeller,
  validateMongoIdFromParams,
  validateReqBody(addProductValidationSchema),
  async (req, res) => {
    //extract product id from req params
    const productId = req.params.id;

    //find product using product id
    const product = await Product.findOne({ _id: productId });

    //if not product, throw error
    if (!product) {
      return res.status(404).send({ message: "Product doesnot exist" });
    }

    //check product ownership
    const isProductOwner = checkMongoIdsEquality(
      product.sellerId,
      req.loggedInUserId
    );

    // if not product owner, throw error
    if (!isProductOwner) {
      return res
        .status(403)
        .send({ message: "You are not owner of this product" });
    }

    //extract new values from req.body
    const newValues = req.body;

    //edit product
    // await Product.updateOne(
    //   { _id: productId },
    //   {
    //     $set: { ...newValues },
    //   }
    // );

    //send res
    await Product.findByIdAndUpdate(productId, newValues);
    return res.status(200).send({ message: "Product is edited successfully" });
  }
);
