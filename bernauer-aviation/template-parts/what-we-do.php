<?php
/**
 * Services — "Specialized aircraft interior services" (section header + 2×3
 * grid of service tiles). Figma node 64:294.
 *
 * @package Bernauer_Aviation
 */

$services = array(
	array(
		'slot'  => 'svc_seating',
		'title' => 'Aircraft Seating & Divans',
		'desc'  => 'Seat and Divan upholstery, refurbishment and covering in Leather, Fabric, Ultrasuede and ®Alcantara and more.',
	),
	array(
		'slot'  => 'svc_foam',
		'title' => 'Foam Mock-ups, Modification & Replacement',
		'desc'  => 'Foam replacement, rebuilding, reshaping and individual cushion solutions.',
	),
	array(
		'slot'  => 'svc_panels',
		'title' => 'Cabin Panels & Linings',
		'desc'  => 'Refurbishment and reupholstery of cabin panels, Windowliner, Headliner, PSU, Sidedges, Dado-Panels, Bulkheads, and further interior linings.',
	),
	array(
		'slot'  => 'svc_carpets',
		'title' => 'Carpets & Fabric Flooring',
		'desc'  => 'Installation and replacement of textile floors, including Trimming, Edging, Cutting, and on-site installation.',
	),
	array(
		'slot'  => 'svc_leather',
		'title' => 'Leather Restoration',
		'desc'  => 'Professional cleaning, conditioning, repair and restoration of aircraft leather surfaces.',
	),
	array(
		'slot'  => 'svc_curtains',
		'title' => 'Curtains, Sewing Custom Interior Components',
		'desc'  => 'Individual sewing services for Curtains, Bags, Accessories and custom-made interior components.',
	),
);
?>
<section class="section wwd" id="what-we-do">
	<header class="wwd__header sec-header reveal">
		<div class="sec-header__lead">
			<p class="sec-header__kicker">Aviation Expertise</p>
			<h2 class="sec-header__title">Specialized Aircraft Interior Services</h2>
		</div>
		<p class="sec-header__desc">From individual components to complete cabin refurbishment, we provide specialized upholstery and interior services for business aviation.</p>
	</header>

	<div class="wwd__grid">
		<?php foreach ( $services as $card ) : ?>
			<article class="wwd-card reveal">
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
