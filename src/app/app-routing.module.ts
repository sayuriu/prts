import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './errors/not-found/not-found.component';
import { BlankComponent } from './blank/blank.component';
import { MainComponent as HomePage } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    data: {
      animation: 'DefaultPage'
    }
  },
  {
    path: 'main',
    component: HomePage,
    data: {
      animation: 'HomePage'
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
