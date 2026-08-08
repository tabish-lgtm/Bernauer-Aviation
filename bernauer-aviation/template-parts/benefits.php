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

$benefits = array(
	array( 'icon' => 'aviation',      'title' => 'Aviation Certified Quality', 'desc' => 'Every material meets strict aviation standards for lasting safety reliability.' ),
	array( 'icon' => 'craftsmanship', 'title' => 'Master Craftsmanship',      'desc' => 'Every stitch and finish reflects expert craftsmanship with unmatched attention to detail.' ),
	array( 'icon' => 'materials',     'title' => 'Premium Materials',         'desc' => 'We use luxury leather, Alcantara, certified fabrics, and high performance foams for every interior.' ),
	array( 'icon' => 'delivery',      'title' => 'Reliable Project Delivery', 'desc' => 'Efficient workflows deliver timely refurbishments without compromising craftsmanship or quality.' ),
	array( 'icon' => 'tailored',      'title' => 'Tailored Cabin Design',     'desc' => 'Every interior is customized to reflect your aircraft, preferences, and operational requirements.' ),
	array( 'icon' => 'finish',        'title' => 'Exceptional Finish',        'desc' => 'Flawless finishes deliver luxurious aircraft interiors built for lasting performance and comfort.' ),
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
					<span class="benefit-card__icon" aria-hidden="true"><?php echo bernauer_icon( $b['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static SVG markup. ?></span>
					<div class="benefit-card__text">
						<h3 class="benefit-card__title"><?php echo esc_html( $b['title'] ); ?></h3>
						<p class="benefit-card__desc"><?php echo esc_html( $b['desc'] ); ?></p>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
