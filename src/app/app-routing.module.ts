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
	{ path: 'operators',
		// component: OperatorsPage,
		children: [
			{
				path: ':id',
				component: BlankComponent,
				// component: OperatorsPage,
			},
			{
				path: ':name',
				component: BlankComponent,
				// component: OperatorsPage,
			},
		],
	},
	{ path: 'characters',
		// component: OperatorsPage,
		children: [
			{
				path: ':id',
				component: BlankComponent,
				// component: OperatorsPage,
			},
			{
				path: ':name',
				component: BlankComponent,
				// component: OperatorsPage,
			},
		],
	},
	{ path: 'recruit-sim',
		// component: RecruitPage,
		children: [
			{
				path: ':id',
				component: BlankComponent,
				// component: OperatorsPage,
			},
			{
				path: ':name',
				component: BlankComponent,
				// component: OperatorsPage,
			},
		],
	},
	{ path: 'combat',
		// component: CombatPage
		children: [
			{
				path: 'map',
				component: BlankComponent,
				// component: CombatPage:Map,
				children: [
					{
						path: ':id',
						component: BlankComponent,
						// component: CombatPage:Map->Id,
					}
				]
			},
			{
				path: 'enemies',
				component: BlankComponent,
				// component: CombatPage:Enemies,
				children: [
					{
						path: ':id',
						component: BlankComponent,
						// component: CombatPage:Enemies->Id,
					}
				]
			},
		],
	},
	{
		path: '**',
		pathMatch: 'full',
		component: NotFoundComponent,
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
