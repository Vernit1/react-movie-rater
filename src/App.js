import React, { useState, useEffect } from 'react';
import './App.css';
import MovieList from './components/movie-list';
import MovieDetails from './components/movie-details';
import MovieForm from './components/movie-form';
import { useCookies } from 'react-cookie';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useFetch} from './hooks/useFetch';

function App() {

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [editMovie, setEditMovie] = useState(null);
  const [token, setToken, deleteToken] = useCookies(['mr-token']);
  const [data, loading, error] = useFetch();

  useEffect(() => {
    // console.log(data);
    setMovies(data);
  }, [data]);

  useEffect( () => {
    console.log(token);
    if(!token['mr-token']) window.location.href = '/'
  }, [token]);

  // const movieClicked = movie => {
  //   setSelectedMovie(movie);
  // }
  const loadMovie = movie => {
    setSelectedMovie(movie);
    setEditMovie(null);
  }
  const editClicked = movie => {
    setEditMovie(movie);
    setSelectedMovie(null);
  }
  const updatedMovie = movie => {
    const newMovies = movies.map( mov =>{
      if (mov.id ===movie.id){
        return movie;
      }
      return mov;
    })
    setMovies(newMovies);
  }
  const newMovie = () => {
    setEditMovie({title:'', description:''});
    setSelectedMovie(null);
  }
  const movieCreated = movie => {
    const newMovies = [...movies, movie];
    setMovies(newMovies)
    // return newMovies
  }
  const removeClicked = movie => {
    const newMovies = movies.filter( mov =>mov.id !==movie.id)
    setMovies(newMovies);
  }

  const logoutUser = () => {
    deleteToken(['mr-token']);
  }

  if(loading) return <h1>loading...</h1>
  if(error) return <h1>error loading movies</h1>

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <FontAwesomeIcon icon={faFilm} />

          <span>Movie rater</span>
        </h1>
        <FontAwesomeIcon icon={faSignOutAlt} onClick={logoutUser} />
      </header>
      <div className="layout">
        <div>
          <MovieList movies={movies} movieClicked={loadMovie} editClicked={editClicked} removeClicked={removeClicked}/>
          <button className="newMovieButton" onClick={newMovie}>New Movie</button>
        </div>
        <MovieDetails movie={selectedMovie} updateMovie={loadMovie} />
        {editMovie?<MovieForm movie={editMovie} updatedMovie={updatedMovie} movieCreated={movieCreated}/>:null}

      </div>
    </div>
  );
}

export default App;
