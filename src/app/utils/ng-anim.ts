import { animate, animateChild, query, state, style } from "@angular/animations";
import { Optional } from "@utils/common";

export const AnimFunctions = {
    'forceful': [0.88, 0, 0.22, 1],
    'forceful-2': [0.98, 0, 0, 1],
    'accelerate': [1, 0.25, 0, 1],
    'slow-down': [0.18, 0, 0.08, 1],
    'sudden': [0, 1.04, 0, 1.04],
} as const;

interface PageTransitionOptions {
    delaySeconds: number;
    durationSeconds: number;
    ease: readonly number[] | string;
    optional: boolean;
    enter: Omit<Optional<PageTransitionOptions>, 'enter' | 'leave'>;
    leave: Omit<Optional<PageTransitionOptions> , 'enter' | 'leave'>;
}

type LateralMovement = 'UD' | 'DU' | 'LR' | 'RL';
const lateralAxis = (direction: LateralMovement) => direction.match(/[UD]/) ? 'Y' : 'X';
const lateralOffset = (direction: LateralMovement[0]) => ['L', 'U'].includes(direction) ? '-' : '';

const normalizeEasings = (easings: number[] | string) => Array.isArray(easings) ? `cubic-bezier(${easings.join(',')})` : easings;
export const absLateralAnimation = (direction: 'UD' | 'DU' | 'LR' | 'RL') => (pageTransitionOptions: Optional<PageTransitionOptions>) => {
    const translate = `translate${lateralAxis(direction)}`;
    const [signSource, signTarget] = direction.split('').map(lateralOffset);
    const {
        delaySeconds = 0,
        durationSeconds = 0.5,
        ease: easings = "ease",
        optional = false,
        enter: {
            delaySeconds: enterDelaySeconds = delaySeconds,
            durationSeconds: enterDurationSeconds = durationSeconds,
            ease: enterEasings = easings,
            optional: enterOptional = optional,
        } = {},
        leave: {
            delaySeconds: leaveDelaySeconds = delaySeconds,
            durationSeconds: leaveDurationSeconds = durationSeconds,
            ease: leaveEasings = easings,
            optional: leaveOptional = optional,
        } = {}
    } = pageTransitionOptions;
    const enterEase = normalizeEasings(enterEasings as number[]);
    const leaveEase = normalizeEasings(leaveEasings as number[]);
    return [
        query(':enter, :leave', [
            style({
                position: 'absolute',
                left: 0,
                top: 0,
            }),
        ], { optional }),
        query(':enter', [
            style({
                transform: `${translate}(${signSource}100%)`,
            })
        ], { optional: enterOptional }),
        query(':leave', [
            style({
                transform: `${translate}(0%)`,
            })
        ], { optional: leaveOptional }),
        query(':enter', [
            animate(
                `${enterDurationSeconds}s ${enterDelaySeconds}s ${enterEase}`,
                style({ transform: `${translate}(0%)` })
            )
        ], { optional: enterOptional }),
        query(':leave', [
            animate(
                `${leaveDurationSeconds}s ${leaveDelaySeconds}s ${leaveEase}`,
                style({ transform: `${translate}(${signTarget}100%)` })
            )
        ], { optional: leaveOptional }),
    ]
}
