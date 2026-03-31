
import product from "../models/product.js";

//  CREATE PRODUCT (NO SEARCH HERE)
export const createProduct = async (req,res)=>{
    try{
        const newproduct = await product.create(req.body);

        res.json({
            message: 'Product created successfully',
            product : newproduct ,
        })

    }catch(error){
        res.status(500).json({message:'Server Error',error});
    }
};

//  GET PRODUCTS (SEARCH LOGIC HERE)
export const getProducts = async (req,res)=>{
    try{
        const { search, category } = req.query;

        let filter = {};

        //  search by title
        if(search){
            filter.title = { $regex: search, $options: 'i' };
        }

        //  filter by category
        if(category){
            filter.category = category;
        }

        const products = await product.find(filter).sort({ createdAt: -1});

        res.json(products);

    } catch (error){
        res.status(500).json({ message:'Server Error',error});
    }
};

// UPDATE
export const updateProduct = async (req,res)=>{
    try{
        const updated = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );

        res.json({
            message:'Product updated successfully',
            updated,
        });

    } catch (error){
        res.status(500).json({ message:'Server Error' , error});
    }
};

// DELETE
export const deleteProduct = async (req,res)=>{
    try{
        await product.findByIdAndDelete(req.params.id);

        res.json({ message : 'Product deleted successfully' });

    } catch (error){
        res.status(500).json({ message:'Server Error', error});
    }
};