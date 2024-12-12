import { extractCode } from '$lib/server/bsky/code-images';
import { describe, it, expect } from 'vitest';

const InputTexts = [
	// when there is no code snippet
	'This text contains no code snippets.',
	// when there is a single code snippet with language
	'Here is some code:\n```javascript\nconsole.log("Hello, World!");\n```',
	// when there are multiple code snippets with different languages
	'Code snippets:\n```python\nprint("Hello, Python!")\n```\nAnd another one:\n```javascript\nconsole.log("Hello, JavaScript!");\n```',
	// when there is a code snippet without a specified language
	'Here is some code:\n```\nconsole.log("Hello, World!");\n```'
];

const ExpectedOutputs = [
	// [language, code, codeSnippetStartingIndex, codeSnippetEndingIndex, codeSnippet]
	[],
	[
		[
			'javascript',
			'console.log("Hello, World!");\n',
			19,
			66,
			'```javascript\nconsole.log("Hello, World!");\n```'
		]
	],
	[
		['python', 'print("Hello, Python!")\n', 15, 52, '```python\nprint("Hello, Python!")\n```'],
		[
			'javascript',
			'console.log("Hello, JavaScript!");\n',
			70,
			122,
			'```javascript\nconsole.log("Hello, JavaScript!");\n```'
		]
	],
	[['', 'console.log("Hello, World!");\n', 19, 56, '```\nconsole.log("Hello, World!");\n```']]
];

const TestCases = InputTexts.map((inputText, index) => {
	return ExpectedOutputs[index].length === 0
		? {
				input: inputText,
				expectedOutput: []
			}
		: {
				input: inputText,
				expectedOutput: ExpectedOutputs[index].map((e) =>
					e.length === 0
						? []
						: {
								language: e[0],
								code: e[1],
								codeSnippetStartingIndex: e[2],
								codeSnippetEndingIndex: e[3],
								codeSnippet: e[4]
							}
				)
			};
});

describe('extractCode', () => {
	it.each(TestCases)(
		'should extract code snippets correctly',
		async ({ input, expectedOutput }) => {
			const matches = await extractCode(input);
			if (matches.length === 0) {
				expect(matches).toEqual(expectedOutput);
			} else {
				for (const [i, match] of matches.entries()) {
					expect(match).toEqual(expectedOutput[i]);
				}
			}
		}
	);
});
