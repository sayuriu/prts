export default function HexToRGB(hex: string): [number, number, number]
{
	if (hex.length !== 7) throw 'paint bucket';
	const r = Math.floor(parseInt(`0x${hex.substring(1, 2)}0000`) / 0xff0000 * 255);
	const g = Math.floor(parseInt(`0x${hex.substring(3, 4)}00`) / 0xff00 * 255);
	const b = Math.floor(parseInt(`0x${hex.substring(5, 6)}`) / 0xff * 255);

	return [r, g, b];
}
