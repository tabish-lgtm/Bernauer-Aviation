<?php
/**
 * Hero — display title, description, full-width cabin image.
 *
 * @package Bernauer_Aviation
 */

$hero_title = get_theme_mod( 'bernauer_hero_title', 'Aircraft upholstery & interior services' );
$hero_desc  = get_theme_mod( 'bernauer_hero_desc', 'Refurbishment, restoration and custom manufacturing of premium aircraft interiors – trusted by MROs, completion centers and private operators.' );
?>
<section class="hero" id="hero">
	<div class="hero__content">
		<h1 class="hero__title"><?php echo esc_html( $hero_title ); ?></h1>
		<p class="hero__desc"><?php echo esc_html( $hero_desc ); ?></p>
	</div>
	<div class="hero__media">
		<?php bernauer_image( 'hero', 'hero__img' ); ?>
	</div>
</section>
