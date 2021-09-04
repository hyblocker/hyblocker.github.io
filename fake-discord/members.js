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