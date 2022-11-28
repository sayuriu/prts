import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from "@pages/main";
import { BlankComponent } from "@pages/blank";

const routes: Routes = [
    {
        path: '',
        component: BlankComponent,
        data: { animation: 'blank' }
    },
    {
        path: 'main',
        component: MainComponent,
        data: { animation: 'main' }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
