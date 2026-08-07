<?php
/**
 * What we do — section header + 2×2 grid of service cards.
 *
 * @package Bernauer_Aviation
 */

$cards = array(
	array(
		'slot'  => 'wwd_1',
		'title' => 'Cabin Seating',
		'desc'  => 'Premium seat restoration and custom upholstery designed for exceptional comfort, durability, and a refined in flight experience.',
	),
	array(
		'slot'  => 'wwd_2',
		'title' => 'Cabin Panels & Trim',
		'desc'  => 'Expert restoration of side panels, bulkheads, headliners, and interior trim with seamless finishes and premium materials.',
	),
	array(
		'slot'  => 'wwd_3',
		'title' => 'Leather Restoration',
		'desc'  => 'Restore worn aircraft interiors with premium leather refinishing, precision stitching, and factory quality craftsmanship.',
	),
	array(
		'slot'  => 'wwd_4',
		'title' => 'Custom Cabin Refurbishment',
		'desc'  => 'Complete aircraft interior transformations tailored to your vision, combining luxury materials with meticulous attention to detail.',
	),
);
?>
<section class="section wwd" id="what-we-do">
	<header class="wwd__header sec-header">
		<div class="sec-header__lead">
			<p class="sec-header__kicker">Aviation Expertise</p>
			<h2 class="sec-header__title">Crafting Premium Aircraft Interiors with Precision</h2>
		</div>
		<p class="sec-header__desc">From executive seating to handcrafted cabin finishes, we deliver bespoke upholstery solutions that enhance comfort, durability, and the premium experience of every flight.</p>
	</header>

	<div class="wwd__grid">
		<?php foreach ( $cards as $card ) : ?>
			<article class="wwd-card">
				<div class="wwd-card__media">
					<?php bernauer_image( $card['slot'], 'wwd-card__img' ); ?>
				</div>
				<div class="wwd-card__info">
					<h3 class="wwd-card__title"><?php echo esc_html( $card['title'] ); ?></h3>
					<p class="wwd-card__desc"><?php echo esc_html( $card['desc'] ); ?></p>
				</div>
			</article>
		<?php endforeach; ?>
	</div>
</section>
