<?php
/**
 * Benefits — centered header + 6 feature cards (2 rows of 3) with icons.
 *
 * NOTE: The Figma icon glyphs live on an egress-blocked host, so these are
 * re-authored line icons matched to each concept. Swap freely if the exact
 * Figma icon set is provided.
 *
 * @package Bernauer_Aviation
 */

$s = 'stroke="#09090b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

$icons = array(
	// Shield with check — aviation certified.
	'shield' => '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3l10 4v7c0 6.6-4.3 11.4-10 13-5.7-1.6-10-6.4-10-13V7l10-4z" ' . $s . '/><path d="M11.5 15.5l3 3 6-6" ' . $s . '/></svg>',
	// Pen nib — master craftsmanship.
	'nib'    => '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 27l4.5-11L20 5.5 26.5 12 16 22.5 5 27z" ' . $s . '/><path d="M9.5 16L16 22.5" ' . $s . '/><circle cx="18.7" cy="13.3" r="2" ' . $s . '/></svg>',
	// Gem / diamond — premium materials.
	'gem'    => '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5h14l5 7-12 15L4 12 9 5z" ' . $s . '/><path d="M4 12h24M11 5l-2 7 7 15 7-15-2-7" ' . $s . '/></svg>',
	// Clock — reliable delivery.
	'clock'  => '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" ' . $s . '/><path d="M16 9v7l4.5 3" ' . $s . '/></svg>',
	// Paint bucket — tailored design.
	'bucket' => '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4l11 11-9 9a2.8 2.8 0 0 1-4 0l-7-7a2.8 2.8 0 0 1 0-4l9-9z" ' . $s . '/><path d="M11 7l8 8M6 17h19" ' . $s . '/><path d="M27 20s2 2.4 2 4a2 2 0 1 1-4 0c0-1.6 2-4 2-4z" ' . $s . '/></svg>',
	// Target — exceptional finish.
	'target' => '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" ' . $s . '/><circle cx="16" cy="16" r="7" ' . $s . '/><circle cx="16" cy="16" r="2.2" ' . $s . '/></svg>',
);

$benefits = array(
	array( 'icon' => 'shield', 'title' => 'Aviation Certified Quality', 'desc' => 'Every material meets strict aviation standards for lasting safety reliability.' ),
	array( 'icon' => 'nib',    'title' => 'Master Craftsmanship',      'desc' => 'Every stitch and finish reflects expert craftsmanship with unmatched attention to detail.' ),
	array( 'icon' => 'gem',    'title' => 'Premium Materials',         'desc' => 'We use luxury leather, Alcantara, certified fabrics, and high performance foams for every interior.' ),
	array( 'icon' => 'bucket', 'title' => 'Reliable Project Delivery', 'desc' => 'Efficient workflows deliver timely refurbishments without compromising craftsmanship or quality.' ),
	array( 'icon' => 'clock',  'title' => 'Tailored Cabin Design',     'desc' => 'Every interior is customized to reflect your aircraft, preferences, and operational requirements.' ),
	array( 'icon' => 'target', 'title' => 'Exceptional Finish',        'desc' => 'Flawless finishes deliver luxurious aircraft interiors built for lasting performance and comfort.' ),
);
?>
<section class="section benefits" id="benefits">
	<div class="benefits__inner">
		<header class="benefits__header">
			<p class="sec-header__kicker">Why Choose Bernauer</p>
			<h2 class="sec-header__title">The Difference Behind Every Aircraft Interior</h2>
		</header>

		<div class="benefits__grid">
			<?php foreach ( $benefits as $b ) : ?>
				<article class="benefit-card">
					<span class="benefit-card__icon" aria-hidden="true"><?php echo $icons[ $b['icon'] ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
					<div class="benefit-card__text">
						<h3 class="benefit-card__title"><?php echo esc_html( $b['title'] ); ?></h3>
						<p class="benefit-card__desc"><?php echo esc_html( $b['desc'] ); ?></p>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
