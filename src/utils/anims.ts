import { animate, animateChild, trigger, group, transition, query, style, sequence, AnimationStyleMetadata, state, AnimationMetadata } from '@angular/animations';

export const slideBetween = trigger('routeAnimations', [
	transition('* <=> *', [
		style({
			position: 'absolute',
			top: '0',
			left: '0',
		}),
		query(':enter', style({
			position: 'absolute',
			top: 0,
			opacity: 0,
			transform: 'translateY(5vh)'
		})),
		query(':leave', style({
			position: 'absolute',
			top: 0,
			opacity: 1,
			transform: 'translateY(0)'
		})),

		group([
			query(':leave', [
				animate(
					'0.5s cubic-bezier(0.88,-0.07, 0.22, 1.01)',
					style({
						opacity: 0,
						transform: 'translateY(5vh)',
					})
				),
			]),
			query(':enter', [
				animate(
					'0.5s 0.2s cubic-bezier(0.88,-0.07, 0.22, 1.01)',
					style({
						position: 'absolute',
						opacity: 1,
						transform: 'translateY(0)',
					})
				),
			]),
		]),
		query(':enter', animateChild({ delay: 200 })),
	])
])

type Style = "*" | { [key: string]: string | number; }
