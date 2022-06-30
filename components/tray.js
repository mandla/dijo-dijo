import Link from "next/link";

export default function Tray({ items, title }) {
  return (
    <>
      <h4>{title}</h4>
      <div
        className="tray"
        style={{
          gridTemplateColumns: `repeat(${items.length}, 200px)`,
        }}
      >
        {items.map((i) => (
          <div className="item-tray" key={i?._id}>
            <div className="tray-img">
              <Link href={`/r/${i._id}`}>
                <a>
                  <img src={i?.featured_image} alt="featured" />
                </a>
              </Link>
            </div>
            <div className="tray-meta">
              <Link href={`/r/${i._id}`}>
                <a>
                  <p>{i?.name}</p>
                  <p>
                    <span>
                      {parseFloat(i?.user_rating?.aggregate_rating).toFixed(1)}
                    </span>
                    <span>
                      {Array.from(
                        new Array(
                          Math.round(
                            parseFloat(i?.user_rating?.aggregate_rating)
                          )
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
                            Math.round(
                              parseFloat(i?.user_rating?.aggregate_rating)
                            )
                        ),
                        () => (
                          <span
                            className="fa fa-star"
                            key={Math.random() * Math.random()}
                          ></span>
                        )
                      ).map((i) => i)}
                    </span>
                    <span> ({i?.user_rating?.votes})</span>
                  </p>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
