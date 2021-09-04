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