type ResponseDataT = 'blob' | 'arraybuffer' | 'json' | 'text' | undefined;

export class ImageLoader extends Image {
	completedPercentage: number = 0;
	load(
		url: string,
		responseType: ResponseDataT = 'arraybuffer',
		callbacks: CallbackOptions = {},
	)
	{
		const emptyFunc = () => {};
		let thisImg = this;
		let xmlHTTP = new XMLHttpRequest();
		xmlHTTP.open('GET', url, true);
		xmlHTTP.responseType = responseType;
		xmlHTTP.onload = function(this, ev) {
			thisImg.src = window.URL.createObjectURL(new Blob([this.response]));
			(callbacks.onload ?? emptyFunc)(thisImg, ev);
		};
		xmlHTTP.onprogress = function(ev) {
			thisImg.completedPercentage = (ev.loaded / ev.total) * 100;
			(callbacks.onprogress ?? emptyFunc)(thisImg, ev);
		};
		xmlHTTP.onloadstart = function(ev) {
			thisImg.completedPercentage = 0;
			(callbacks.onloadstart ?? emptyFunc)(thisImg, ev);
		};
		xmlHTTP.onloadend = function(ev) {
			(callbacks.onloadend ?? emptyFunc)(thisImg, ev);
		}
		xmlHTTP.onabort = function(ev) {
			(callbacks.onabort ?? emptyFunc)(thisImg, ev);
		}
		xmlHTTP.onerror = function(ev) {
			(callbacks.onerror ?? emptyFunc)(thisImg, ev);
		}
		xmlHTTP.send();
	}
}

type ImageVoidCallback = (_base: ImageLoader, ev?: ProgressEvent) =>void;
interface CallbackOptions
{
	onload?: ImageVoidCallback;
	onloadend?: ImageVoidCallback;
	onloadstart?: ImageVoidCallback;
	onprogress?: ImageVoidCallback;
	onabort?: ImageVoidCallback;
	onerror?: ImageVoidCallback;
}