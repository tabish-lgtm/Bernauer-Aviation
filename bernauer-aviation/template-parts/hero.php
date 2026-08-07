<?php
/**
 * Hero — display title, description, full-width cabin image.
 *
 * @package Bernauer_Aviation
 */

$hero_title = get_theme_mod( 'bernauer_hero_title', 'Crafting Comfort. Above Every Horizon.' );
$hero_desc  = get_theme_mod( 'bernauer_hero_desc', 'Luxury aircraft interiors handcrafted with precision, premium materials, and uncompromising attention to detail.' );
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
