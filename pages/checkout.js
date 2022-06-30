import { loadStripe } from "@stripe/stripe-js";
import Navbar from "./../components/navbar";
import { useCart } from "./../contexts/cartContext";

import { connectToDatabase } from "./../utils/db";
import { ObjectId } from "mongodb";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLIC_STRIPE);

export default function Checkout() {
  const context = useCart();

  const handleClick = async (event) => {
    const stripe = await stripePromise;

    const response = await fetch("/api/charge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: context.state.items }),
    });
    const session = await response.json();
    localStorage.setItem("cart", JSON.stringify([]));
    context.dispatch({ type: "load", items: [] });
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(errror);
    }
  };
  return (
    <div className="box">
      <Navbar title="Cart" />
      {context?.state?.items.length ? (
        <>
          {context?.state?.items.map((i) => {
            const dataName = i.price_data.product_data.name.split("@");
            return (
              <div
                key={
                  i.price_data.product_data.name + Math.random() * Math.random()
                }
              >
                <div className="tab">
                  <div className="tab-image">
                    <img
                      src={i.price_data.product_data.images[0]}
                      alt="Dummy"
                    />
                  </div>
                  <div className="tab-desc">
                    <span>
                      <small>{dataName[0]}</small>
                    </span>
                    <span>
                      <small>{dataName[1]}</small>
                    </span>
                    <span
                      style={{
                        color: "#fd6b01",
                      }}
                    >
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(i.price_data.unit_amount / 100, {
                        compactDisplay: "short",
                      })}
                    </span>
                  </div>
                  <div className="tab-range">
                    <span
                      style={{
                        color: "#fd6b01",
                      }}
                    >
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(i.price_data.unit_amount / 100, {
                        compactDisplay: "short",
                      })}{" "}
                      ({i.quantity})
                    </span>
                  </div>
                  <div className="tab-check">
                    <span>
                      <input
                        type="checkbox"
                        name="favorite"
                        id="favorite"
                        defaultChecked={true}
                        onChange={(e) => {
                          context.dispatch({
                            type: "delete",
                            name: i.price_data.product_data.name,
                            restaurant:
                              i.price_data.product_data.metadata.restaurant,
                          });
                        }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <button role="link" onClick={handleClick} className="checkout">
            Checkout
          </button>
        </>
      ) : (
        <h3>Cart is currently empty</h3>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const { db } = await connectToDatabase();
    const res = await db
      .collection("tempOrder")
      .findOne({ _id: ObjectId(ctx.query.id) });

    if (!res) {
      return {
        props: {},
      };
    }
    await db.collection("orders").insertMany(
      res.items.map((r) => ({
        ...r,
        lastModified: new Date().toISOString(),
        date: new Date(
          r.price_data.product_data.metadata.book +
            ":" +
            r.price_data.product_data.metadata.time
        ).toISOString(),
      }))
    );
    await db.collection("tempOrder").deleteOne({ _id: ObjectId(ctx.query.id) });
    return {
      props: {},
    };
  } catch (error) {
    console.log(error);
    return {
      props: {},
    };
  }
}
