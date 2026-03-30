browser.storage.local.get('eth_enabled').then((result) => {
	eth_toggle.checked = result.eth_enabled ?? false;
});

eth_toggle.addEventListener('change', () => {
	browser.storage.local.set({ eth_enabled: eth_toggle.checked });
	browser.tabs.reload();
});
