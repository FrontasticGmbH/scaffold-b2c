interface teamT {
  id: number;
  team_name: string;
  location: string;
  net_worth: string;
}

class SportsAPI {
  private readonly sportTeam: teamT[];

  constructor() {
    this.sportTeam = [
      {
        id: 1,
        team_name: 'Manchester United',
        location: 'Manchester, England',
        net_worth: '5 Billion',
      },
      {
        id: 2,
        team_name: 'Manchester City',
        location: 'Manchester, England',
        net_worth: '2 Billion',
      },
      {
        id: 3,
        team_name: 'Arsenal',
        location: 'London, England',
        net_worth: '4.5 Billion',
      },
    ];
  }

  async getTeams() {
    return this.sportTeam;
  }

  async getTeam(id: number) {
    return this.sportTeam.find((team) => team.id === id);
  }
}

export default SportsAPI;
