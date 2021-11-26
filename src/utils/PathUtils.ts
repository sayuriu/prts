export const normalizePath = (path: string) => path.replace(/\\\\|\/|\\/g, '/');
export const joinPaths = (...args: string[]) => normalizePath(join(...args));
export const join = (...args: string[]) => {
	const paths = [];
	for (const arg of args)
		paths.push(
			arg.split(/\\+|\/+/g)
			   .map(p => p.trim())
			   .filter(p => p.length > 0)
		);
	return normalizePath(paths.join('/').replace(/,+/g, '/'));
}