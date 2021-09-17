import { animate, animateChild, group, keyframes, trigger, transition, query, style } from '@angular/animations';
import { transform } from 'typescript';

export const slideAnimations = 0;

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
					'animation-direction': 'reverse',
				})
			]),
			query(':leave', [
				animateChild(),
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

export const slideBetween =
	trigger('routeAnimations', [
		transition('* <=> *', [

		])
	])