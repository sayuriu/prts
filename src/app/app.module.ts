import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { BlankComponent } from './blank/blank.component';
import { MainComponent } from './main/main.component';
import { TopLevelUIComponent } from './top-level-ui/top-level-ui.component';
import { NotifOverlayComponent } from './notif-overlay/notif-overlay.component';
import { InfoTextFieldComponent } from './info-text-field/info-text-field.component';

import { CombatComponent } from './features/combat/combat.component';
import { RecruitmentComponent } from './features/recruitment/recruitment.component';

import { OperatorsComponent } from './features/operators/operators.component';
import { OperatorImgComponent } from './features/operators/operator-img/operator-img.component';
import { OperatorInfoAreaComponent } from './features/operators/operator-info-area/operator-info-area.component';
import { OperatorPickerAreaComponent } from './features/operators/operator-picker-area/operator-picker-area.component';
import { OpMainInfoComponent } from '@featureComponents/operators/operator-info-area/page-MainInfo/opInfo-MainInfo.component';
import { OpStatsComponent } from '@featureComponents/operators/operator-info-area/page-Stats/opInfo-Stats.component';
import { OpSkillsComponent } from '@featureComponents/operators/operator-info-area/page-Skills/opInfo-Skills.component';
import { LabelledButtonComponent } from './labelled-button/labelled-button.component';
import {NgVarDirective} from "@root/src/app/ng-var.directive";
import { InvalidScreenComponent } from './invalid-screen/invalid-screen.component';

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
    OpMainInfoComponent,
    OpSkillsComponent,
    OpStatsComponent,
    OperatorPickerAreaComponent,
    NotifOverlayComponent,
    InfoTextFieldComponent,
    LabelledButtonComponent,
    NgVarDirective,
    InvalidScreenComponent,
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
