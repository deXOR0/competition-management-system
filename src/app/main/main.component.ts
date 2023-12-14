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
  players: any[] = [];

  constructor(private router: Router, private common: CommonService) {}

  ngOnInit(): void {
    console.log('Main');
  }

  addPlayer(initial: string) {
    const newPlayer = {
      id: nanoid(5),
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

  startCompetition() {
    const matches = this.common.generateMatchesFromPlayers(this.players);
    this.common.saveData(this.common.PLAYERS_KEY, this.players);
    this.common.saveData(this.common.MATCHES_KEY, matches);
    this.router.navigate(['/competition']);
  }
}
