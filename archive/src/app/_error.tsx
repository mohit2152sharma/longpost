import React from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';

interface Props {
	statusCode: number;
}

const Error: React.FC<Props> = ({ statusCode }) => {
	const title = statusCode === 404 ? '404' : 'Error';

	return (
		<>
			<h1>{title}</h1>
			<p>
				{statusCode === 404
					? 'The page you are looking for could not be found.'
					: 'An error occurred.'}
			</p>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
	const statusCode = res ? res.statusCode : 404;

	if (statusCode === 404) {
		if (req.url && req.url.match(/\/$/)) {
			const withoutTrailingSlash = req.url.substr(0, req.url.length - 1);
			if (res) {
				res.writeHead(303, {
					Location: withoutTrailingSlash
				});
				res.end();
			} else {
				Router.push(withoutTrailingSlash);
			}
		}
	}

	return {
		props: {
			statusCode
		}
	};
};

export default Error;
