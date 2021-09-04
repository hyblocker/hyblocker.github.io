// Available themes
const repos = [
	{
		repo:"https://github.com/hyblocker/pixelcord",
		themeUrl:"https://hyblocker.github.io/pixelcord/index.css",
		config:"/pixelcord.json"
	}
];

// get the selected if from the URL
const urlParams = new URLSearchParams(window.location.search);
let selectedId = urlParams.get("selected");

const maxEvalIterations = 1000;

// Just a look up table basically lol
const knownIcons = {
	"list": "/assets/img/list.svg",
	"array": "/assets/img/list.svg",
	"group": "/assets/img/list.svg",
	"colour": "/assets/img/colors.svg",
	"color": "/assets/img/colors.svg",
	"paint": "/assets/img/brush.svg",
	"brush": "/assets/img/brush.svg",
	"extension": "/assets/img/extension.svg",
	"plugin": "/assets/img/extension.svg",
	"addon": "/assets/img/extension.svg",
	"add-on": "/assets/img/extension.svg",
	"base": "/assets/img/receipt.svg",
	"core": "/assets/img/receipt.svg",
	"receipt": "/assets/img/receipt.svg",
	"enhancement": "/assets/img/enhancement.svg",
	"feature": "/assets/img/functions.svg",
	"function": "/assets/img/functions.svg",
};

let currentTheme = {
	file:"",
	manifest: {
		name: "No Theme",
		author: "Deleted User",
	},
	categories: {},
	"requiredCSS": ``
};

var dumpJson = function() {
	console.log(JSON.stringify(currentTheme));
}

var _this;

injectTheme = function injectTheme(themeCss, id = "theme-current") {
	const iframeHead = _this.windowFrame.contentWindow.document.head;

	if (iframeHead && !_this.themePtr[id]) {
		_this.themePtr[id] = Solito.createElement("style", [id], {type: "text/css"});
		_this.themePtr[id].innerHTML = ".discord{}";
		iframeHead.appendChild(_this.themePtr[id]);
	}
	if (_this.themePtr[id].innerHTML != themeCss)
		_this.themePtr[id].innerHTML = themeCss;
}

// Begin preloading
window.addEventListener('load', function() {
	// JS is working, tell the DOM
	document.body.classList.remove("nojs");
	optimizeRebuildRate();

	// No theme selected, default to 0 for now, later go to theme picker
	selectedId = 0;

	_this = new Object();
	_this.themePtr = {};
	_this.popoutStack = [];
	_this.themeScroller = document.getElementsByClassName("scroller")[0];
	_this.themeName = document.getElementsByClassName("themeName")[0];
	_this.layerContainer = document.getElementsByClassName("layersContainer")[0];
	
	_this.layerContainer.onclick = function(e) {
		if (!_this.popoutStack.every(g => { return contains(g, e.target) })) {
			const popout = _this.popoutStack.pop();
			if (popout) {
				popout.remove();
				_this.layerContainer.classList.remove("receiveClicks");
			}
		}
	};
	
	console.log(_this);
	
	// Inject Preview
	let iframe = document.createElement("iframe");
	_this.windowFrame = iframe;
	iframe.style.display = "none";
	iframe.src = "/fake-discord";
	iframe.addEventListener("load", function (){
		iframe.style.display = "block";
	
		load(repos[selectedId].config, function (json) {
			currentTheme = JSON.parse(json);
			currentTheme.lastEdit = 0;
			prevTheme = currentTheme;
	
			// Setup theme props
			_this.themeName.innerText = currentTheme.manifest.name;
			document.title = currentTheme.manifest.name + " | Theme Editor (Early Access)";
			injectTheme(currentTheme.requiredImports + "\n" + currentTheme.requiredCSS, "theme-base");
			setupThemeCategories(currentTheme, _this.themeScroller);
			buildCss();
		});

		// Add zoom slider
		let zoom = 1;
		const zoomSlider = Solito.createSlider(0.5, 2, zoom, function(e) {
			zoom = e.toFixed(1);
			injectTheme(`html { transform-origin: 0 0; transform: scale(${zoom}); width: calc(100% / ${zoom}); height: calc(100% / ${zoom}); }`, "zoom-control");
		}, 1);
		// Icon
		const magnifyingGlass = Solito.createElement("img", ["icon", "zoom"], {src: "/assets/img/zoom.svg"});
		// Shove into DOM
		document.getElementsByClassName("header")[0].appendChild(magnifyingGlass);
		document.getElementsByClassName("header")[0].appendChild(Solito.createElement("div", ["sliderContainer", "zoomSlider"], null, null, zoomSlider));

		const somePromise = new Promise((resolve, reject) => {
			setTimeout(null, 10000);
		}).then(
			iframe.contentWindow.scrollMessagesToBottom()
		);
	});

	document.getElementsByClassName("preview")[0].appendChild(iframe);

	const downloader = document.getElementsByClassName("downloader")[0].children[1].children;

	const len = downloader.length;
	let i = 0;
    while (i < len) {

		// Downloader code

		if (downloader[i].innerText === "Powercord") {
			downloader[i].onclick = (function()  {

				let manifestJson = "{\n";

				// Write metadata
				Object.keys(currentTheme.manifest).forEach(
					e => manifestJson += `    "${e}": "${currentTheme.manifest[e]}",\n`
				);

				// Powercord theme file
				manifestJson += `    "theme": "${currentTheme.file}"`;
				
				// Powercord splash file
				if (currentTheme.splash != undefined)
					manifestJson += `,\n    "splashTheme": "${currentTheme.splash}"`;

				manifestJson += "\n}";

				// CSS
				let css = currentTheme.requiredImports + buildCss() + currentTheme.requiredCSS;

				// TODO: git clone

				// Add to zip
				let zip = new JSZip();
				zip.file(`${currentTheme.manifest.name}/powercord_manifest.json`, manifestJson);
				zip.file(`${currentTheme.manifest.name}/manifest.json`, manifestJson);

				zip.file(`${currentTheme.manifest.name}/${currentTheme.file}`, css);

				// Splash file is from an external endpoint, so we have to wait for it to get loaded
				// Also code fork ew
				// TODO: splash file

				if (currentTheme.splash != undefined) {

					const splashFileName = currentTheme.splash.split('/').pop().split('#')[0].split('?')[0];

					load(repos[selectedId].themeUrl, function (themeData) {
						zip.file(`${currentTheme.manifest.name}/${currentTheme.file}`, themeData);

						zip.generateAsync({type:"blob"}).then(function(blob) {
							saveAs(blob, `${currentTheme.manifest.name}.zip`);
						});
					});
				}
				else {
					zip.generateAsync({type:"blob"}).then(function(blob) {
						saveAs(blob, `${currentTheme.manifest.name}.zip`);
					});
				}
			});
		}
		else if (downloader[i].innerText === "Better Discord") {
			downloader[i].onclick = (function(){

				let bdManifest = "/**\n";
				Object.keys(currentTheme.manifest).forEach(
					e => bdManifest += ` * @${e} ${currentTheme.manifest[e]}\n`
				);
				bdManifest += "*/";
				let css = currentTheme.requiredImports + buildCss() + currentTheme.requiredCSS;

				let blob = new Blob([`${bdManifest}\n\n${css}`], {type: "text/plain;charset=utf-8"});
				saveAs(blob, `${currentTheme.manifest.name}.theme.css`);

			});
		}

        i++;
    }

}, false);

function buildPropertyEditor(prop) {
	// console.log(prop);
	prop.value = prop.defaultValue;
	let TypeClass = "backgroundColor";
	let control = null;
	switch (prop.type) {
		case "color":
			TypeClass = "backgroundColor";
			const colorPickerContainer = Solito.createElement("div", ["container"], {style:`background-color: ${prop.defaultValue}`});
			control = Solito.createElement("div", ["colorPicker"], null, (function(e) {
				const layer = createLayer(["colorPickerPopout"]);
				layer.setAttribute("acp-color", prop.value);
				layer.style.position = "absolute";

				let topPosition = e.clientY;
				if (topPosition + 350 > window.innerHeight)
					topPosition = window.innerHeight - 350 - 8; // 8 px extra padding
				layer.style.top = clamp(topPosition, 0, window.innerHeight);

				layer.style.left = e.clientX + 8;
				_this.layerContainer.classList.add("receiveClicks");
				AColorPicker.from('.layer.colorPickerPopout')
					.on('change', (picker, color) => {
						colorPickerContainer.style.backgroundColor = color;
						prop.value = color;
						buildCss();
					});
				buildCss();
			}), colorPickerContainer);
			break;
		case "import":
			TypeClass = "cssImport";
			if (prop.url) {
				control = Solito.createSwitch(prop.value, function(newValue) {
					prop.value = newValue;
					buildCss();
				});
			} else if (prop.dropdown) {
				control = Solito.createDropdown(prop.value, prop.dropdown,
				function(dropdownPopout) {
					dropdownPopout.classList.add("layer");
					_this.layerContainer.appendChild(dropdownPopout);
					_this.popoutStack.push(dropdownPopout);
					_this.layerContainer.classList.add("receiveClicks");
				},
				function(newValue) {
					prop.value = newValue;
					buildCss();
				});
			}
			break;
		case "float":
			TypeClass = "float";

			// Try getting values
			let min = 0;
			let max = 100;
			if (prop.min)
				min = prop.min;
			if (prop.max)
				max = prop.max;

			const unit = (prop.unit == null || prop.unit == undefined) ? "px" : prop.unit;

			prop.value = prop.defaultValue;
			const slider = Solito.createSlider(min, max, prop.value, function(e) {
				prop.value = e.toFixed(2) + unit;
				buildCss();
			});


			control = Solito.createElement("div", ["container"], null, null, slider);
			break;
	}
	// Define the control as a control in CSS
	control.classList.add("propertyControl");
	return Solito.createElement("div", ["customisableItem", TypeClass], null, null, 
		Solito.createElement("div", ["propertyMeta"], null, null,
			Solito.createElement("span", ["titleSmall", "fontsize12", "propertyName"], null, null, prop.name),
			Solito.createElement("span", ["titleSmall", "fontsize12", "propertyDescription"], null, null, prop.description),
		),
		control
	);
}

function insertCategory(name, icon, contents) {

	if (icon === null || icon === undefined)
		icon = "/assets/img/list.svg";

	// create header and root container
	let category = Solito.createElement("section", ["category", "expanded"], null, null,
		Solito.createElement("div", ["header"], null, function(e) {
			// click to hide / unhide
			const categry = getClosest(e.srcElement, ".category");
			if (categry.classList.contains("expanded")) {
				categry.classList.remove("expanded");
				categry.classList.add("collapsed");
			} else {
				categry.classList.add("expanded");
				categry.classList.remove("collapsed");
			}
		},
			Solito.createElement("img", ["categoryIcon"], { src: icon }),
			Solito.createElement("span", ["titleLarge", "fontSize14"], null, null, name),
		),
		Solito.createElement("div", ["itemViewer"]),
	);
	// push contents
	contents.forEach(themeProp => {
		if (!themeProp.hidden || themeProp.hidden != true)
			category.lastChild.appendChild(buildPropertyEditor(themeProp));
	});
	return category;
}

function setupThemeCategories(theme, scroller) {

	const downloaderElement = document.getElementsByClassName("downloader")[0];
	Object.keys(theme.categories).forEach(currCategory =>  {
		
		let icn = null;
		const lookup = currCategory.trim().toLowerCase();
		Object.keys(knownIcons).forEach(
			e => {
				if (lookup.includes(e.trim().toLowerCase())) {
					icn = knownIcons[e];
				}
			}
		);

		const categoryCard = insertCategory(currCategory, icn, theme.categories[currCategory])
		scroller.insertBefore(categoryCard, downloaderElement);
	});
}

function createLayer(classes) {
	const theLayer = Solito.createElement("div", ["layer", ...classes]);
	_this.layerContainer.appendChild(theLayer);
	_this.popoutStack.push(theLayer);
	return theLayer;
}

function convertToRGB(strIn) {
	if (strIn.length == 6) {
		var aRgbHex = strIn.match(/.{1,2}/g);
		var aRgb = [
			parseInt(aRgbHex[0], 16),
			parseInt(aRgbHex[1], 16),
			parseInt(aRgbHex[2], 16)
		];
		return aRgb;
	} else if (strIn.length == 3) {
		var aRgbHex = strIn.match(/.{1,1}/g);
		var aRgb = [
			parseInt(aRgbHex[0], 16),
			parseInt(aRgbHex[1], 16),
			parseInt(aRgbHex[2], 16)
		];
		return aRgb;
	}
}
function contrastingColor(...color) {
    return (luma(color) >= 165) ? '#000' : '#fff';
}
// color can be a hx string or an array of RGB values 0-255
function luma(color) {
    const rgb = color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
}
function hexToRGBArray(color) {
    if (color.length === 3)
        color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
    else if (color.length !== 6)
        throw('Invalid hex color: ' + color);
	const rgb = [];
    for (var i = 0; i <= 2; i++)
        rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
}

function parseColorToString(c) {

	if (c[0] == '#')
		return colorComponents = convertToRGB(c.substring(1));
	else if (c.startsWith("rgba"))
		return colorComponents = c.substring(5).slice(0, -1).split(',');
	else if (c.startsWith("rgb"))
		return colorComponents = c.substring(4).slice(0, -1).split(',');

	return c;
}

const cssVarSelector = /#{([^;]*)}/g;
let lastEdit;

let cssRebuildsInASecond = Math.floor(1000 / 15);
let lastRebuild = Date.now();

function buildCss() {

	const currTime = Date.now();
	// Early terminate
	if (lastRebuild + cssRebuildsInASecond > currTime)
		return;

	if (currentTheme.lastEdit === lastEdit)
		return;

	let cssRules = {};
	let ids = {};
	let css = "";
	let imports = "";
	console.log("Building CSS!");
	
	Object.keys(currentTheme.categories).forEach(currCategoryName =>  {
		const categoryContents = currentTheme.categories[currCategoryName];
		categoryContents.forEach(themeProp => {
			switch (themeProp.type) {
				case "import":
					let cssImportRule = `@import url(${themeProp.url});`;
					if (themeProp.value === false) {
						cssImportRule = `/* ${cssImportRule} */`;
					}
					else if(themeProp.dropdown !== undefined) {
						cssImportRule = "";
						let cssImportRuleBuffer = `@import url(${themeProp.dropdown[0]});`;
						for (let i = 0; i < themeProp.dropdown.length; i++) {
							cssImportRuleBuffer = `@import url(${themeProp.dropdown[i].url});`;
							
							if (themeProp.value != i)
								cssImportRuleBuffer = `/* ${cssImportRuleBuffer} */`;
							
							cssImportRule += `${i == 0 ? '' : '\n'}${cssImportRuleBuffer}`;
						};
					}
					imports += `\n/* ${currCategoryName} | ${themeProp.name} - ${themeProp.description} */\n${cssImportRule}\n`;
					break;
				case "color":
					if (!themeProp.selector)
						themeProp.selector = ":root"
					if (!cssRules[themeProp.selector])
						cssRules[themeProp.selector] = {};
					cssRules[themeProp.selector][themeProp.prop] = themeProp;
					ids[themeProp.id] = themeProp;
					break;
				case "float":
					if (!themeProp.selector)
						themeProp.selector = ":root"
					if (!cssRules[themeProp.selector])
						cssRules[themeProp.selector] = {};
					cssRules[themeProp.selector][themeProp.prop] = themeProp;
					ids[themeProp.id] = themeProp;
					break;
			}
		});
	});

	Object.keys(cssRules).forEach(currSelector => {
		css += currSelector + " {\n";
		const rules = cssRules[currSelector];
		Object.keys(rules).forEach(currRule => {
			let currentRule = rules[currRule].value;
			let current = rules[currRule];
			if (rules[currRule].dependsOn && rules[currRule].dependsOn.length > 0) {
				
				if (rules[currRule].autoCalc) {

					let calculatedValue = rules[currRule].autoCalc;
					for (let i = 0; i < rules[currRule].dependsOn.length; i++) {
						const nextSelector = rules[currRule].dependsOn[i];
						calculatedValue = calculatedValue.replace(`#{${ids[nextSelector].prop}}`, parseColorToString(ids[nextSelector].value).join(", "));
					}
					currentRule = calculatedValue;
				} else if (rules[currRule].func) {

					let calculatedValue = rules[currRule].func;
					for (let i = 0; i < rules[currRule].dependsOn.length; i++) {
						const nextSelector = rules[currRule].dependsOn[i];
						calculatedValue = rules[currRule].func.replace(`#{${ids[nextSelector].prop}}`, (parseColorToString(ids[nextSelector].value)));
					}

					// Fake eval
					currentRule = eval(calculatedValue);
				}
			}
					
			css += "    " + currRule + ": " + currentRule + ";\n";
		});
		css += "}\n"
	});

	css = imports + "\n" + css;
	console.log(css);
	lastEdit = currentTheme;
	currentTheme.lastEdit++;
	
	injectTheme(css);
	lastRebuild = currTime;
	
	return css;
}

const optimizeRebuildRate = function() {
	const _speedconstant = 8.9997e-9; //if speed=(c*a)/t, then constant=(s*t)/a and time=(a*c)/s
	const d = new Date();
	const amount = 150000000;
	
	for (let i = amount; i > 0; i--) {}
	
	const newd = new Date();
	const accnewd = Number(String(newd.getSeconds()) + "." + String(newd.getMilliseconds()));
	const accd = Number(String(d.getSeconds()) + "." + String(d.getMilliseconds())); 
	let di = accnewd - accd;
	// console.log(accnewd, accd, di);
	if (d.getMinutes() != newd.getMinutes()) {
		di = (60 * (newd.getMinutes() - d.getMinutes())) + di;
	}
	spd = (_speedconstant * amount ) / di;
	const speedMetric = Math.abs(Math.round(spd * 1000) / 1000);
	// console.log(`Time: ${ Math.round(di * 1000) / 1000 }s, estimated speed: ${ speedMetric }GHz`);
	
	cssRebuildsInASecond = Math.round(speedMetric / 4);
}