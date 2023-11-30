import extensions from '../demo-docs';

const StarWarsAction = extensions['actions']['star-wars']['character'];

test('Fetch by query search', async () => {
  const response = await StarWarsAction({ method: 'GET', path: '/', query: { search: 'Obi' } });

  const result = JSON.parse(response.body);
  expect(result.data.allPeople.totalCount).toBe(1);
  expect(result.data.allPeople.people[0].name).toBe('Obi-Wan Kenobi');
});

export {};
