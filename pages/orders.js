import Navbar from "./../components/navbar";
import { connectToDatabase } from "./../utils/db";
import Cookie from "next-cookies";

export default function Orders({ orders }) {
  return (
    <div className="box">
      <Navbar title="Orders" />
      {orders.map((i) => {
        const dataName = i.price_data.product_data.name.split("@");
        const orderDate = new Date(
          i.price_data.product_data.metadata.book +
            ":" +
            i.price_data.product_data.metadata.time
        );

        return (
          <div
            key={i.price_data.product_data.name + Math.random() * Math.random()}
          >
            <div className="tab">
              <div className="tab-image">
                <img src={i.price_data.product_data.images[0]} alt="Dummy" />
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
                <span>
                  <small>
                    {new Intl.DateTimeFormat("en-NG", {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(orderDate)}
                  </small>
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
                  <div
                    className="order-box"
                    style={{
                      backgroundColor: `${
                        orderDate.getTime() > Date.now()
                          ? "green"
                          : "var(--base-orange)"
                      }`,
                    }}
                  ></div>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { foodsUser } = Cookie(ctx);
  try {
    const { db } = await connectToDatabase();
    const orders = await db
      .collection("orders")
      .aggregate([
        {
          $match: {
            "price_data.product_data.metadata.creator": foodsUser._id,
          },
        },
        {
          $sort: { date: -1 },
        },
      ])
      .toArray();
    return {
      props: {
        orders: JSON.parse(JSON.stringify(orders)),
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
}
