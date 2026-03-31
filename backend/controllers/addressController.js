import Address from "../models/Address.js";


// ✅ ADD ADDRESS
export const addAddress = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      pincode,
      street,
      city,
      state,
      country,
      isDefault,
    } = req.body;

    // basic validation
    if (!userId || !fullName || !phone || !pincode || !street || !city || !state) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // if default → remove old default
    if (isDefault) {
      await Address.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      pincode,
      street,
      city,
      state,
      country: country || "India",
      isDefault: isDefault || false,
    });

    res.json({
      message: "Address added successfully",
      address,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// ✅ GET ALL ADDRESSES OF USER
export const getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await Address.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(addresses);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// ✅ GET SINGLE ADDRESS
export const getSingleAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(address);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// ✅ UPDATE ADDRESS
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDefault, userId } = req.body;

    // if default → remove old default
    if (isDefault) {
      await Address.updateMany(
        { user: userId },
        { isDefault: false }
      );
    }

    const updated = await Address.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Address updated successfully",
      updated,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// ✅ DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await Address.findByIdAndDelete(id);

    res.json({
      message: "Address deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};