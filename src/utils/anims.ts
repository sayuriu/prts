import { animate, animateChild, trigger, group, transition, query, style, sequence, AnimationStyleMetadata, state, AnimationMetadata, AnimationQueryMetadata, AnimationGroupMetadata } from '@angular/animations';

type AnimationsMetadata = (AnimationStyleMetadata | AnimationQueryMetadata | AnimationGroupMetadata)[];

function defineMultipleTransitions(anim: AnimationsMetadata, transitionExprs: string[])
{
	const out = [];
	for (const transitionExpr of transitionExprs)
		out.push(transition(transitionExpr, anim));
	return out;
}

const commonContainerStyle = style({
	position: 'absolute',
	top: '0',
	left: '0',
});

export class AnimationFunctions
{
	static readonly Forceful = 'cubic-bezier(0.88,-0.07, 0.22, 1.01)';
}

// #region routeAnims
const _slideUpDown = [
	commonContainerStyle,
	query(':enter', style({
		position: 'absolute',
		top: 0,
		opacity: 0,
		transform: 'translateY(5vh)',
	}), { optional: true }),
	query(':leave', style({
		position: 'absolute',
		top: 0,
		opacity: 1,
		transform: 'translateY(0)',
	}), { optional: true }),

	group([
		query(':leave', [
			animate(
				'0.5s ' + AnimationFunctions.Forceful,
				style({
					opacity: 0,
					transform: 'translateY(5vh)',
				}),
			),
		], { optional: true }),
		query(':enter', [
			animate(
				'0.5s 0.1s ' + AnimationFunctions.Forceful,
				style({
					position: 'absolute',
					opacity: 1,
					transform: 'translateY(0)',
				}),
			),
			animateChild({ delay: 400 }),
		], { optional: true }),
	]),
]
function toLeftOrRight(direction: 'left' | 'right')
{
	const EnterXOffset = direction === 'left' ? '50vw' : '-50vw';
	const LeaveXOffset = direction === 'left' ? '-10vw' : '10vw';
	return [
		commonContainerStyle,
		query(':enter', style({
			position: 'absolute',
			top: 0,
			right: 0,
			opacity: 0,
			transform: `translateX(${EnterXOffset})`,
		})),
		query(':leave', style({
			position: 'absolute',
			top: 0,
			opacity: 1,
			transform: 'translateX(0)',
		})),
		group([
			query(':enter',
				animate(
					'0.5s cubic-bezier(1, 0.62, 0.13, 0.9)',
					style({
						opacity: 1,
						transform: 'translateX(0)',
					})
				),
			),
			query(':leave',
				animate(
					'0.5s cubic-bezier(0.91, 0.58, 0.3, 0.79)',
					style({
						opacity: 0,
						transform: `translateX(${LeaveXOffset})`,
					})
				),
			),
			query(':enter', animateChild({ delay: 1000 }))
		]),
	]
}
export const routeAnims = trigger('routeAnimations', [
	...defineMultipleTransitions(
		toLeftOrRight('left'),
		[
			'HomePage => OperatorsPage',
			// 'HomePage => RecruitPage',
			// 'HomePage => CombatPage',
		]
	),
	...defineMultipleTransitions(
		toLeftOrRight('right'),
		[
			'OperatorsPage => HomePage',
			// 'HomePage => RecruitPage',
			// 'HomePage => CombatPage',
		]
	),
	...defineMultipleTransitions(
		_slideUpDown,
		[
			'DefaultPage <=> HomePage',
			'* => HomePage',
			'* <=> *'
		],
	),

]);
// #endregionee

// #region commonAnims
export const AppearDisappear = (timefunc?: string) => {
	const animFunc = '250ms ease'
	return trigger('AppearDisappear', [
		transition(':enter', [
			style({ opacity: 0 }),
			animate(timefunc ?? animFunc, style({ opacity: 1 })),
		]),
		transition(':leave', [
			animate(timefunc ?? animFunc,  style({ opacity: 0 })),
		]),
	]);
}
export const slideRtL = function(){
	const animFunc = '250ms ' + AnimationFunctions.Forceful;
	return trigger('slideRtL', [
		transition(':enter', [
			style({
				// position: 'absolute',
				opacity: 0,
				right: 'calc(100% - 20px)',
			}),
			animate(animFunc, style({
				opacity: 1,
				right: '100%',
			}))
		]),
		transition(':leave', [
			style({
				// position: 'absolute',
				opacity: 1,
				right: '100%',
			}),
			animate(animFunc, style({
				opacity: 0,
				right: 'calc(100% - 20px)',
			}))
		])
	]);
}()
// #endregion