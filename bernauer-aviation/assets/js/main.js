/**
 * Bernauer Aviation — front-end interactions.
 * Kept dependency-free.
 */
(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function () {
		// Mobile navigation toggle.
		var navToggle = document.querySelector("[data-nav-toggle]");
		var nav = document.querySelector("[data-nav]");
		if (navToggle && nav) {
			navToggle.addEventListener("click", function () {
				var open = nav.classList.toggle("is-open");
				navToggle.setAttribute("aria-expanded", open ? "true" : "false");
			});
		}
	});
})();
