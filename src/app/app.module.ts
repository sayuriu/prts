import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { BlankComponent } from './blank/blank.component';
import { MainComponent } from './main/main.component';
import { TopLevelUIComponent } from './top-level-ui/top-level-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    BlankComponent,
    MainComponent,
    TopLevelUIComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, TopLevelUIComponent]
})
export class AppModule { }
