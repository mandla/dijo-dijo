import nc from "next-connect";
import stripeInit from "stripe";
import { connectToDatabase } from "../../utils/db";

const stripe = stripeInit(process.env.PRIVATE_STRIPE);
const handler = nc();

async function checkout(req, res) {
  const { items } = req.body;

  try {
    const { db } = await connectToDatabase();
    const data = await db.collection("tempOrder").insertOne({ items });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url:
        "https://local-foods.vercel.app/checkout?id=" + data.insertedId,
      cancel_url: "https://local-foods.vercel.app/checkout",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
}
export default handler.post(checkout);
