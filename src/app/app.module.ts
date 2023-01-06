import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from '@components/top-bar';
import { PrtsLogoComponent } from "@components/prts-logo";
import { ElementDirective } from '@directives/element.directive';
import { MainComponent } from '@pages/main';
import { BlankComponent } from '@pages/blank';
import { ProjectInfoComponent } from '@pages/main/project-info/project-info.component';
import { GachaComponent } from '@components/banners/gacha/gacha.component';
import { FeaturedEvent } from '@components/banners/featured-event/featured-event';
import { PagedComponent } from "@utils/componentDef";
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
    declarations: [
        AppComponent,
        TopBarComponent,
        MainComponent,
        BlankComponent,
        ElementDirective,
        PrtsLogoComponent,
        ProjectInfoComponent,
        PagedComponent,
        GachaComponent,
        FeaturedEvent,
        FooterComponent
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
