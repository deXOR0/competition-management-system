import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.css'],
  providers: [CommonService],
})
export class CompetitionComponent implements OnInit {
  matches: any[] = [];
  players: any[] = [];
  currentMatch = 0;

  @ViewChild('firstPlayerScore') firstPlayerScore: any;
  @ViewChild('secondPlayerScore') secondPlayerScore: any;

  constructor(private common: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.players = this.common.loadData(this.common.PLAYERS_KEY, '[]');

    if (!this.common.isDataExists(this.common.MATCHES_KEY)) {
      this.matches = this.common.generateMatchesFromPlayers(this.players);
      this.common.saveData(this.common.MATCHES_KEY, this.matches);
    } else {
      this.matches = this.common.loadData(this.common.MATCHES_KEY, '[]');
    }
  }

  loadPreviousMatch() {
    if (this.currentMatch > 0) {
      this.currentMatch--;
    }
  }

  loadNextMatch() {
    ++this.currentMatch % this.matches.length;
  }

  updateScore() {
    const firstScore = Number(this.firstPlayerScore.nativeElement.value);
    const secondScore = Number(this.secondPlayerScore.nativeElement.value);

    this.matches[this.currentMatch].first.points = firstScore;
    this.matches[this.currentMatch].second.points = secondScore;

    this.common.saveData(this.common.MATCHES_KEY, this.matches);

    if (firstScore > secondScore) {
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ].pts += 3;
    } else if (secondScore > firstScore) {
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ].pts += 3;
    } else {
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ].pts += 1;
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ].pts += 1;
    }

    console.log(this.players.indexOf(this.matches[this.currentMatch].first.id));
    console.log(this.matches[this.currentMatch].first.id);

    this.players[
      this.players
        .map((e) => e.id)
        .indexOf(this.matches[this.currentMatch].first.id)
    ].pf += firstScore;
    this.players[
      this.players
        .map((e) => e.id)
        .indexOf(this.matches[this.currentMatch].second.id)
    ].pf += secondScore;
    this.players[
      this.players
        .map((e) => e.id)
        .indexOf(this.matches[this.currentMatch].first.id)
    ].pa += secondScore;
    this.players[
      this.players
        .map((e) => e.id)
        .indexOf(this.matches[this.currentMatch].second.id)
    ].pa += firstScore;
    this.players[
      this.players
        .map((e) => e.id)
        .indexOf(this.matches[this.currentMatch].first.id)
    ].pd += firstScore - secondScore;
    this.players[
      this.players
        .map((e) => e.id)
        .indexOf(this.matches[this.currentMatch].second.id)
    ].pd += secondScore - firstScore;

    this.players = this.players.sort(
      (a, b) => b.pts - a.pts || b.pf - a.pf || a.pa - b.pa || b.pd - a.pd
    );

    this.common.saveData(this.common.PLAYERS_KEY, this.players);

    this.firstPlayerScore.nativeElement.value = '';
    this.secondPlayerScore.nativeElement.value = '';
  }

  endCompetition() {
    this.common.saveData(this.common.MATCHES_KEY, []);
    this.common.saveData(this.common.PLAYERS_KEY, []);

    this.router.navigate(['/']);
  }
}
