import { animate, animateChild, trigger, transition, query, style, AnimationStyleMetadata } from '@angular/animations';
import { transform } from 'typescript';

export const slideAnimations = 0;

export const fader =
	trigger('routeAnimations', [
		transition('DefaultPage <=> HomePage', [
			style({
				position: 'absolute',
				top: '0',
			}),
			query(':leave', [
				style({
					position: 'absolute',
					opacity: 1,
					left: 0,
					'animation-direction': 'reverse',
				})
			]),
			query(':enter', [
				style({
					position: 'absolute',
					transform: 'translateY(5vh)',
					opacity: 1,
					left: 0,
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
			]),
			query(':enter', [
				animateChild(),
			]),
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
			style({
				position: 'absolute',
				top: '0',
				left: '0',
			}),
			...fromElement(':enter')(
				{
					opacity: 0,
					transform: 'translateY(5vh)'
				},
				{
					opacity: 1,
					transform: 'translateY(0)'
				}
			)
			.animate(
				500,
				'cubic-bezier(0.88,-0.07, 0.22, 1.01)',
				undefined,
				'isEntering',
				100
			),
			...fromElement(':leave')(
				{
					opacity: 1,
					transform: 'translateY(0)',
					// 'animation-direction': 'reverse',
				},
				{
					opacity: 0,
					transform: 'translateY(5vh)'
				}
			)
			.animate(
				500,
				'cubic-bezier(0.88,-0.07, 0.22, 1.01)',
				undefined,
				'isLeaving',
			),
		])
	])

function fromElement(selector: string, sharedStyle?: Style) {
	return function applyStyles(from: Style, to: Style) {
		const target = [
			query(selector, style(Object.assign(from, sharedStyle ?? {}))),
			query(selector, style(Object.assign(to, sharedStyle ?? {}))),
		];
		return Object.assign(target, {
			animate(durationMs: number, timeFunc = 'ease', delayMs = 0, status?: 'isLeaving' | 'isEntering' | null, childDelayMs = 0) {
				const _animQuery = [
					query(selector, animate(`${durationMs}ms ${delayMs}ms ${timeFunc}`)),
				];
				switch(status)
				{
					case 'isLeaving': {
						_animQuery.unshift(query(selector, animateChild({ delay: childDelayMs })));
						break;
					}
					case 'isEntering': {
						_animQuery.push(query(selector, animateChild({ delay: childDelayMs })));
						break;
					}
					default: null;
				}

				return target.concat(_animQuery);
			}
		})
	}

}

type Style = "*" | { [key: string]: string | number; }