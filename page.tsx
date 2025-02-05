"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const { push } = useRouter();
  const params = useParams();
  const url = "https://image.tmdb.org/t/p/w500";
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
  const [genreIds, setGenreIds] = useState<{ id: number; name: string }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [movies, setMovies] = useState([]);
  const searchParams = useSearchParams();
  const searchedID = searchParams.get("id");

  // Fetch genre data
  const getGenre = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?language=en`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
      });
      setGenreIds(response.data.genres);
      console.log(genreIds);
      
    } catch (err) {
      console.error(err);
    }
  };

 

  // Fetch movies based on selected genres
  const getMovie = async () => {
    try {
      const genreParam = selected.join(",");
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie?language=en&with_genres=${genreParam}&page=1`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`,
        },
      });
      setMovies(response.data.results);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getGenre();
    
  }, []);

  const select = (id: number) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    if (selected.length > 0) {
      getMovie();
    }
  }, [selected]);

  return (
    <div className="flex">
     <div className="bg-green-300 w-[40%] h-[50%]">
      {genreIds.map((genre) => (
        <div key={genre.id} className="w-[40%]">
          <Badge
            onClick={() => select(genre.id)}
            className={`cursor-pointer ${
              selected.includes(genre.id) ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {genre.name}
          </Badge>
        </div>
    
      ))}
      </div>
      {/* Movies List */}
      <div>
        {movies.map((movie: any) => (
          <div key={movie.id}>{movie.title}</div>
        ))}
      </div>
    </div>
  );
};

export default Page;
