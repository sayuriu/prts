import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from "@pages/entry";
import { MainComponent } from "@pages/main";

const routes: Routes = [
    {
        path: '',
        component: EntryComponent,
    },
    {
        path: 'main',
        component: MainComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
