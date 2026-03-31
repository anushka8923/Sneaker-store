import Cart from "../models/Cart.js";


// ✅ ADD TO CART
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });

        // create cart if not exist
        if (!cart) {
            cart = new Cart({
                user: userId,   // ✅ IMPORTANT
                items: [{ product: productId, quantity: quantity || 1 }]
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity || 1;
            } else {
                cart.items.push({
                    product: productId,
                    quantity: quantity || 1
                });
            }
        }

        await cart.save();

        res.json({
            message: "Product added to cart",
            cart,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// ✅ GET CART (by userId)
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId })
            .populate("items.product");

        res.json(cart);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// ✅ REMOVE ITEM
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.json({
            message: "Item removed",
            cart,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// ✅ CLEAR CART
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];

        await cart.save();

        res.json({
            message: "Cart cleared",
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


// ✅ UPDATE CART ITEM
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        item.quantity = quantity;

        await cart.save();

        res.json({
            message: "Cart updated",
            cart,
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

