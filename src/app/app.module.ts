import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { CompetitionComponent } from './competition/competition.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [AppComponent, MainComponent, CompetitionComponent, HistoryComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}