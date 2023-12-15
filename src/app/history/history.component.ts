import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [CommonService],
})
export class HistoryComponent implements OnInit {
  matches: any[] = [];
  players: any[] = [];
  currentMatch = 0;
  session: any = {};
  sessionId: any = '';
  isDataLoaded = false;

  @ViewChild('firstPlayerScore') firstPlayerScore: any;
  @ViewChild('secondPlayerScore') secondPlayerScore: any;
  @ViewChild('sessionIdOutput') sessionIdOutput: any;

  constructor(private common: CommonService, private route: ActivatedRoute) {}

  async ngOnInit() {
    console.log('Starting comp');
    this.isDataLoaded = false;
    this.sessionId = this.route.snapshot.paramMap.get('id');

    console.log(this.sessionId);

    this.session = await this.common.getSessionData(this.sessionId);

    console.log(this.session);

    this.players = this.session.sessionData.players;
    console.log('Players: ' + this.players);
    this.matches = this.session.sessionData.matches;
    this.isDataLoaded = true;
  }

  loadPreviousMatch() {
    if (this.currentMatch > 0) {
      this.currentMatch--;
    }
  }

  loadNextMatch() {
    if (this.currentMatch < this.matches.length - 1) {
      this.currentMatch++;
    }
  }

  copySessionId() {
    const text = this.sessionIdOutput.nativeElement.value;
    navigator.clipboard.writeText(text);
    alert('Session ID copied!');
  }
}
