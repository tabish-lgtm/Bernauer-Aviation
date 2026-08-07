/**
 * Bernauer Aviation — front-end interactions.
 * Kept dependency-free.
 */
(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function () {
		// Mobile navigation toggle (present only if a menu is rendered).
		var navToggle = document.querySelector("[data-nav-toggle]");
		var nav = document.querySelector("[data-nav]");
		if (navToggle && nav) {
			navToggle.addEventListener("click", function () {
				var open = nav.classList.toggle("is-open");
				navToggle.setAttribute("aria-expanded", open ? "true" : "false");
			});
		}

		// Craftsmen: self-hosted <video> — play button starts playback then hides.
		document.querySelectorAll("[data-video-play]").forEach(function (btn) {
			btn.addEventListener("click", function () {
				var video = btn.parentElement.querySelector("video");
				if (!video) return;
				video.play();
				btn.classList.add("is-hidden");
				video.addEventListener("pause", function () { btn.classList.remove("is-hidden"); }, { once: true });
			});
		});

		// Craftsmen: YouTube/Vimeo — click-to-load iframe facade (no third-party
		// requests until the visitor opts in).
		document.querySelectorAll("[data-embed-play]").forEach(function (btn) {
			btn.addEventListener("click", function () {
				var host = btn.closest("[data-embed]");
				if (!host) return;
				var src = host.getAttribute("data-embed");
				var iframe = document.createElement("iframe");
				iframe.setAttribute("src", src);
				iframe.setAttribute("title", "Craftsmen video");
				iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
				iframe.setAttribute("allowfullscreen", "");
				iframe.className = "craftsmen__iframe";
				host.innerHTML = "";
				host.appendChild(iframe);
			});
		});
	});
})();
