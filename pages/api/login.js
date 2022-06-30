import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nc from "next-connect";
import { connectToDatabase } from "../../utils/db";
import cookie from "cookie";

const handler = nc();
async function login(req, res) {
  const { password, email } = req.body;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.passsword)) {
      throw new Error("Invalid Credentials son");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("foodsToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 9000000,
        sameSite: "strict",
      })
    );

    res.send({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
}
handler.post(login);
export default handler;
