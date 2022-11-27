import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { EntryComponent } from './pages/entry/entry.component';
import { MainComponent } from './pages/main/main.component';
import { BlankComponent } from './blank/blank.component';
import { ElementDirectiveDirective } from './directives/element-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    EntryComponent,
    MainComponent,
    BlankComponent,
    ElementDirectiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
