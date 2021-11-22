interface User {
	name: string;
	email: `${string}@${string}`;
	date: string;
	url?: string;
	username?: string;
}

interface Verification {
	verified: boolean;
	reason: string;
	signature: string;
	payload: string;
}

export default interface GitCommit {
	sha: string;
	author: User;
	commiter: User;
	message: string;
	url: string;
	comment_count: number;
	verification: Verification;
}