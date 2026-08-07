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

$s = 'fill="none" stroke="#09090b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
$o = 'width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"';

$icons = array(
	// Shield + check — Aviation Certified Quality.
	'shield' => '<svg ' . $o . '><path d="M16 3.5l9.5 3.8v6c0 6.4-4.1 11-9.5 12.7-5.4-1.7-9.5-6.3-9.5-12.7v-6L16 3.5z" ' . $s . '/><path d="M11.4 15.9l3.2 3.2 6.3-6.5" ' . $s . '/></svg>',
	// Needle & thread — Master Craftsmanship (upholstery stitching).
	'needle' => '<svg ' . $o . '><path d="M5.5 26.5L26 6" ' . $s . '/><path d="M22.5 4.2c1.8-1 4 .1 4 1.9 0 1.1-.8 1.9-1.9 2.4-1.4.6-2.6.9-3.2 2.2" ' . $s . '/><circle cx="20.3" cy="11.7" r="1.4" ' . $s . '/><path d="M5.5 26.5l1.6-4.4 2.8 2.8-4.4 1.6z" ' . $s . '/></svg>',
	// Layered swatch — Premium Materials.
	'swatch' => '<svg ' . $o . '><path d="M16 4l11 5.5-11 5.5L5 9.5 16 4z" ' . $s . '/><path d="M5 15.5L16 21l11-5.5" ' . $s . '/><path d="M5 21.5L16 27l11-5.5" ' . $s . '/></svg>',
	// Clock — Reliable Project Delivery (timeliness).
	'clock'  => '<svg ' . $o . '><circle cx="16" cy="16" r="12" ' . $s . '/><path d="M16 9.2V16l4.6 2.8" ' . $s . '/></svg>',
	// Ruler + pen — Tailored Cabin Design (bespoke/customization).
	'tailor' => '<svg ' . $o . '><path d="M4.5 21.2L21.2 4.5l6.3 6.3L10.8 27.5 4.5 27.5v-6.3z" ' . $s . '/><path d="M14.5 11.2l2.3 2.3M11.2 14.5l2.3 2.3M17.8 7.9l2.3 2.3" ' . $s . '/></svg>',
	// Sparkle — Exceptional Finish.
	'finish' => '<svg ' . $o . '><path d="M16 4c0 5.5 2.5 8 8 8-5.5 0-8 2.5-8 8 0-5.5-2.5-8-8-8 5.5 0 8-2.5 8-8z" ' . $s . '/><path d="M24.5 20.5c0 2.5 1 3.5 3.5 3.5-2.5 0-3.5 1-3.5 3.5 0-2.5-1-3.5-3.5-3.5 2.5 0 3.5-1 3.5-3.5z" ' . $s . '/></svg>',
);

$benefits = array(
	array( 'icon' => 'shield', 'title' => 'Aviation Certified Quality', 'desc' => 'Every material meets strict aviation standards for lasting safety reliability.' ),
	array( 'icon' => 'needle', 'title' => 'Master Craftsmanship',      'desc' => 'Every stitch and finish reflects expert craftsmanship with unmatched attention to detail.' ),
	array( 'icon' => 'swatch', 'title' => 'Premium Materials',         'desc' => 'We use luxury leather, Alcantara, certified fabrics, and high performance foams for every interior.' ),
	array( 'icon' => 'clock',  'title' => 'Reliable Project Delivery', 'desc' => 'Efficient workflows deliver timely refurbishments without compromising craftsmanship or quality.' ),
	array( 'icon' => 'tailor', 'title' => 'Tailored Cabin Design',     'desc' => 'Every interior is customized to reflect your aircraft, preferences, and operational requirements.' ),
	array( 'icon' => 'finish', 'title' => 'Exceptional Finish',        'desc' => 'Flawless finishes deliver luxurious aircraft interiors built for lasting performance and comfort.' ),
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
