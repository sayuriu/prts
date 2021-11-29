import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
	providedIn: 'root'
})
export class ErrorService {
	errorMessage = '';
	constructor(private router: Router) { }

	Handle(err: HttpErrorResponse) {
		this.createMessage(err);
		if (err.status >= 400 && err.status < 500) this.handle4xxErrors(err);
		if (err.status >= 500 && err.status < 600) this.handle5xxErrors(err);
		else this.handleUnknownErrors(err);
	}

	private handle4xxErrors(err: HttpErrorResponse) {
		this.router.navigate(['/4xx']);
	}
	private handle5xxErrors(err: HttpErrorResponse) {
		this.router.navigate(['/5xx']);
	}
	private handleUnknownErrors(err: HttpErrorResponse) {
		null;
	}

	private createMessage(err: HttpErrorResponse) {
		this.errorMessage = err.error || err.statusText;
	}
}
