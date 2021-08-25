/*

<div class="layer-v9HyYc disabledPointerEvents-1ptgTB" style="position: absolute; left: 271px; bottom: 54px;">
	<div class="tooltip-2QfLtc tooltipTop-XDDSxx tooltipPrimary-1d1ph4 tooltipDisablePointerEvents-3eaBGN" style="opacity: 1; transform: none;">
		<div class="tooltipPointer-3ZfirK"></div>
		<div class="tooltipContent-bqVLWK">Impostazioni utente</div>
	</div>
</div>

*/

window.createTooltip = function(tooltipTitle, positionX, positionY, direction) {
	const tooltipDirClass = shitcord._classes.Tooltip_Top;

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

			tooltip = window.createTooltip(curr.ariaLabel, pos.x - parseFloat(compStyle.width) / 2 - 12, pos.y - parseFloat(compStyle.height) - 8, 0);
		});
		
		curr.addEventListener("mouseout", e => {
			tooltip.parentNode.removeChild(tooltip);
			tooltip = null;
		});
	}
	return curr;
});