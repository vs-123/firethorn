const UPPER_THORN = 'Þ';
const LOWER_THORN = 'þ';
const UPPER_ETH = 'Ð';
const LOWER_ETH = 'ð';
const SKIP_TAGS = [ 'TEXTAREA', 'INPUT', 'SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'];

function transform_text(text, eth_enabled) {
	text = text.replace(/th/g, LOWER_THORN).replace(/Th/g, UPPER_THORN).replace(/TH/g, UPPER_THORN);
	if (eth_enabled) {
		text = text.replace(/dh/g, LOWER_ETH).replace(/Dh/g, UPPER_ETH).replace(/DH/g, UPPER_ETH);
	} else {
		text = text.replace(/dh/g, LOWER_THORN).replace(/Dh/g, UPPER_THORN).replace(/DH/g, UPPER_THORN);
	}
	return text;
}

function bring_back_thorn(node, eth_enabled) {
	if (node.nodeType === Node.TEXT_NODE) {
		node.textContent = transform_text(node.textContent, eth_enabled);
	} else {
		for (let child of node.childNodes) {
			if (!SKIP_TAGS.includes(child.nodeName)) {
				bring_back_thorn(child, eth_enabled);
			}
		}
	}
}

browser.storage.local.get(['eth_enabled', 'blacklist']).then((result) => {
	const is_eth = result.eth_enabled ?? false;
	const blacklist = result.blacklist || [];
	const currentDomain = window.location.hostname;

	if (!blacklist.includes(currentDomain)) {
		bring_back_thorn(document.body, is_eth);

		const observer = new MutationObserver((mutations) => {
			for (let mutation of mutations) {
				for (let newNode of mutation.addedNodes) {
					bring_back_thorn(newNode, is_eth);
				}
			}
		});

		observer.observe(document.body, { childList: true, subtree: true });
	}
});


