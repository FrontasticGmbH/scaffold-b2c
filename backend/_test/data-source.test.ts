import extensions from '../demo-docs';

const StarWarsMovies = extensions['data-sources']['example/star-wars/movie'];

test('Get movie by ID', async () => {
  const result = await StarWarsMovies({
    dataSourceId: 'test',
    type: 'example/star-wars/movie',
    name: 'Test data source',
    configuration: { movieId: 'ZmlsbXM6MQ==' },
  });

  expect(result.dataSourcePayload.data.film.title).toBe('A New Hope');
});
