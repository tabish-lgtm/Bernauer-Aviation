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

		// Projects: filterable carousel driven by the JSON payload.
		(function () {
			var root = document.querySelector("[data-projects]");
			if (!root) return;
			var dataEl = root.querySelector("[data-projects-data]");
			var all = [];
			try { all = JSON.parse(dataEl.textContent) || []; } catch (e) { all = []; }

			var imgEl = root.querySelector("[data-project-img]");
			var titleEl = root.querySelector("[data-project-title]");
			var descEl = root.querySelector("[data-project-desc]");
			var tagsEl = root.querySelector("[data-project-tags]");
			var countEl = root.querySelector("[data-project-count]");
			var emptyEl = root.querySelector("[data-project-empty]");
			var stageEl = root.querySelector("[data-project-stage]");
			var prevBtn = root.querySelector("[data-project-prev]");
			var nextBtn = root.querySelector("[data-project-next]");
			var filterBtns = Array.prototype.slice.call(root.querySelectorAll("[data-filter]"));

			var filtered = all.slice();
			var index = 0;

			function render() {
				var hasItems = filtered.length > 0;
				if (emptyEl) emptyEl.hidden = hasItems;
				["project__media", "project__info-row", "project__footer"].forEach(function (c) {
					var el = stageEl.querySelector("." + c);
					if (el) el.style.display = hasItems ? "" : "none";
				});
				if (!hasItems) return;

				var p = filtered[index];
				if (imgEl) { imgEl.src = p.img; imgEl.alt = p.title; }
				if (titleEl) titleEl.textContent = p.title;
				if (descEl) descEl.textContent = p.desc;
				if (tagsEl) {
					tagsEl.innerHTML = "";
					(p.tags || []).forEach(function (t) {
						var s = document.createElement("span");
						s.className = "project__tag";
						s.textContent = t;
						tagsEl.appendChild(s);
					});
				}
				if (countEl) countEl.textContent = (index + 1) + " / " + filtered.length;
				var one = filtered.length <= 1;
				if (prevBtn) prevBtn.disabled = one;
				if (nextBtn) nextBtn.disabled = one;
			}

			function applyFilter(cat) {
				filtered = cat === "all" ? all.slice() : all.filter(function (p) {
					return (p.cats || []).indexOf(cat) !== -1;
				});
				index = 0;
				render();
			}

			filterBtns.forEach(function (btn) {
				btn.addEventListener("click", function () {
					filterBtns.forEach(function (b) {
						b.classList.remove("is-active");
						b.setAttribute("aria-selected", "false");
					});
					btn.classList.add("is-active");
					btn.setAttribute("aria-selected", "true");
					applyFilter(btn.getAttribute("data-filter"));
				});
			});
			if (prevBtn) prevBtn.addEventListener("click", function () {
				if (!filtered.length) return;
				index = (index - 1 + filtered.length) % filtered.length;
				render();
			});
			if (nextBtn) nextBtn.addEventListener("click", function () {
				if (!filtered.length) return;
				index = (index + 1) % filtered.length;
				render();
			});
			render();
		})();

		// Craftsmen: paint the first frame as the thumbnail (no poster uploaded).
		document.querySelectorAll(".craftsmen__video").forEach(function (video) {
			if (video.getAttribute("poster")) return;
			video.addEventListener("loadedmetadata", function () {
				try { if (video.currentTime === 0) { video.currentTime = 0.05; } } catch (e) {}
			}, { once: true });
		});

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
