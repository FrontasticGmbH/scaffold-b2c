import API from './api-source';
import { Request, Response } from '@frontastic/extension-types/src/ts';

type ActionHook = (request: Request) => Promise<Response>;

const getTeams: ActionHook = async (request: Request) => {
  const contentApi = new API();

  const data = await contentApi.getTeams();

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};

const getTeam: ActionHook = async (request: Request) => {
  const contentApi = new API();

  const teamId = request.query.id;

  if (!teamId) {
    return {
      statusCode: 400,
      body: 'Team ID was no provided',
      sessionData: request.sessionData,
    };
  }
  const data = await contentApi.getTeam(request.query.id);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};

export { getTeam, getTeams };
