import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10y",
    });
    return token;
  } catch (error) {
    // --- FIX ---
    // Is function ke paas 'res' (response) object nahin hai.
    // 'res.status(500).json(...)' likhne se server crash ho jaata.
    // Ab yeh error ko waapas controller (jaise auth.controller.js) mein bhej dega,
    // jo error ko sahi se handle karega.
    console.error(`gen token error ${error}`);
    throw new Error(`gen token error ${error.message}`);
    // --- END FIX ---
  }
};

export default genToken;
