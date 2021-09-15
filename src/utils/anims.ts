import { animate, animateChild, group, keyframes, trigger, transition, query, style } from '@angular/animations';
import { transform } from 'typescript';

export const slideAnimations = 0;

// export const slideUp =
// 	trigger('routeAnimations', [
// 		transition('* <=> *', [
// 			style({
// 				position: 'absolute',
// 				top: 0,
// 				left: 0,
// 			}),
// 			query(':enter, :leave', [
// 				style({
// 					opacity: 0,
// 					position: 'relative',
// 					transform: 'translateY(100%)'
// 				}),
// 			], {optional: true}),
// 			group([
// 				query(':enter', [
// 					animate('1s cubic-bezier(0.88,-0.07, 0.22, 1.01)'),
// 					style({
// 						opacity: 1,
// 						position: 'relative',
// 						transform: 'translateY(0)'
// 					})
// 				],{optional: true}),
// 				query(':leave', [
// 					animate('1s cubic-bezier(0.88,-0.07, 0.22, 1.01)'),
// 					style({
// 						opacity: 0,
// 						position: 'relative',
// 						transform: 'translateY(20%)'
// 					})
// 				], {optional: true})
// 			])
// 		])
// 	]);
//
// 	// animate('0.2s cubic-bezier(0.88,-0.07, 0.22, 1.01)');

export const fader =
	trigger('routeAnimations', [
		transition('HomePage <=> DefaultPage', [
			style({
				position: 'absolute',
				top: '0',
			}),
			query(':enter', [
				animateChild(),
			]),
			query(':leave', [
				style({
					position: 'absolute',
					opacity: 1,
					left: 0,
				})
			]),
			query(':leave', [
				animate(
					'0.5s cubic-bezier(0.88,-0.07, 0.22, 1.01)',
					style({
						opacity: 0,
						transform: 'translateY(5vh)'
					})
				)
			])
		]),
		transition('void => DefaultPage', [
			query(':enter', style({
				opacity: 0
			})),
			query(':enter',
				animate(
					'500ms ease',
					style({
						opacity: 0
					})
				)
			),
			query(':enter', animateChild()),
		]),
  	]);
