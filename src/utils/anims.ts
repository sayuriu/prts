import { animate, animateChild, trigger, transition, query, style, AnimationStyleMetadata, state, AnimationMetadata } from '@angular/animations';

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

const _slideBetween = () => {
	const state_enter =
		fromElement(':enter')
		({
			opacity: 0,
			transform: 'translateY(5vh)'
		});
	const state_leave =
		fromElement(':leave')
		({
			opacity: 1,
			transform: 'translateY(0)'
		});

	return trigger('routeAnimations', [
		transition('DefaultPage <=> HomePage', [
			style({
				position: 'absolute',
				top: '0',
				left: '0',
			}),
			state_enter,
			state_leave,

			state_leave
				.animate({
					opacity: 0,
					transform: 'translateY(5vh)',
				})
				(500, 'cubic-bezier(0.88,-0.07, 0.22, 1.01)'),

			state_enter
				.animate({
					opacity: 1,
					transform: 'translateY(0)'
				})
				(
					500,
					'cubic-bezier(0.88,-0.07, 0.22, 1.01)',
					200,
					'isEntering',
					100
				),
		])
	])
}

export const slideBetween = trigger('routeAnimations', [
	transition('* <=> *', [
		style({
			position: 'absolute',
			top: '0',
			left: '0',
		}),
		query(':enter', style({
			position: 'absolute',
			top: '0',
			opacity: 0,
			transform: 'translateY(50vh)'
		})),
		query(':leave', style({
			opacity: 1,
			transform: 'translateY(0)'
		})),

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
				'0.5s cubic-bezier(0.88,-0.07, 0.22, 1.01)',
				style({
					position: 'absolute',
					opacity: 1,
					transform: 'translateY(0)',
				})
			),
			animateChild({ delay: 1000 })
		]),
	])
])

function _fromElement(selector: string, sharedStyle?: Style) {
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

function fromElement(selector: string, sharedStyle: Style = {})
{
	return function applyStyle(_style: Style = {})
	{
		const _query = query(
				selector,
				style(Object.assign(sharedStyle, _style))
			)
		return Object.assign(
			_query,
			{
				animate(targetStyle: Style = {}) {
					return function doAnimate(durationMs: number, timeFunc = 'ease', delayMs = 0, status?: 'isLeaving' | 'isEntering' | null, childDelayMs = 0)
					{
						const _animQuery: AnimationMetadata[] =  [
							animate(
								`${durationMs}ms ${delayMs}ms ${timeFunc}`,
								style(Object.assign(sharedStyle, targetStyle)))
						];
						switch(status)
						{
							case 'isLeaving': {
								_animQuery.unshift(animateChild({ delay: childDelayMs }));
								break;
							}
							case 'isEntering': {
								_animQuery.push(animateChild({ delay: childDelayMs }));
								break;
							}
							default: null;
						}
						return query(selector, _animQuery);
					}
				}
			}
		)
	}
}

// ..._fromElement(':enter')(
// 	{
// 		opacity: 0,
// 		transform: 'translateY(5vh)'
// 	},
// 	{
// 		opacity: 1,
// 		transform: 'translateY(0)'
// 	}
// )
// .animate(
// 	500,
// 	'cubic-bezier(0.88,-0.07, 0.22, 1.01)',
// 	undefined,
// 	'isEntering',
// 	100
// ),
// ..._fromElement(':leave')(
// 	{
// 		opacity: 1,
// 		transform: 'translateY(0)',
// 		// 'animation-direction': 'reverse',
// 	},
// 	{
// 		opacity: 0,
// 		transform: 'translateY(5vh)'
// 	}
// )
// .animate(
// 	500,
// 	'cubic-bezier(0.88,-0.07, 0.22, 1.01)',
// 	undefined,
// 	'isLeaving',
// ),