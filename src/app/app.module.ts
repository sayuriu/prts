import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { BlankComponent } from './blank/blank.component';
import { MainComponent } from './main/main.component';
import { TopLevelUIComponent } from './top-level-ui/top-level-ui.component';
import { OperatorsComponent } from './features/operators/operators.component';
import { CombatComponent } from './features/combat/combat.component';
import { RecruitmentComponent } from './features/recruitment/recruitment.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    BlankComponent,
    MainComponent,
    TopLevelUIComponent,
    OperatorsComponent,
    CombatComponent,
    RecruitmentComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent, TopLevelUIComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
