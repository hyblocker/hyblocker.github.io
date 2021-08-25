const KEY_ESCAPE = 27;

// loader
window.addEventListener("DOMContentLoaded", function() {
	loadJS('/fake-discord/shitcord_data.js');
	loadJS('/fake-discord/members.js');
	loadJS('/fake-discord/guild_mock.js');
	loadJS('/fake-discord/tooltip.js');

	scrollMessagesToBottom();

	initShitcord();

	document.body.appendChild( Solito.createElement("div", ["modal"], null, 
		Solito.createElement("span", ["penis"], null, null)
	) );

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
				avatarURLBase="346338830011596800/a_06c70d50b822c9fc9864d798389d2b4a",
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
				status=Status.DoNotDisturb,
				aboutMe="Hello!",
				roles=[0],
				bot=true,
			),
		],
		guilds: [
			new Guild(
				id=1,
				displayName="lol",
				icon=undefined,
			),
		]
	};
}