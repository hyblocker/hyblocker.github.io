fixTextbox = function () {
	const textboxRoot = findDomObject(shitcord._classes.TextboxRoot);

	const MsgContainer = textboxRoot.children[1];
	MsgContainer.innerText = "";

	textboxRoot.onkeyup = ((e) => {
		const placeholder = textboxRoot.getElementsByClassName(shitcord._classes.TextboxPlaceholder)[0];
		if (MsgContainer.innerText.length == 0) {
			// Add placeholder if it doesnt exist
			if (!placeholder) {
				textboxRoot.prepend(shitcord.getComponent("textboxPlaceholder"));
			}
		} else {
			// Yeet!
			if (placeholder) {
				placeholder.parentNode.removeChild(placeholder);
			}
		}
	});
}