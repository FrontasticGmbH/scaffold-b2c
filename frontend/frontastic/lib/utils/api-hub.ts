export class ResponseError extends Error {
  private readonly response: Response;

  constructor(response: Response) {
    super(`Got HTTP status code ${response.status} (${response.statusText})`);
    this.response = response;
  }

  getResponse() {
    return this.response;
  }

  getStatus() {
    return this.response.status;
  }
}
