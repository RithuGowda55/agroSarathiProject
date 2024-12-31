import React, { useState, useEffect } from "react";
import { Tables } from "./components/Table/indexs";
import { Paginations } from "./components/Pagination/indexs";
import { Searchs } from "./components/Search/indexs";
import { Sorts } from "./components/Sort/indexs";
import { Filters } from "./components/Genre/indexs";
import AskOpenAI from "./components/AskOpenAI"; // Import the AskOpenAI component
import "./Apps.css";
import Back from "../common/back/Back";

const Govscheme = () => {
  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(13);
  const [filters, setFilters] = useState({
    state: "",
    cropType: "",
    incomeLevel: "",
    search: "",
  });
  const [sort, setSort] = useState({ by: "schemeName", order: "asc" });

  const [view, setView] = useState("home"); // State to manage views (home or AskOpenAI)

  const fetchSchemes = async () => {
    const response = await fetch(
      `http://localhost:8090/api/schemes?page=${page}&limit=${limit}&state=${filters.state}&cropType=${filters.cropType}&incomeLevel=${filters.incomeLevel}&search=${filters.search}&sortBy=${sort.by}&order=${sort.order}`
    );
    const data = await response.json();
    setSchemes(data.schemes);
    setTotal(data.total);
  };

  useEffect(() => {
    if (view === "home") fetchSchemes(); // Fetch schemes only on the home view
  }, [page, limit, filters, sort, view]);

  return (
    <div>
      <Back title='Government Scheme' />
      <header>
        {/* <h1>Government Schemes</h1> */}
        {/* Button to toggle views */}
        <button
          onClick={() => setView(view === "home" ? "ask-openai" : "home")}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {view === "home" ? "Ask OpenAI" : "Go Back"}
        </button>
      </header>

      {/* Conditional rendering based on the view state */}
      {view === "home" ? (
        <div>
          <div className="search-genre-container">
            <Searchs filters={filters} setFilters={setFilters} />
            <Filters
              filters={filters}
              setFilters={setFilters}
              setPage={setPage}
            />
          </div>
          <Sorts setSort={setSort} />
          <Tables schemes={schemes} />
          <Paginations
            total={total}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </div>
      ) : (
        <AskOpenAI />
      )}
      <br /><br />
    </div>
  );
};

export default Govscheme;
