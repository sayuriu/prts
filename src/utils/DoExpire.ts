export interface Expire<T>
{
	lifetime?: number;
	onExpire: (data: T) => void;
}