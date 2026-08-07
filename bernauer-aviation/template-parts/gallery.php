<?php
/**
 * Gallery — centered header + mosaic (large left, two stacked right, wide bottom).
 *
 * @package Bernauer_Aviation
 */
?>
<section class="section gallery" id="gallery">
	<header class="gallery__header">
		<p class="sec-header__kicker">Project Gallery</p>
		<h2 class="sec-header__title gallery__title">Transforming Aircraft Interiors with Precision</h2>
	</header>

	<div class="gallery__grid">
		<div class="gallery__row">
			<div class="gallery__cell gallery__cell--large">
				<?php bernauer_image( 'gallery_1', 'gallery__img' ); ?>
			</div>
			<div class="gallery__stack">
				<div class="gallery__cell gallery__cell--stacked">
					<?php bernauer_image( 'gallery_2', 'gallery__img' ); ?>
				</div>
				<div class="gallery__cell gallery__cell--stacked">
					<?php bernauer_image( 'gallery_3', 'gallery__img' ); ?>
				</div>
			</div>
		</div>
		<div class="gallery__cell gallery__cell--wide">
			<?php bernauer_image( 'gallery_4', 'gallery__img' ); ?>
		</div>
	</div>
</section>
