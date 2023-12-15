import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  PLAYERS_KEY = 'players';
  MATCHES_KEY = 'matches';
  SESSION_KEY = 'session';
  API_BASE_URL = 'https://api.awesa.xyz/v1';

  constructor() {}

  saveData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  loadData(key: string, defaultData = '') {
    return JSON.parse(localStorage.getItem(key) || defaultData);
  }

  isDataExists(key: string) {
    try {
      const data = this.loadData(key);
      return true;
    } catch {
      return false;
    }
  }

  generateMatchesFromPlayers(data: any[]) {
    const players = this.generatePlayers(data);
    const shuffledPlayers = this.fisherYates(players);
    const matches = this.generateMatches(shuffledPlayers);

    return matches;
  }

  generatePlayers(data: any[]) {
    const players: any[] = data.map((e) => {
      return {
        id: e.id,
        initial: e.initial,
      };
    });

    return players;
  }

  fisherYates(items: any[]) {
    for (let i = 0; i < items.length - 1; i++) {
      let j = Math.floor(Math.random() * items.length);
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }

    return items;
  }

  maxRepeatFisherYates(items: any[], players: any[], maxRepeat: number): any {
    let repeatingCount: any = {};
    for (let i = 0; i < players.length; i++) {
      repeatingCount[players[i].id] = 0;
    }
    for (let i = 0; i < items.length - 1; i++) {
      let j = -1;
      let selectedPlayers = [];
      do {
        j = Math.floor(Math.random() * items.length);
        selectedPlayers = [items[j].first.id, items[j].second.id];
      } while (
        repeatingCount[selectedPlayers[0].id] > maxRepeat - 1 ||
        repeatingCount[selectedPlayers[1].id] > maxRepeat - 1
      );
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
      for (let k = 0; k < players.length; k++) {
        if (
          players[k].id == selectedPlayers[0] ||
          players[k].id == selectedPlayers[1]
        ) {
          repeatingCount[players[k].id]++;
        } else {
          repeatingCount[players[k].id] = 0;
        }
      }
    }
    for (let i = 0; i < players.length; i++) {
      repeatingCount[players[i].id] = 0;
    }
    for (let i = 0; i < items.length; i++) {
      let selectedPlayers = [items[i].first.id, items[i].second.id];
      for (let k = 0; k < players.length; k++) {
        if (
          players[k].id == selectedPlayers[0] ||
          players[k].id == selectedPlayers[1]
        ) {
          repeatingCount[players[k].id]++;
        } else {
          repeatingCount[players[k].id] = 0;
        }
      }
      if (
        repeatingCount[selectedPlayers[0]] > 2 ||
        repeatingCount[selectedPlayers[1]] > 2
      ) {
        return this.maxRepeatFisherYates(items, players, maxRepeat);
      }
    }

    return items;
  }

  generateMatches(players: any[]) {
    const pairs = this.createPairs(players);
    const matches = this.maxRepeatFisherYates(pairs, players, 2);

    return matches;
  }

  createPairs(players: any[]) {
    let pairs = [];
    for (let i = 0; i < players.length - 1; i++) {
      for (let j = i + 1; j < players.length; j++) {
        let newPair: any = {
          id: this.createId(5),
          first: {
            id: players[i].id,
            initial: players[i].initial,
            points: 0,
          },
          second: {
            id: players[j].id,
            initial: players[j].initial,
            points: 0,
          },
        };
        pairs.push(newPair);
      }
    }
    return pairs;
  }

  createId(length: number) {
    return nanoid(length);
  }

  async createEmptySession() {
    const response = await fetch(this.API_BASE_URL + '/session', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionData: {
          players: [],
          matches: [],
        },
      }),
    });

    const data = await response.json();

    this.saveData(this.SESSION_KEY, data.sessionId);

    return data;
  }

  async createSession(session: any) {
    const { players, matches } = session.sessionData;

    const response = await fetch(this.API_BASE_URL + '/session', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.sessionId,
        sessionData: {
          players,
          matches,
        },
      }),
    });
  }

  async updateSessionData(session: any) {
    const { players, matches } = session.sessionData;

    const response = await fetch(this.API_BASE_URL + '/session', {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.sessionId,
        sessionData: {
          players,
          matches,
        },
      }),
    });
  }

  async getSessionData(sessionId: string) {
    const response = await fetch(this.API_BASE_URL + `/session/${sessionId}`);

    const data = await response.json();

    return data;
  }

  async createSessionId() {
    const response = await fetch(this.API_BASE_URL + `/session/id`);

    const data = await response.json();

    return data;
  }
}
