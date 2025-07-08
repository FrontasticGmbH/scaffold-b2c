const parseQueryParams = <T extends object>(query: T): T => ({ ...query });
export default parseQueryParams;
