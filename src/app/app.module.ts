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
import { OperatorImgComponent } from './features/operators/operator-img/operator-img.component';
import { OperatorInfoAreaComponent } from './features/operators/operator-info-area/operator-info-area.component';
import { OperatorPickerAreaComponent } from './features/operators/operator-picker-area/operator-picker-area.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    BlankComponent,
    MainComponent,
    TopLevelUIComponent,
    OperatorsComponent,
    CombatComponent,
    RecruitmentComponent,
    OperatorImgComponent,
    OperatorInfoAreaComponent,
    OperatorPickerAreaComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent, TopLevelUIComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
