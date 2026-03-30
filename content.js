function bring_back_thorn(node) {
	if (node.nodeType === Node.TEXT_NODE) {
		let text = node.textContent;

		text = text.replace(/th/g, 'þ');
		text = text.replace(/Th/g, 'Þ');
		text = text.replace(/TH/g, 'Þ');
		text = text.replace(/dh/g, 'ð');
		text = text.replace(/Dh/g, 'Ð');
		text = text.replace(/DH/g, 'Ð');

		node.textContent = text;
	} else {
		for (let i = 0; i < node.childNodes.length; i++) {
			const child = node.childNodes[i];
			if (child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE') {
				bring_back_thorn(child);
			}
		}
	}
}

bring_back_thorn(document.body);
