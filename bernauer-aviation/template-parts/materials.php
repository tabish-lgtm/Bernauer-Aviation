<?php
/**
 * Materials — header (left) + 4 material swatches with captions.
 *
 * @package Bernauer_Aviation
 */

$materials = array(
	array( 'slot' => 'materials_1', 'title' => 'Full Grain Leather' ),
	array( 'slot' => 'materials_2', 'title' => 'Alcantara®' ),
	array( 'slot' => 'materials_3', 'title' => 'Ultraleather®' ),
	array( 'slot' => 'materials_4', 'title' => 'Aircraft Certified Wool Fabric' ),
);
?>
<section class="section materials" id="materials">
	<header class="materials__header">
		<p class="sec-header__kicker">Premium Materials</p>
		<h2 class="sec-header__title materials__title">Crafted with Aviation-Grade Materials Built to Perform</h2>
	</header>

	<div class="materials__grid">
		<?php foreach ( $materials as $m ) : ?>
			<figure class="material">
				<div class="material__media">
					<?php bernauer_image( $m['slot'], 'material__img' ); ?>
				</div>
				<figcaption class="material__caption"><?php echo esc_html( $m['title'] ); ?></figcaption>
			</figure>
		<?php endforeach; ?>
	</div>
</section>
