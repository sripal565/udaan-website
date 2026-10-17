export const clamp = (x, min = 0, max = 1) => Math.min(max, Math.max(min, x));
export const between = (p, start, end) => clamp((p - start) / (end - start));
export const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
export function heroFrame(p) {
 const zoom = smooth(between(p, .06, .95));
 return { scale: 1 + zoom * 3.4, opacity: 1 - smooth(between(p, .82, 1)), copy: 1 - smooth(between(p, .02, .3)), y: -between(p, 0, .4) * 65 };
}
export function flightFrame(p) {
 return { y: (1 - smooth(between(p, .02, .34))) * 110, scale: 1.5 - smooth(between(p, .34, .65)) * .97, plane: 1 - smooth(between(p, .65, .79)), title: 1 - smooth(between(p, .4, .59)), spec: smooth(between(p, .65, .82)) };
}
export function arrivalFrame(p) {
 return { passY: 110 - between(p, .08, .65) * 210, passOpacity: smooth(between(p,.06,.18)) * (1 - smooth(between(p,.6,.77))), footer: smooth(between(p,.58,.83)) };
}
export function advanceCloudTime(elapsed, deltaSeconds, enabled) {
 return elapsed + (enabled ? clamp(deltaSeconds, 0, .05) : 0);
}
