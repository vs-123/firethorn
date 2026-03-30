const eth_toggle = document.querySelector("#eth_toggle");
const blacklist_btn = document.querySelector("#blacklist_btn");
const save_btn = document.querySelector("#save_blacklist");
const blacklist_input = document.querySelector("#blacklist_input");
const status_msg = document.querySelector("#status_msg");

function show_status(msg, colour = "#27ae60") {
	status_msg.textContent = msg;
	status_msg.style.color = colour;
	setTimeout(() => { status_msg.textContent = ""; }, 2000);
}

browser.storage.local.get(["eth_enabled", "blacklist"]).then((result) => {
	eth_toggle.checked = result.eth_enabled ?? false;
	if (result.blacklist) {
		blacklist_input.value = result.blacklist.join("\n");
	}
});

eth_toggle.addEventListener("change", () => {
	browser.storage.local.set({ eth_enabled: eth_toggle.checked });
	browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
		browser.tabs.reload(tabs[0].id);
	});
});

save_btn.addEventListener("click", () => {
	const list = blacklist_input.value
		.split("\n")
		.map(s => s.trim())
		.filter(s => s.length > 0);

	browser.storage.local.set({ blacklist: list }).then(() => {
		show_status("Blacklist saved!");
	});
});

blacklist_btn.addEventListener("click", async () => {
	let tabs = await browser.tabs.query({active: true, currentWindow: true});
	let domain = new URL(tabs[0].url).hostname;

	let data = await browser.storage.local.get("blacklist");
	let blacklist = data.blacklist || [];

	if (!blacklist.includes(domain)) {
		blacklist.push(domain);
		await browser.storage.local.set({ blacklist: blacklist });
		blacklist_input.value = blacklist.join("\n");

		show_status(`Added ${domain}`);
		setTimeout(() => {
			browser.tabs.reload(tabs[0].id);
			window.close();
		}, 1000);
	} else {
		show_status("Already blacklisted", "#e67e22");
	}
});
