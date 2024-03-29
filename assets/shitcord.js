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
// literally just objects, enums and constructors lmao

// SECTION ENUMS

var ProfilePictureMode = {
	Static: 0,
	Gif: 1,
};
var Status = {
	Online: 0,
	Idle: 1,
	DoNotDisturb: 2,
	Offline: 3,
	Streaming: 4,
};
var IconTop = {
	None: 0,
	VoiceChat: 1,
	Screenshare: 2,
	Stagehouse: 3,
};
var Colors = {
	Green: 0,
	Yellow: 1,
	Red: 2,
};
var TooltipDirection = {
	Top: 0,
	Bottom: 1,
	Left: 2,
	Right: 3,
}

// SUB ENUM.UTILS

window.statusToString = function(status) {
	switch (status) {
		case Status.Online:
			return "Online";
		case Status.Idle:
			return "Idle";
		case Status.DoNotDisturb:
			return "Do Not Disturb";
		case Status.Offline:
			return "Offline";
	}
	return status;
}

// SECTION USER

function User(id, username, discriminator, avatarURLBase, animated, status, aboutMe, color, bot) {
	this.id = id;
	this.username = username;
	this.discriminator = discriminator;
	this.avatarURLBase = avatarURLBase;
	this.animated = animated;
	this.status = status;
	this.aboutMe = aboutMe;
	this.color = color;
	this.bot = bot;
}
User.prototype.avatarURL = function(mode, size = 128) {
	return this.avatarURLBase != "" ?
	("https://cdn.discordapp.com/avatars/" + this.avatarURLBase + (this.animated && mode == ProfilePictureMode.Gif ? ".gif" : ".webp") + "?size=" + size)
		: "/fake-discord/assets/avatar_default_icon.png";
}

// SUB USER.UTILS

window.getSelfUser = function() {
	return window.shitcord.users[1];
}
window.getUser = function(id) {
	for (let i=0; i < window.shitcord.users.length; i++)
		if (window.shitcord.users[i].id == id)
			return window.shitcord.users[i];
}

// SECTION GUILDS

function Guild(id, displayName, icon) {
	this.id = id;
	this.displayName = displayName;
	this.icon = icon;
}
Guild.prototype.avatarURL = function(mode, size = 128) {
	return this.avatarURLBase != "" ?
	("https://cdn.discordapp.com/icons/" + this.icon + ".webp?size=" + size)
		: "/fake-discord/assets/avatar_default_icon.png";
}

window.getGuild = function(id) {
	for (let i=0; i < window.shitcord.guilds.length; i++)
		if (window.shitcord.guilds[i].id == id)
			return window.shitcord.guilds[i];
}
function GuildFolder(color, ...guilds) {
	this.color = color;
	this.guilds = guilds;
}

// SECTION CHANNELS



// SECTION LAYERS
window.createLayer = function(backdrop, layer) {

	const appRoot = document.getElementsByClassName(shitcord._classes.App_Root)[0];
	const layerContainers = (document.getElementsByClassName(shitcord._classes.Layer_Container));
	let layerContainer = layerContainers[1];
	for (let i = 0; i < layerContainers.length; i++) {
		if (layerContainers[i].parentNode == appRoot) {
			layerContainer = layerContainers[i];
			break;
		}
	}
	const createBackdrop = function() {
		return Solito.createElement("div", [shitcord._classes.Layer_Backdrop, shitcord._classes.With_Layer]);
	}
	if (backdrop) {
		layerContainer.insertBefore(createBackdrop(), layerContainer.firstChild);
	}

	layerContainer.appendChild(layer);

	return layer;
}

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function genUuid() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}
const KEY_ESCAPE = 27;

// loader
window.addEventListener("DOMContentLoaded", function() {

	scrollMessagesToBottom();	
	cacheComponents();

	// Functionality
	membersList();
	constructGuildsSlider();
	fixTextbox();

	// Load a theme if we can
	const urlParams = new URLSearchParams(window.location.search);
	const file = urlParams.get("file");
	if (file != null) {
		load(file, function (cssToInject) {
			const headTag = document.head;
			const cssTag = Solito.createElement("style", [id], {type: "text/css"});
			cssTag.innerHTML = cssToInject;
			headTag.appendChild(cssTag);
		});
	}
});

// keyboard handler 
window.onkeyup = function(e) {
	switch(e.keyCode) {
		case KEY_ESCAPE:
			scrollMessagesToBottom();
			break;
	}

	document.documentElement.classList.remove("mouse-mode");
}
// mouse handler
window.onmousemove = function(e) {
	document.documentElement.classList.add("mouse-mode");
}

// Focusing or something

document.addEventListener("focus", function() {
	document.documentElement.classList.remove("app-focused");
}, false);
document.addEventListener("blur", function() {
	document.documentElement.classList.add("app-focused");
}, false);

function handleVisibilityChange() {
	if (document.visibilityState === "hidden") {
		document.documentElement.classList.remove("app-focused");
	} else  {
		document.documentElement.classList.add("app-focused");
	}
}

function cacheComponents() {
	
	// Cache components
	window.shitcord.components = {};
	const componentsRoot = document.getElementById("components");

	for (let i = 0; i < componentsRoot.children.length; i++) {
		console.log(componentsRoot.children[i].id);
		window.shitcord.components[componentsRoot.children[i].id] = componentsRoot.children[i].cloneNode(true);
	}
	
	componentsRoot.remove();
	console.log(window.shitcord.components);
}
  
document.addEventListener("visibilitychange", handleVisibilityChange, false);

function scrollMessagesToBottom() {
	// Keep message scrollbar locked at bottom
	let messageBody = document.getElementsByClassName('scroller-2LSbBU')[0];
	messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}

initShitcord = function() {
		
	window.shitcord = {
		users: [
			new User(
				id= "1",
				username= "Hyblocker",
				discriminator="6869",
				avatarURLBase="346338830011596800/d740df0c81f9d54e110fa80433db76b4",
				animated=true,
				status=Status.DoNotDisturb,
				aboutMe="Lorem ipsum sit dolor amet",
				roles=[0],
				bot=false,
			),
			new User(
				id= "2",
				username= "Some User",
				discriminator="7626",
				avatarURLBase="",
				animated=false,
				status=Status.DoNotDisturb,
				aboutMe="Hello!",
				roles=[0],
				bot=false,
			),
			new User(
				id= "3",
				username= "Rythm",
				discriminator="7626",
				avatarURLBase="",
				animated=false,
				status=Status.Online,
				aboutMe="Hello!",
				roles=[0],
				bot=true,
			),
			new User(
				id= "4",
				username= "Giren",
				discriminator="9461",
				avatarURLBase="492134292634337295/b914a1d6f1b6fb5b5373a09793febe9f",
				animated=false,
				status=Status.Online,
				aboutMe="We do a little trolling\nGoat at R6 and Valorant \n\n:small_red_triangle:https://shiro.is\n:small_red_triangle_down:https://beta.crunchyroll.com/!",
				roles=[0],
				bot=true,
			),
		],
		guilds: [
			new Guild(
				id=1,
				displayName="lol",
				icon=undefined,
				pings=0,
				iconTop=IconTop.None,
				iconTopColor=Colors.Danger,
			),
		]
	};

	window.shitcord.getComponent = function(name) {
		return shitcord.components[name].children[0].cloneNode(true);
	}
}

initShitcord();
shitcord._classes = {
	App_Root: "appMount-3lHmkl",

	Layer_Container: "layerContainer-yqaFcK",
	Layer: "layer-v9HyYc",
	Layer_Backdrop: "backdrop-1wrmKB",
	With_Layer: "withLayer-RoELSG",

	Disabled_Ptr_Evts: "disabledPointerEvents-1ptgTB",
	Tooltip: "tooltip-2QfLtc",
	Tooltip_Primary: "tooltipPrimary-1d1ph4",
	Tooltip_Top: "tooltipTop-XDDSxx",
	Tooltip_Bottom: "tooltipBottom-3ARrEK",
	Tooltip_Left: "tooltipLeft-3EDOk1",
	Tooltip_Right: "tooltipRight-2JM5PQ",
	Tooltip_Disable_Ptr_Evts: "tooltipDisablePointerEvents-3eaBGN",

	Tooltip_Pointer: "tooltipPointer-3ZfirK",
	Tooltip_Content: "tooltipContent-bqVLWK",

	UserAreaRoot: "container-3baos1",
	UserAreaAvatar: "avatar-VxgULZ",
	UserAreaAvatarAria: "avatar-SmRMf2",

	VoiceChatUserContainer: "list-2luk8a",
	VoiceChatProfile: "avatar-3tNQiO",
	VoiceChatUsername: "username-3KYl0N",

	MembersListRoot: "members-1998pB",
	MemberCategory: "membersGroup-v9BXpm",
	MemberObject: "member-3-YXUe",
	MemberAriaLabel: "wrapper-3t9DeA",
	MemberAvatar: "avatar-VxgULZ",
	MemberUsername: "name-uJV0GL",
	MemberStatus: "activity-2Gy-9S",

	GuildScrollerRoot: "guilds-1SWlCJ",
	GuildScroller: "scroller-1Bvpku",
	DmItem: "opacity: 1; height: 56px; transform: scale(1);",
	GuildItem: "listItem-GuPuDH",
	GuildPill: "pill-1z4sAY",
	GuildSeparator: "guildSeparator-33mFX6",
	GuildItemWrapper: "wrapper-1BJsBx",
	GuildItemAvatar: "icon-27yU2q",
	HomeItem: "tutorialContainer-2sGCg9",
	CreateServerItem: "tutorialContainer-30WoTp",
	GuildSvg: "svg-1X37T1",
	GuildWrapperSimple: "wrapperSimple-19ogV2",

	GuildItemSelected: "selected-bZ3Lue",

	// Textbox
	TextboxRoot: "textArea-12jD-V",
	TextboxPlaceholder: "placeholder-37qJjk",

	// Colors
	Danger: "hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%)",
	Online: "hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)",
}
console.log(window.shitcord);

setupUserarea = function() {
	// Setup user area
	const domUserAreaRoot = findDomObject(shitcord._classes.UserAreaRoot);
	const userToApply = window.getSelfUser();
	// PFP
	const pfp = domUserAreaRoot.children[0].getElementsByClassName(shitcord._classes.UserAreaAvatar)[0];
	const pfpAria = domUserAreaRoot.children[0].getElementsByClassName(shitcord._classes.UserAreaAvatarAria)[0];
	pfp.src = userToApply.avatarURL();
	pfpAria.ariaLabel = userToApply.username + ", " + window.statusToString(userToApply.status);
	// Text
	domUserAreaRoot.children[1].children[0].children[0].innerHTML = userToApply.username;
	domUserAreaRoot.children[1].children[1].innerHTML = "#" + userToApply.discriminator;
}
setupVoicechat = function() {
	// Setup voice chat
	const domUserAreaRoot = findDomObject(shitcord._classes.VoiceChatUserContainer);

	patchUser(window.getSelfUser(), domUserAreaRoot.children[0]);
	patchUser(window.getUser(1), domUserAreaRoot.children[1]);
}
patchUser = function(user, dom) {
	// PFP
	const pfp = dom.getElementsByClassName(shitcord._classes.VoiceChatProfile)[0];
	const username = dom.getElementsByClassName(shitcord._classes.VoiceChatUsername)[0];
	pfp.style = "background-image: url(" + user.avatarURL() + ");";
	username.innerHTML = user.username;
}
setupMembersList = function() {
	// Setup members list
	const membersListroot = findDomObject(shitcord._classes.MembersListRoot);

	patchMember(window.getSelfUser(), membersListroot.getElementsByClassName(shitcord._classes.MemberObject)[0]);
	patchMember(window.getUser(1), membersListroot.getElementsByClassName(shitcord._classes.MemberObject)[1]);
}
patchMember = function(user, dom) {
	// MMEBER
	const pfp = dom.getElementsByClassName(shitcord._classes.MemberAvatar)[0];
	const ariaObj = dom.getElementsByClassName(shitcord._classes.MemberAriaLabel)[0];
	const username = dom.getElementsByClassName(shitcord._classes.MemberUsername)[0];
	pfp.src = user.avatarURL();	
	ariaObj.ariaLabel = user.username + ", " + window.statusToString(user.status);
	username.children[0].innerHTML = user.username;
}
patchDms = function() {
	const guildScroller = findDomObject(shitcord._classes.GuildScroller);
	const guildElements = guildScroller.getElementsByClassName(shitcord._classes.GuildItem);

	for (let i = 0; i < guildElements.length; i++) {
		const currentItem = guildElements[i];
		// Filter out the DM / GUILD separator
		if (!currentItem.children[0].classList.contains(shitcord._classes.GuildSeparator)) {
			if (currentItem.parentElement.style.cssText === shitcord._classes.DmRoot) {
				const user = window.getUser(1);
				currentItem.getElementsByClassName(shitcord._classes.GuildItemWrapper)[0].ariaLabel = user.username;
				currentItem.getElementsByClassName(shitcord._classes.GuildItemAvatar)[0].src = user.avatarURL();
			}
		}
	}
}

function membersList() {
	setupUserarea();
	setupVoicechat();
	setupMembersList();
	patchDms();
}
const unreadHeight = 8;
const hoverHeight = 20;
const selectedHeight = 40;

// Handles the guild list
constructGuildsSlider = function() {
	const GuildScroller = findDomObject(shitcord._classes.GuildScrollerRoot).getElementsByClassName(shitcord._classes.GuildScroller)[0];
	const HomeRoot = GuildScroller.getElementsByClassName(shitcord._classes.HomeItem)[0];
	const GuildSeparator = GuildScroller.getElementsByClassName(shitcord._classes.GuildSeparator)[0].parentNode;
	const ServersRoot = GuildScroller.querySelectorAll('[aria-label="Servers"]')[0];

	// const newGuild = genGuild(false, "hekker's other shithole", "https://cdn.discordapp.com/icons/327997395650740225/a_1bdd318305d597ce877241a7df8b7d77.webp?size=128");
	const home = genGuild("home", false, "Home", shitcord.getComponent("guildHomeIcon"), false, 1);

	// Replace home icon
	HomeRoot.innerHTML='';
	HomeRoot.append(home);
	
	// DMS
	GuildSeparator.before(dmSticky("1", false, "Hekky", "https://cdn.discordapp.com/avatars/346338830011596800/d740df0c81f9d54e110fa80433db76b4.webp?size=128", true, 3));
	
	// Guilds

	// yeet first 3 guilds for now ; once folders work just clear
	ServersRoot.children[0].remove();
	ServersRoot.children[0].remove();
	ServersRoot.children[0].remove();

	const topMost = ServersRoot.children[0];
	
	topMost.before(genGuild("8", true, "lol", null, true, 1, true));
	topMost.before(genGuild("9", false, "Splitgate", "https://cdn.discordapp.com/icons/327997395650740225/a_1bdd318305d597ce877241a7df8b7d77.webp?size=128", true));
	topMost.before(genGuild("10", false, "hekker's other shithole", null));

	// Specials
}

// DMs header
dmSticky = function(id, selected, label, icon, unread, pings, iconTop, iconTopColor) {
	// Create a DM
	return Solito.createElement("div", [], {style: `opacity: 1; height: 56px; transform: scale(1);`}, null,
		genGuild(id, selected, label, icon, unread, pings, iconTop, iconTopColor)
	);
}

// Add server and server discovery buttons are special

// Add Server btn (+)
addServerButton = function() {
	return genGuild("create-join-button", false, "Add a Server", null);

}

// Server Discovery
serverDiscovery = function() {
	return genGuild("guild-discover-button", false, "Explore Public Servers", null);
}

// Add guild
genGuild = function(id, selected, label, icon, unread, pings, iconTop, iconTopColor) {

	// clone
	const newGuildObject = shitcord.getComponent("guildItem");
	const wrapperItem = newGuildObject.getElementsByClassName(shitcord._classes.GuildItemWrapper)[0];
	const guildSvg = newGuildObject.getElementsByClassName(shitcord._classes.GuildSvg)[0];

	// state
	let isHovered = 0;
	let isSelected = selected;
	let animateState = isSelected == true ? 0 : 1;
	let animator = setInterval(animateGuild, 10);
	let pill = null;
	
	// Tooltip
	let tooltipAnimState = 0;
	let tooltip = null;

	// cache stuff
	let shorthand = "";
	label.split(' ').forEach(e => shorthand += e[0]);

	// Modify the guild
	
	// icon: do we use a string or an image?
	if (icon == undefined || icon == null) {
		wrapperItem.children[0].innerText = shorthand;
	} else {
		wrapperItem.innerHTML = '';
		if (typeof(icon) == "string") {
			const guildIconObj = shitcord.getComponent("guildItemPfp");
			guildIconObj.src = icon;
			wrapperItem.appendChild(guildIconObj);
		} else {
			wrapperItem.appendChild(icon);
		}
	}
	// Set ID
	wrapperItem.setAttribute("data-list-item-id", `guildsnav___${id}`);
	// Aria label
	wrapperItem.setAttribute("aria-label", label);

	// Add badges
	console.log(guildSvg.parentNode);
	if (pings != null || pings > 0) {
		const pingsBadge = shitcord.getComponent("guildPingsBadge");
		pingsBadge.children[0].innerText = pings;
		guildSvg.parentNode.appendChild(pingsBadge);
	}
	if (iconTop != null) {
		const stream = shitcord.getComponent("guildStreamBadge");
		guildSvg.parentNode.appendChild(stream);
	}

	// fix mask
	const snapSvg = Snap(guildSvg);

	// Yeet snap watermark
	for(let i=0;i<snapSvg.node.children.length;i++) {
		if (snapSvg.node.children[i].nodeName === "desc") { snapSvg.node.children[i].remove(); }
	}
	// Create masks
	const maskId = genUuid();
	const maskBaseNormal = `M48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24Z`;
	const maskBaseSelected = `M0 24C0 16.5449 0 12.8174 1.21793 9.87706C2.84183 5.95662 5.95662 2.84183 9.87706 1.21793C12.8174 0 16.5449 0 24 0C31.4551 0 35.1826 0 38.1229 1.21793C42.0434 2.84183 45.1582 5.95662 46.7821 9.87706C48 12.8174 48 16.5449 48 24C48 31.4551 48 35.1826 46.7821 38.1229C45.1582 42.0434 42.0434 45.1582 38.1229 46.7821C35.1826 48 31.4551 48 24 48C16.5449 48 12.8174 48 9.87706 46.7821C5.95662 45.1582 2.84183 42.0434 1.21793 38.1229C0 35.1826 0 31.4551 0 24Z`;
	const badgesOffset = 20;

	const maskBlob = snapSvg.path(isSelected == true ? maskBaseSelected : maskBaseNormal);
	const maskBadgeTop = snapSvg.rect(28, -4, 24, 24, 12, 12);
	const maskBadgeBottom = snapSvg.rect(28, 28, 24, 24, 12, 12);
	
	maskBlob.attr({
		id: `${maskId}-blob_mask`,
	});
	maskBadgeTop.attr({
		id: `${maskId}-upper_badge_masks`,
		transform: `translate(0 0)`
	});
	maskBadgeBottom.attr({
		id: `${maskId}-lower_badge_masks`,
		transform: `translate(0 0)`
	});

	maskBlob.toDefs();
	maskBadgeTop.toDefs();
	maskBadgeBottom.toDefs();

	const foreignObj = snapSvg.children()[0];
	foreignObj.node.setAttribute("mask", `url(#${maskId})`);

	// Mask primary masks
	const maskPrimary = snapSvg.mask();
	maskPrimary.attr({
		id: maskId,
		fill: `black`,
		x: `0`,
		y: `0`,
		width: `48`,
		height: `48`,
	});
	(maskPrimary.use(maskBlob)).attr({fill: `white`});
	(maskPrimary.use(maskBadgeTop)).attr({fill: `black`});
	(maskPrimary.use(maskBadgeBottom)).attr({fill: `black`});
	
	// Mask stroke masks
	const maskStroke = snapSvg.mask();
	maskStroke.attr({id: `${maskId}-stroke_mask`});
	
	(maskStroke.rect("-25%", "-25%", "150%", "150%")).attr({fill: `white`});
	(maskStroke.use(maskBadgeTop)).attr({fill: `black`});
	(maskStroke.use(maskBadgeBottom)).attr({fill: `black`});

	if (iconTop == null) { maskBadgeTop.node.setAttribute("transform", `translate(${badgesOffset} ${badgesOffset})`); }
	if (pings == null || pings == 0) { maskBadgeBottom.node.setAttribute("transform", `translate(${badgesOffset} ${-badgesOffset})`); }

	// selected
	const RenderPill = function (selected) {

		if (selected || unread) {
			if (newGuildObject.getElementsByClassName(shitcord._classes.GuildPill)[0].children.length === 0) {
				let selectedPill = shitcord.getComponent("guildSelectedPill");

				newGuildObject.getElementsByClassName(shitcord._classes.GuildPill)[0].appendChild(selectedPill);
				pill = selectedPill;
			}
		}

		if (selected) {
			wrapperItem.classList.add(shitcord._classes.GuildItemSelected);
			
			if (tooltip == null) {
				const pos = newGuildObject.getBoundingClientRect();
				const compStyle = getComputedStyle(newGuildObject);
				tooltip = window.createTooltip(label, pos.x + parseFloat(compStyle.width) + 8, pos.y + 9, TooltipDirection.Right);
			}

			// maskBlob.animate({d: maskBaseSelected}, 1000, mina.easeinout);
			maskBlob.node.setAttribute("d", maskBaseSelected);
		} else if (!isSelected) {
			// maskBlob.animate({d: maskBaseNormal}, 1000, mina.easeinout);
			maskBlob.node.setAttribute("d", maskBaseNormal);
			wrapperItem.classList.remove(shitcord._classes.GuildItemSelected);
		}
	}
	function animateGuild() {
		// animation state
		if (isHovered == 1 || isSelected == 1) {
			animateState = clamp(animateState + 0.1, 0.0, 1.0);
		} else {
			animateState = clamp(animateState - 0.1, 0.0, 1.0);
		}
		// tooltip animation state
		if (isHovered == 1) {
			tooltipAnimState = clamp(tooltipAnimState + 0.1, 0.0, 1.0);
		} else {
			tooltipAnimState = clamp(tooltipAnimState - 0.1, 0.0, 1.0);
		}

		// Icons animations; TODO: Add properly
// 		if (animateState > 0 && animateState < 1) {
//			maskBadgeTop.node.setAttribute(
//				"transform", `translate(${(1 - animateState) * badgesOffset} ${(1 - animateState) * badgesOffset})`
//			);
//			maskBadgeBottom.node.setAttribute(
//				"transform", `translate(${(1 - animateState) * badgesOffset} ${-(1 - animateState) * badgesOffset})`
//			);
//		}

		// Animate the pill
		if (pill) {
			pill.style.opacity = animateState;
			pill.style.transform = (1 - animateState == 0) ? `none` : `translate3d(${(1 - animateState)}px,0px,0px)`;

			if (unread) {
				pill.style.height = unreadHeight;
				pill.style.transform = `none`;
				pill.style.opacity = 1;
			}
			if (isHovered) {
				pill.style.height = (1 - animateState == 0) ? hoverHeight : animateState * hoverHeight;
			}
			if (isSelected) {
				pill.style.height = animateState * selectedHeight;
			}

		}

		// Animate the tooltip
		if (tooltip) {
			tooltip.children[0].style.opacity = tooltipAnimState;
			tooltip.children[0].style.transform = (1 - tooltipAnimState == 0) ? `none` : `scale(${tooltipAnimState})`;
		}

		// Animate the guild shape
		if (isHovered == 1 || isSelected == 1) {
			snapSvg.animate();
		}

		// Delete if animation ended
		if (animateState == 0 && unread == false) {
			newGuildObject.getElementsByClassName(shitcord._classes.GuildPill)[0].children[0]?.remove();
			wrapperItem.classList.remove(shitcord._classes.GuildItemSelected);
			pill = null;
		}

		// Delete if tooltip animation ended
		if (tooltipAnimState == 0) {
			if (tooltip) {
				tooltip.parentNode.removeChild(tooltip);
				tooltip = null;
			}
		}
	};

	newGuildObject.onmouseenter = function(e) {
		isHovered++;
		RenderPill(isHovered != 0);
	}
	newGuildObject.onmouseleave = function(e) {
		isHovered--;
		RenderPill(isHovered != 0);
	}

	// Enable pill if selected
	if (isSelected || unread) { RenderPill(isSelected); }

	return newGuildObject;
}
window.createTooltip = function(tooltipTitle, positionX, positionY, direction) {
	let tooltipDirClass = shitcord._classes.Tooltip_Top;
	
	switch (direction) {
		case TooltipDirection.Bottom:
			tooltipDirClass = shitcord._classes.Tooltip_Bottom;
			break;
		case TooltipDirection.Left:
			tooltipDirClass = shitcord._classes.Tooltip_Left;
			break;
		case TooltipDirection.Right:
			tooltipDirClass = shitcord._classes.Tooltip_Right;
			break;
	}

	const tooltip =
		Solito.createElement("div", [shitcord._classes.Layer, shitcord._classes.Disabled_Ptr_Evts], null,null,
			Solito.createElement("div", [shitcord._classes.Tooltip, tooltipDirClass, shitcord._classes.Tooltip_Primary, shitcord._classes.Tooltip_Disable_Ptr_Evts], null,null,
				Solito.createElement("div", [shitcord._classes.Tooltip_Pointer]),
				Solito.createElement("div", [shitcord._classes.Tooltip_Content], null,null, tooltipTitle)
			)
		);
	tooltip.style.position = "absolute";
	tooltip.style.left = positionX;
	tooltip.style.top = positionY;

	return window.createLayer(false, tooltip);
}

document.querySelectorAll('[role="button"]','[type="button"]').forEach(curr => {
	if (curr.ariaLabel !== null) {
		let tooltip;
		curr.addEventListener("mouseover", e => {
			const pos = curr.getBoundingClientRect();
			const compStyle = getComputedStyle(curr);

			tooltip = window.createTooltip(curr.ariaLabel, pos.x - parseFloat(compStyle.width) / 2 - 12, pos.y - parseFloat(compStyle.height) - 8, TooltipDirection.Top);
		});
		
		curr.addEventListener("mouseout", e => {
			tooltip.parentNode.removeChild(tooltip);
			tooltip = null;
		});
	}
	return curr;
});
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
