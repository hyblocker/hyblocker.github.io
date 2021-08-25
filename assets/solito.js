// Solito is a shitty UI framework i designed for this theme editor bc yes
var Solito = {};
window.solito = Solito;

_currVals = {};
_currVals["checkbox"] = 0;

Solito.createElement = function (name, classes, attributes, onClick, ...children) {

	// Create element
	let elem =  document.createElement(name);
	
	// add classes
	if (classes) {
		classes.forEach(className => {
			elem.classList.add(className);
		});
	}
	
	// add attributes
	if (attributes) {
		Object.keys(attributes).forEach(attribute => {
			elem.setAttribute(attribute, attributes[attribute]);
		});
	}

	// On click
	if (onClick) {
		elem.onclick = onClick;
	}

	// Append children
	children.forEach(currChild => {
		if (currChild) {
			if (isDOM(currChild)) {
				elem.appendChild(currChild);
			} else {
				elem.appendChild(document.createTextNode(currChild));
			}
		}
	});

	return elem;
}

Solito.createSwitch = function(value, onChange) {
	const checkBoxId = "checkbox-"+_currVals["checkbox"];
	const checkBox = Solito.createElement("input", ["switch-checkbox"], { id: checkBoxId, type: "checkbox" });
	if (value == true)
		checkBox.checked = value;
	checkBox.onchange = (function(e) {
		value = e.target.checked;
		if (onChange)
			onChange(e.target.checked);
	});
	_currVals["checkbox"]++;
	return Solito.createElement("div", ["switch"], { "aria-hidden": "true" }, null,
		checkBox,
		Solito.createElement("label", ["switch-label"], {for: checkBoxId}, null,
			Solito.createElement("span", ["switch-button"])
		)
	);
}

Solito.createDropdown = function(value, dropdown, onDropdown, onChange) {

	const previewElem = Solito.createElement("div", ["preview", "container"], null, null, dropdown[value].text);
	return Solito.createElement("div", ["dropdown", "clickable"], null, (function(e) {
		// Create a dropdown, and pass it down the function as a callback
		const dropdownPopout = Solito.createElement("div", ["container", "dropdown"], null, null);

		let height = 0;
		let width = 0;
		for (let i = 0; i < dropdown.length; i++) {
			let itemClasses = ["item"];
			if (value == i)
				itemClasses.push("selected");
			const item = Solito.createElement("span", itemClasses, null, function(e) {

				// Update internal value
				value = i;

				// Change text
				previewElem.innerText = dropdown[i].text;

				// Callback
				if (onChange) onChange(i);

				// Close popout
				const popout = _this.popoutStack.pop();
				if (popout) {
					popout.remove();
					_this.layerContainer.classList.remove("receiveClicks");
				}

			}, dropdown[i].text);

			const metrics = getTextDimensions(dropdown[i].text);
			height += 29; // TODO: Find good alternative
			width = Math.max(width, metrics.width);

			dropdownPopout.appendChild(item);
		}

		let topPosition = e.clientY;
		if (topPosition + height > window.innerHeight)
			topPosition = window.innerHeight - height - 8; // 8 px extra padding
		dropdownPopout.style.top = clamp(topPosition, 0, window.innerHeight);

		let leftPosition = e.clientX + 8;
		if (leftPosition + width > window.innerWidth)
			leftPosition = window.innerWidth - width - 8; // 8 px extra padding
		dropdownPopout.style.left = clamp(leftPosition, 0, window.innerWidth);

		dropdownPopout.style.width = width;
		dropdownPopout.style.height = height;

		onDropdown(dropdownPopout);

	}), previewElem);
}

Solito.createSlider = function(min, max, value, onChange, floatingDigits) {
	
	floatingDigits = floatingDigits === undefined ? 2 : floatingDigits;
	let sliderProgress, thumb, root;
	let dragging = false;

	let tooltip = null;

	// UI handling
	const sliderClickFunc = (function(e) {

		if ((window.mouseState & MOUSE_LEFT_CLICK) != MOUSE_LEFT_CLICK) {
			if (tooltip) {
				const popout = _this.popoutStack.pop();
				if (popout) {
					popout.remove();
				}
				tooltip = null;
			}
			dragging = false;
			return;
		}
		
		// Create tooltip if it doesnt exist
		if (tooltip == null) {
			tooltip = createLayer(["tooltip", "pointerDown"]);
			tooltip.appendChild(document.createTextNode(value));
			tooltip.style.position = "absolute";
		}

		// Update the slider control
		const percentage = (e.clientX - root.getBoundingClientRect().left) / root.clientWidth;
		value = Number(percentage * (max - min) + min);
		
		// Update visual UI
		const uiPercentage = clamp(percentage * root.clientWidth, 1, root.clientWidth - thumb.clientWidth - 1);
		sliderProgress.style.width = `${clamp(uiPercentage + thumb.clientWidth / 2, 0, root.clientWidth)}px`;
		thumb.style.left = `${uiPercentage}px`;
		if (onChange) onChange(value);
		
		// Update tooltip text
		tooltip.innerText = +(value).toFixed(floatingDigits);

		// Reposition the tooltip
		tooltip.style.left = e.clientX - tooltip.clientWidth / 2 + thumb.clientWidth / 2;
		tooltip.style.top = root.getBoundingClientRect().top + thumb.clientHeight;
	});

	const sliderDragFunc = (function(e) {
		if (dragging === true) {
			sliderClickFunc(e);
		}
	});
	const sliderMouseDownFunc = (function(e) {
		sliderClickFunc(e);
		dragging = true;
	});
	const sliderMouseUpFunc = (function(e) {
		if (dragging === true) {
			sliderClickFunc(e);
			dragging = false;
		}
	});

	// Create slider
	sliderProgress = Solito.createElement("div", ["progress"], null, sliderClickFunc);
	thumb = Solito.createElement("div", ["thumb"], null, sliderClickFunc);
	root = Solito.createElement("div", ["slider"], null, sliderClickFunc, sliderProgress, thumb);

	// Event handling
	sliderProgress.onmousedown = sliderMouseDownFunc;
	thumb.onmousedown = sliderMouseDownFunc;
	root.onmousedown = sliderMouseDownFunc;
	
	root.onmousemove = sliderDragFunc;

	sliderProgress.onmouseup = sliderMouseUpFunc;
	thumb.onmouseup = sliderMouseUpFunc;
	root.onmouseup = sliderMouseUpFunc;

	// Initial value
	let distFromLeft = (value - min) / (max - min) * 100.0;
	sliderProgress.style.width = `${distFromLeft + 1}%`;
	thumb.style.left = `${distFromLeft}%`;
	
	return root;
}

Solito.createColorPicker = function(value, onChange) {
	// TODO: some div with click => spawn layer dopo color picker => on change update css func
	
	return null;
}

function isDOM (o) {
	return (
		typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
		o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
	);
}

function getTextDimensions(text, font = getCanvasFontSize()) {
	// re-use canvas object for better performance
	const canvas = getTextDimensions.canvas || (getTextDimensions.canvas = document.createElement("canvas"));
	const context = canvas.getContext("2d");
	context.font = font;
	return context.measureText(text);
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFontSize(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';
  
  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

console.log("Loaded Solito!");