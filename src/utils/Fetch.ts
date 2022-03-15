import { emptyFunc } from "@utils/utils";
import { Expire } from "@utils/DoExpire";

type XHRVoidCallback = (xhr: XMLHttpRequest, ev?: ProgressEvent) => void;
type ResponseDataT = 'blob' | 'arraybuffer' | 'json' | 'text';

export interface CallbackOptions
{
	/** This executes when the load is complete. */
	onload?: XHRVoidCallback;
    /** This executes when the request finishes downloading. */
	onloadend?: XHRVoidCallback;
    /** This executes when the request starts downloading content. */
	onloadstart?: XHRVoidCallback;
    /** This executes when download progress changes. */
	onprogress?: XHRVoidCallback;
    /** This executes when the user aborts the request. */
	onabort?: XHRVoidCallback;
    /** This executes when an error occurs. */
	onerror?: XHRVoidCallback;
}

export interface XHROptions<T extends unknown> extends CallbackOptions, Expire<T>
{
    /** Determines the data type of response. */
	responseType?: ResponseDataT;
	force?: boolean;
	beforeSave?: (data: any) => void;
	saveMimeType?: string;
}

export const defaultOptions: XHROptions<unknown> = {
	responseType: 'blob',
	onExpire: emptyFunc,
};

export function Fetch<T extends unknown>(url: string, options: XHROptions<T> = defaultOptions)
{
	if (!options.responseType)
		options.responseType = 'blob';
	if (!options.saveMimeType)
		options.saveMimeType = 'text/plain';

	return new Promise<T>((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = options.responseType!;
		xhr.onload = function(ev) {
			(options.onload ?? emptyFunc)(this, ev);
			resolve(this.response);
		}
		xhr.onloadstart = function(ev) {
			(options.onloadstart ?? emptyFunc)(this, ev);
		}
		xhr.onloadend = function(ev) {
			(options.onloadend ?? emptyFunc)(this, ev);
		}
		xhr.onprogress = function(ev) {
			(options.onprogress ?? emptyFunc)(this, ev);
		}
		xhr.onabort = function(ev) {
			(options.onabort ?? emptyFunc)(this, ev);
			resolve(null as unknown as T);
		}
		xhr.onerror = function(ev) {
			(options.onerror ?? emptyFunc)(this, ev);
			reject(ev);
		}
		xhr.send();
	});
}
