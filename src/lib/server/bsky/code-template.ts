async function getHtmlString(imageTitle: string, code: string): Promise<string> {
	const htmlString = `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Apple-like Application Window</title>
		<style>
			body {
				margin: 0;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
					sans-serif;
				background-color: #f5f5f7;
			}
			.window {
				width: 600px;
				margin: 50px auto;
				border-radius: 12px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				overflow: hidden;
				background-color: white;
			}
			.title-bar {
				height: 24px;
				background-color: #e0e0e0;
				display: flex;
				align-items: center;
				padding: 0 10px;
				justify-content: space-between;
			}
			.title-bar .buttons {
				display: flex;
				gap: 8px;
			}
			.title-bar .image-title {
				font-weight: lighter;
				font-size: x-small;
				font-style: italic;
				color: darkgray;
			}
			.button {
				width: 12px;
				height: 12px;
				border-radius: 50%;
			}
			.close {
				background-color: #ff5f56;
			}
			.minimize {
				background-color: #ffbd2e;
			}
			.maximize {
				background-color: #27c93f;
			}
			.content {
				padding: 20px;
			}
		</style>
	</head>
	<body>
		<div class="window">
			<div class="title-bar">
				<div class="buttons">
					<div class="button close"></div>
					<div class="button minimize"></div>
					<div class="button maximize"></div>
				</div>
				<div class="image-title">${imageTitle}</div>
			</div>
			<div class="content">${code}</div>
		</div>
	</body>
</html>`;
	return htmlString;
}

export { getHtmlString };
