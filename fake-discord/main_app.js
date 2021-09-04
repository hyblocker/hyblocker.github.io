const KEY_ESCAPE = 27;

// loader
window.addEventListener("DOMContentLoaded", function() {

	scrollMessagesToBottom();	
	cacheComponents();

	// Functionality
	membersList();
	constructGuildsSlider();

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