"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Movie } from '@/types/movie-type';
import { Badge } from '@/components/ui/badge';
import { useRouter, useSearchParams } from 'next/navigation';

const Page = () => {
  const { push } = useRouter();
  const url = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
  const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;
  const searchParams = useSearchParams();
  const searchedID = searchParams.get("id");

  const [genre, setGenre] = useState<{ id: number; name: string }[]>([]);
  const [selected, Setselected] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  const getDATA = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?language=en`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`
        }
      });
      setGenre(response.data.genres);
      console.log(response.data.genres);
    } catch (err) {
      console.log(err);
    }
  };

  const getMovie = async (genreIDs: string) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie?language=en&with_genres=${genreIDs}`, {
        headers: {
          Authorization: `Bearer ${TMDB_API_TOKEN}`
        }
      });
      setMovies(response.data.results); 
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDATA();
  }, []);

  const handleclick = (id: number) => {
    const updated = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    Setselected(updated);

  
    const queryParams = new URLSearchParams();
    queryParams.set("id", updated.join(","));
    const path = queryParams.toString();
 //   push(`/Genrepage?${path}`);
 console.log(movies);
 

    
    getMovie(updated.join(","));
  };

  return (
    <div>
      <div>
        {genre.map((genre) => {
          return (
            <Badge key={genre.id} onClick={() => handleclick(genre.id)}>
              {genre.name}
            </Badge>
          );
        })}
      </div>

      <div>
        <h2>Movies</h2>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <img src={`${url}${movie.poster_path}`} alt={movie.title} />
         
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
