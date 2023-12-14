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
  players: any[] = [];
  session: any = {};

  constructor(private router: Router, private common: CommonService) {}

  async ngOnInit() {
    console.log('Main');
    await this.createSession();
  }

  addPlayer(initial: string) {
    const newPlayer = {
      id: this.common.createId(5),
      initial: initial.trim().toUpperCase(),
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
    const matches = this.common.generateMatchesFromPlayers(this.players);

    this.session.sessionData.players = this.players;
    this.session.sessionData.matches = matches;

    await this.common.updateSessionData(this.session);

    this.router.navigate(['/competition']);
  }

  joinSession(sessionId: string) {
    this.common.saveData(this.common.SESSION_KEY, sessionId);
    this.router.navigate(['/competition']);
  }

  async createSession() {
    this.session = await this.common.createSession();

    console.log(this.session);

    this.sessionInput.nativeElement.value =
      this.session.sessionId.toUpperCase();
  }
}
