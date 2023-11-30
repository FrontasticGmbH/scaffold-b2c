import axios from 'axios';

export interface MovieData {
  data: {
    film: {
      id: string;
      title: string;
      episodeID: number;
      openingCrawl: string;
      releaseDate: string;
    };
  };
  _url: string;
}

export const loadMovieData = async (movieId: string): Promise<MovieData | null> => {
  return await axios
    .post<MovieData | null>('https://frontastic-swapi-graphql.netlify.app', {
      query: '{film(id:"' + movieId + '") {id, title, episodeID, openingCrawl, releaseDate}}',
    })
    .then((response): MovieData => {
      return {
        ...response.data,
        _url: '/movie/star-wars-episode-' + response.data.data.film.episodeID + '/' + response.data.data.film.id,
      } as MovieData;
    })
    .catch((reason) => {
      console.log(reason);
      return null;
    });
};
