function bring_back_thorn(node, eth_enabled) {
	if (node.nodeType === Node.TEXT_NODE) {
		let text = node.textContent;

		text = text.replace(/th/g, 'þ').replace(/Th/g, 'Þ').replace(/TH/g, 'Þ');

		if (eth_enabled) {
			text = text.replace(/dh/g, 'ð').replace(/Dh/g, 'Ð').replace(/DH/g, 'Ð');
		} else {
			text = text.replace(/dh/g, 'þ').replace(/Dh/g, 'Þ').replace(/DH/g, 'Þ');
		}

		node.textContent = text;
	} else {
		for (let child of node.childNodes) {
			if (child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE') {
				bring_back_thorn(child, eth_enabled);
			}
		}
	}
}

browser.storage.local.get('eth_enabled').then((result) => {
	bring_back_thorn(document.body, result.eth_enabled ?? false);
});
