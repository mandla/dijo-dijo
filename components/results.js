import Link from "next/link";

export default function Result({ items }) {
  return (
    <div className="results">
      <p>Your search results ({items.length})</p>
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
                    <span className="fa fa-star star-checked"></span>
                    <span className="fa fa-star star-checked"></span>
                    <span className="fa fa-star star-checked"></span>
                    <span className="fa fa-star "></span>
                    <span className="fa fa-star "></span>
                  </span>
                  <span> ({i?.user_rating?.votes})</span>
                </p>
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
