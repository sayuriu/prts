import { Injectable } from '@angular/core';

// This will be limited to components that rely on heavy uses of images.
@Injectable({
	providedIn: 'root'
})
export class ImageDataService {
	cache!: [];
	constructor() { }
}

interface ImageData
{
	id: string;
	time: number;
	rawData: Blob;
	lifeTime: number;
	onExpires?: (data: this) => void;
}