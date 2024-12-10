'use client';
import { LoginForm } from '~/components/login-form';

export default function Page() {
	return (
		<div className="absolute left-1/2 top-1/2 flex w-1/2 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center space-y-4">
			<div className="mt-6 flex flex-col items-center space-y-4">
				<h1 className="text-6xl font-bold">Longpost</h1>
				<p className="text-sm">Convert yout long posts into a thread</p>
			</div>
			<div className="flex flex-col items-center justify-center overflow-auto">
				<img src="bsky-thread.png" className="w-1/3" />
			</div>
			<div className="flex h-3/4 w-full flex-col items-center justify-center space-y-4 px-4">
				<LoginForm />
			</div>
		</div>
	);
}
