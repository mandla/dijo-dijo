import { useState } from "react";
import Navbar from "../../components/navbar";
import { connectToDatabase } from "../../utils/db";
import Tabs from "../../components/tabs";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./../../components/map"), { ssr: false });
export default function Restaurant({ data }) {
  const keys = Array.from(new Set(Object.keys(data.menu)));
  const [current, setCurrent] = useState(keys[0]);

  return (
    <div className="box">
      <Navbar title={data.name} />
      <div className="item-tray">
        <div className="tray-img">
          <img src={data.thumb} alt="thumb" />
        </div>
        <div className="tray-meta">
          <p>{data.name}</p>
          <p>{data["data-location"].address}</p>
          <p>
            <span>
              {parseFloat(data.user_rating.aggregate_rating).toFixed(1)}
            </span>
            <span>
              {Array.from(
                new Array(
                  Math.round(parseFloat(data?.user_rating?.aggregate_rating))
                ),
                () => (
                  <span
                    className="fa fa-star star-checked"
                    key={Math.random() * Math.random()}
                  ></span>
                )
              ).map((i) => i)}
              {Array.from(
                new Array(
                  5 -
                    Math.round(parseFloat(data?.user_rating?.aggregate_rating))
                ),
                () => (
                  <span
                    className="fa fa-star"
                    key={Math.random() * Math.random()}
                  ></span>
                )
              ).map((i) => i)}
            </span>
            <span>({data.user_rating.votes})</span>
          </p>
        </div>
      </div>
      <Map data={data["data-location"]} />
      <div
        className="slider"
        style={{
          gridTemplateColumns: `repeat(${keys.length}, 100px)`,
        }}
      >
        {keys.map((k) => (
          <div
            key={k}
            className={`slide ${k === current && "selected"}`}
            onClick={(e) => {
              setCurrent(k);
            }}
          >
            {k}
          </div>
        ))}
      </div>
      <Tabs
        items={data.menu[current]}
        place={{
          name: data.name,
          id: data._id,
          location: data["data-location"],
        }}
      />
    </div>
  );
}
export async function getServerSideProps(ctx) {
  const { params } = ctx;

  try {
    const { db } = await connectToDatabase();

    const data = await db
      .collection("restaurants")
      .findOne({ _id: params.rid });

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
      },
    };
  }
}
