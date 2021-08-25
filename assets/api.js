var loadJS = function(url) {
	var scriptTag = document.createElement('script');
	scriptTag.src = url;
	document.body.appendChild(scriptTag);
};

var findDomObject = function(item) {
	return document.getElementsByClassName(item)[0];
}

var load = function (url, callback) {
	const xhr = new XMLHttpRequest();
	xhr.onload = function(e) { callback(e.currentTarget.response); };
	xhr.open("GET", url);
	xhr.responseType = 'text'
	xhr.send();
}

var getClosest = function (elem, selector) {

	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function(s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	// Get the closest matching element
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;

};

var contains = function (parent, child) {
	return parent !== child && parent.contains(child);
}

window.mouseState = MOUSE_NONE;

var MOUSE_NONE = 0;
var MOUSE_LEFT_CLICK = 1;
var MOUSE_RIGHT_CLICK = 2;
var MOUSE_MIDDLE_CLICK = 4;

window.onmousedown = function(e) {

	switch (e.which) {
		case 1: // left
			mouseState |= MOUSE_LEFT_CLICK;
			break;
		case 2: // middle
			mouseState |= MOUSE_MIDDLE_CLICK;
			break;
		case 3: // right
			mouseState |= MOUSE_RIGHT_CLICK;
			break;
		default:
			mouseState |= MOUSE_NONE;
			break;
	}
}

window.onmouseup = function(e) {

	switch (e.which) {
		case 1: // left
			mouseState &= ~MOUSE_LEFT_CLICK;
			break;
		case 2: // middle
			mouseState &= ~MOUSE_MIDDLE_CLICK;
			break;
		case 3: // right
			mouseState &= ~MOUSE_RIGHT_CLICK;
			break;
		default:
			mouseState &= ~MOUSE_NONE;
			break;
	}
}