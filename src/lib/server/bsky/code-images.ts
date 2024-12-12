import { codeToHtml } from 'shiki';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { onlyOneParam } from '$lib/lib-utils';

interface CodeSnippet {
	language?: string;
	code: string;
	codeSnippetStartingIndex: number;
	codeSnippetEndingIndex: number;
	codeSnippet: string;
}

interface CodeImage {
	title: string;
	imageProperties: ImageProperties;
	code: string;
}

interface ImageProperties {
	outputPath: string;
	width: number;
	height: number;
}

async function extractCode(text: string): Promise<Array<CodeSnippet>> {
	const codeSnippets: Array<CodeSnippet> = [];
	const regex = /```(?<language>[a-zA-Z]*)\n(?<code>[\s\S]*?)```/g;
	const matches = text.matchAll(regex);
	for (const match of matches) {
		if (match) {
			const code = match.groups?.code ? match.groups.code : '';
			codeSnippets.push({
				language: match.groups?.language,
				code: code,
				codeSnippet: match[0],
				codeSnippetStartingIndex: match.index,
				codeSnippetEndingIndex: match.index + match[0].length
			});
		}
	}
	return codeSnippets;
}

async function renderCodeTextToHtml(code: string, lang: string, theme: string = 'vitesse-dark') {
	return codeToHtml(code, {
		lang,
		theme,
		transformers: [
			{
				pre(node) {
					delete node.properties.style;
				}
			}
		]
	});
}

async function htmlToImage(html: string, outputPath: string): Promise<ImageProperties> {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
	const page = await browser.newPage();
	await page.setViewport({
		width: 3849,
		height: 2160,
		deviceScaleFactor: 2
	});

	await page.setContent(html, { waitUntil: 'networkidle0' });

	// Add padding around the content
	const padding = 20;
	const element = await page.$('div.window');
	let width: number = 0;
	let height: number = 0;
	if (element) {
		const boundingBox = await element.boundingBox();

		if (boundingBox) {
			const x = boundingBox.x - padding;
			const y = boundingBox.y - padding;
			width = boundingBox.width + padding * 2;
			height = boundingBox.height + padding * 2;
			await page.screenshot({
				path: outputPath,
				clip: { x, y, width, height },
				omitBackground: true,
				type: 'png',
				captureBeyondViewport: true
			});
		}
	}

	await page.close();
	await browser.close();
	return { outputPath: outputPath, width: width, height: height };
}

async function renderCodeSnippet(
	codeSnippet: CodeSnippet,
	outputPath: string,
	{ snippetIndex, imageTitle }: { snippetIndex?: number; imageTitle?: string }
): Promise<CodeImage> {
	const lang = codeSnippet.language ? codeSnippet.language : '';
	const code = codeSnippet.code ? codeSnippet.code : '';
	onlyOneParam(snippetIndex, imageTitle);
	const title = imageTitle ? imageTitle : `image_${snippetIndex}`;
	const htmlCode = await renderCodeTextToHtml(code, lang);
	const html = await readHtmlFileAsTemplate('apple-window.html', {
		code: htmlCode,
		imageTitle: title
	});
	const imageProperties = await htmlToImage(html, outputPath);
	return { title, imageProperties, code };
}

async function readHtmlFileAsTemplate(filePath: string, variables: Record<string, string>) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const absolutePath = path.resolve(__dirname, filePath);
	let content = await fs.promises.readFile(absolutePath, 'utf-8');
	for (const [key, value] of Object.entries(variables)) {
		const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
		content = content.replace(regex, value);
	}
	return content;
}

export {
	type CodeImage,
	type CodeSnippet,
	type ImageProperties,
	renderCodeSnippet,
	htmlToImage,
	extractCode,
	renderCodeTextToHtml
};
