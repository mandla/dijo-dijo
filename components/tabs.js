import { useRef, useState } from "react";
import { useCart } from "./../contexts/cartContext";
import { useAuth } from "./../contexts/authContext";

const dates = [];
for (let x = 9; x < 22; x++) {
  dates.push(`${x}:00`, `${x}:30`);
}

export default function Tabs({ items, place }) {
  const cartContext = useCart();
  const authContext = useAuth();

  const updateState = (item, formObj, val) => {
    cartContext.dispatch({
      type: "add",
      item: {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} @ ${place.name} @${place.location.address}`,
            images: [`${item.image}`],
            metadata: {
              creator: authContext.state.user._id,
              ...formObj,
              restaurant: place.id,
            },
          },
          unit_amount: Math.round(parseInt(item.price) * 100),
        },
        quantity: Math.round(parseInt(val)),
      },
    });
  };
  return (
    <div className="tabs">
      {items.map((i) => (
        <Tab
          i={i}
          updateState={updateState}
          key={i.name + Math.random() * Math.random()}
        />
      ))}
    </div>
  );
}

function Tab({ i, updateState }) {
  const [val, setVal] = useState("1");
  const [checked, setChecked] = useState(false);
  const [booked, setBooked] = useState(false);
  const dateRef = useRef(new Date());
  const [currDate, setCurrDate] = useState(
    dateRef.current.toISOString().split("T")[0]
  );
  return (
    <div>
      <div className="tab">
        <div className="tab-image">
          <img src={i.image} alt="Dummy" />
        </div>
        <div className="tab-desc">
          <span>{i.name}</span>
          <span
            style={{
              color: "#fd6b01",
            }}
          >
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(i.price, { compactDisplay: "short" })}
          </span>
        </div>
        <div className="tab-range">
          <span>
            <input
              type="range"
              name="num"
              id="num"
              min={1}
              step={1}
              onChange={(e) => {
                setVal(e.target.value);
              }}
              value={val}
              max="10"
              disabled={checked || booked}
            />
          </span>
          <span
            style={{
              color: "#fd6b01",
            }}
          >
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(parseFloat(val) * i.price, { compactDisplay: "short" })}
            ({val})
          </span>
        </div>
        <div className="tab-check">
          <span>
            <input
              type="checkbox"
              name="favorite"
              id="favorite"
              disabled={booked}
              checked={checked}
              onChange={(e) => setChecked((s) => !s)}
            />
          </span>
        </div>
      </div>
      {checked && (
        <div className="date">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formObj = Object.fromEntries(new FormData(e.target));

              updateState(i, formObj, val);

              setChecked(false);
              setBooked(true);
            }}
          >
            <div className="time">
              <div>
                <input
                  type="date"
                  name="book"
                  min={dateRef.current.toISOString().split("T")[0]}
                  max={
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  value={currDate}
                  onChange={(e) => setCurrDate(e.target.value)}
                  required
                />
              </div>
              <select name="time" id="time">
                {dates.map((d) => (
                  <option value={d} key={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span>
                <button>Book</button>
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
