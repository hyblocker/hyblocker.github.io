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