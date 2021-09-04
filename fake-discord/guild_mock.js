const unreadHeight = 8;
const hoverHeight = 20;
const selectedHeight = 40;

// Handles the guild list
constructGuildsSlider = function() {
	const GuildScroller = findDomObject(shitcord._classes.GuildScrollerRoot).getElementsByClassName(shitcord._classes.GuildScroller)[0];
	const HomeRoot = GuildScroller.getElementsByClassName(shitcord._classes.HomeItem)[0];
	const GuildSeparator = GuildScroller.getElementsByClassName(shitcord._classes.GuildSeparator)[0].parentNode;
	const ServersRoot = GuildScroller.querySelectorAll('[aria-label="Servers"]')[0];

	console.log(ServersRoot)
	// console.log(GuildScroller)

	// const newGuild = genGuild(false, "hekker's other shithole", "https://cdn.discordapp.com/icons/327997395650740225/a_1bdd318305d597ce877241a7df8b7d77.webp?size=128");
	const home = genGuild("home", false, "Home", shitcord.getComponent("guildHomeIcon"), false, 1);

	// Replace home icon
	HomeRoot.innerHTML='';
	HomeRoot.append(home);
	
	// DMS
	GuildSeparator.before(dmSticky("1", false, "Hekky", "https://cdn.discordapp.com/avatars/346338830011596800/d740df0c81f9d54e110fa80433db76b4.webp?size=128", true, 3));
	
	// Guilds

	// yeet first 3 guilds
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
	return genGuild();

}

// Server Discovery
serverDiscovery = function() {
	return genGuild();
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
			
			const pos = newGuildObject.getBoundingClientRect();
			const compStyle = getComputedStyle(newGuildObject);
			
			tooltip = window.createTooltip(label, pos.x + parseFloat(compStyle.width) + 8, pos.y + 9, TooltipDirection.Right);
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