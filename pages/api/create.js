import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nc from "next-connect";
import { connectToDatabase } from "../../utils/db";
import cookie from "cookie";
import { ObjectId } from "mongodb";

const handler = nc();
async function getUser(req, res) {
  const oldToken = req.cookies["foodsToken"];
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    const { db } = await connectToDatabase();
    const oldUser = await db
      .collection("users")
      .findOne({ _id: ObjectId(decoded.id) });
    if (!oldUser) {
      return res.status(400).send({ success: false, message: error.message });
    }
    return res.send({
      success: true,
      user: {
        _id: oldUser._id,
        email: oldUser.email,
        latitude: oldUser.latitude,
        longitude: oldUser.longitude,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
}
async function createUser(req, res) {
  const { password, email, latitude, longitude } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  try {
    const { db } = await connectToDatabase();
    const {
      ops: [user],
    } = await db
      .collection("users")
      .insertOne({ email, passsword: hash, latitude, longitude });

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
handler.post(createUser).get(getUser);
export default handler;
