import { useState } from "react";
import axios from "axios";
export default function Search({ load }) {
  const [search, setSearch] = useState("");
  async function getResults(e) {
    e.preventDefault();
    if (search.trim().length > 0) {
      const {
        data: { docs },
      } = await axios.get(`/api/search?term=${search}`);

      load(docs);
    }
  }
  return (
    <div className="search-box">
      <form onSubmit={getResults}>
        <div className="search">
          <span className="search-icon">
            <i className="fa fa-search" aria-hidden="true"></i>
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search for a food or restaurant"
          />
          <span className="search-icon">
            <i className="fa fa-map" aria-hidden="true"></i>
          </span>
        </div>
      </form>
    </div>
  );
}
