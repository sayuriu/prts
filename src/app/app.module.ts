import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar';
import { PrtsLogoComponent } from "./components/prts-logo";
import { ElementDirective } from '@directives/element.directive';
import { MainComponent } from '@pages/main';
import { BlankComponent } from '@pages/blank';

@NgModule({
    declarations: [
        AppComponent,
        TopBarComponent,
        MainComponent,
        BlankComponent,
        ElementDirective,
        PrtsLogoComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
