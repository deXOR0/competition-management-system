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

    if (firstScore == 0 && secondScore == 0) {
      return;
    }

    if (
      this.matches[this.currentMatch].first.points != 0 &&
      this.matches[this.currentMatch].second.points != 0
    ) {
      console.log('Update');
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ].pts -= this.calculatePts(
        this.matches[this.currentMatch].first.points,
        this.matches[this.currentMatch].second.points
      );
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ].pts -= this.calculatePts(
        this.matches[this.currentMatch].second.points,
        this.matches[this.currentMatch].first.points
      );
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ].pf -= this.matches[this.currentMatch].first.points;
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ].pf -= this.matches[this.currentMatch].second.points;
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ].pa -= this.matches[this.currentMatch].second.points;
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ].pa -= this.matches[this.currentMatch].first.points;
      const firstDiff =
        this.matches[this.currentMatch].first.points -
        this.matches[this.currentMatch].second.points;
      const secondDiff =
        this.matches[this.currentMatch].second.points -
        this.matches[this.currentMatch].first.points;
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ].pd -= firstDiff;
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ].pd -= secondDiff;
    }

    this.matches[this.currentMatch].first.points = firstScore;
    this.matches[this.currentMatch].second.points = secondScore;

    this.common.saveData(this.common.MATCHES_KEY, this.matches);

    console.log(
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].first.id)
      ]
    );
    console.log(
      this.players[
        this.players
          .map((e) => e.id)
          .indexOf(this.matches[this.currentMatch].second.id)
      ]
    );

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

  calculatePts(a: number, b: number) {
    if (a > b) {
      return 3;
    } else if (b > a) {
      return 0;
    } else {
      return 1;
    }
  }

  endCompetition() {
    this.common.saveData(this.common.MATCHES_KEY, []);
    this.common.saveData(this.common.PLAYERS_KEY, []);

    this.router.navigate(['/']);
  }
}
