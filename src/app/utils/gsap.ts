interface FlipOptions {
    onComplete: gsap.Callback;
    stagger: number;
    delay: number;
    duration: number;
    ease: gsap.EaseFunction | string;
}

type FlipElement = (HTMLElement & { _flip: gsap.core.Timeline })
export function flip(
    elements: FlipElement[],
    changeFunc: () => void,
    {
        delay = 0,
        duration = 0.5,
        stagger = 0.1,
        ease = 'power2.inOut',
        onComplete = () => {},
    }: Partial<FlipOptions>)
{
    elements = gsap.utils.toArray(elements);
    let tl = gsap.timeline({onComplete: onComplete, delay: delay || 0}),
        bounds = elements.map(el => el.getBoundingClientRect()),
        copy: Partial<FlipOptions> & { x: CoordinateCallback, y: CoordinateCallback} =
            { x: () => '', y: () => '' };
    elements.forEach(el => {
        el._flip && el._flip.progress(1);
        el._flip = tl;
    })
    changeFunc();
    copy = {...copy, ...{ duration, stagger, ease }}
    type CoordinateCallback = (i: number, element: FlipElement) => string;
    copy.x = (i, element) => "+=" + (bounds[i].left - element.getBoundingClientRect().left);
    copy.y = (i, element) => "+=" + (bounds[i].top - element.getBoundingClientRect().top);
    return tl.from(elements, copy);
}
