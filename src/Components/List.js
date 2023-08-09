import React, { useState } from "react";
import MovieCard from "./Moviecard";
import Pagination from "@mui/material/Pagination";
import { Stack } from "@mui/material";
import "./style.css";

export default function SearchMovie() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [minRating, setMinRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(5);

  const [sortByDateAsc, setSortByDateAsc] = useState(false);
  const [sortByRatingAsc, setSortByRatingAsc] = useState(false);

  const SearchMovies = async (e) => {
    e.preventDefault();
    console.log("submitting");

    var url = `https://api.themoviedb.org/3/search/movie?api_key=e8ccc676e299173067a80520c1fee405&query=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const finalData = data.results;
      setMovies(finalData.filter((each) => each.vote_average >= minRating));
    } catch (err) {
      console.log(err);
    }
  };
  const paginatelarge = (event, value) => {
    setCurrentPage(value);

    window.scrollTo({ top: 50, behavior: "smooth" });
  };

  const handleSort = () => {
    const sortedMovies = [...movies].sort((a, b) => {
      const releaseDateA = new Date(a.release_date);
      const releaseDateB = new Date(b.release_date);

      return setSortByDateAsc
        ? releaseDateA - releaseDateB
        : releaseDateB - releaseDateA;
    });

    setMovies(sortedMovies);
    setSortByDateAsc(!sortByDateAsc);
  };

  const handleSortByRating = () => {
    const sortedMovies = [...movies].sort((a, b) => {
      return  sortByRatingAsc
        ? a.vote_average - b.vote_average
        : b.vote_average - a.vote_average;
    });

    setMovies(sortedMovies);
    setSortByRatingAsc(!sortByRatingAsc);
  };

  const indexOfLast = currentPage * moviesPerPage;
  const indexOfFirst = indexOfLast - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <form className="form" onSubmit={SearchMovies}>
        <label className="label" htmlFor="query">
          Movie Name:
        </label>
        <input
          style={{ width: 500 }}
          className="input"
          type="text"
          name="query"
          placeholder="Search a Movie"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          className="input"
          type="number"
          name="minRating"
          placeholder="Filter by rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <button className="button" type="button" onClick={handleSort}>
          Date
        </button>
        <button className="button" type="button" onClick={handleSortByRating}>
          Rating 
        </button>

        <button className="button" type="submit">
          Search
        </button>
      </form>
      <div className="card-list">
        {currentMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
      <Stack
        sx={{ mt: { lg: "114px", xs: "70px" } }}
        mb="50px"
        alignItems="center"
      >
        {movies.length > 5 && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(movies.length / moviesPerPage)}
            page={currentPage}
            onChange={paginatelarge}
            size="large"
            className="pagination-large"
          />
        )}
      </Stack>
    </>
  );
}
