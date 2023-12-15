import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { nanoid } from 'nanoid';
import { CommonService } from '../common.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [CommonService],
})
export class MainComponent implements OnInit {
  @ViewChild('initialField') initialInput: any;
  @ViewChild('sessionField') sessionInput: any;
  @ViewChild('sessionIdOutput') sessionIdOutput: any;
  players: any[] = [];
  session: any = { sessionId: 'Loading...' };

  constructor(private router: Router, private common: CommonService) {}

  async ngOnInit() {
    console.log('Main');
    await this.createSessionId();
  }

  addPlayer(initial: string) {
    if (!initial || initial == '') {
      return;
    }
    const newPlayer = {
      id: this.common.createId(5),
      initial: initial.trim().toUpperCase(),
      mp: 0,
      pts: 0,
      pa: 0,
      pf: 0,
      pd: 0,
    };
    console.log(newPlayer);
    this.players.push(newPlayer);
    this.initialInput.nativeElement.value = '';
  }

  deletePlayer(id: string) {
    this.players = this.players.filter((p) => p.id != id);
  }

  async startCompetition() {
    if (this.players.length < 2) {
      alert('At least two players are required to start a competition');

      return;
    }
    const matches = this.common.generateMatchesFromPlayers(this.players);

    this.session.sessionData.players = this.players;
    this.session.sessionData.matches = matches;

    await this.common.updateSessionData(this.session);

    this.router.navigate(['/competition']);
  }

  joinSession(sessionId: string) {
    if (!sessionId || sessionId == '') {
      return;
    }
    this.common.saveData(this.common.SESSION_KEY, sessionId);
    this.router.navigate(['/competition']);
  }

  async createSessionId() {
    const { sessionId } = await this.common.createSessionId();
    this.common.saveData(this.common.SESSION_KEY, sessionId);

    this.session = { sessionId, sessionData: {} };

    console.log(this.session);
  }

  copySessionId() {
    const text = this.sessionIdOutput.nativeElement.value;
    navigator.clipboard.writeText(text);
    alert('Session ID copied!');
  }
}
