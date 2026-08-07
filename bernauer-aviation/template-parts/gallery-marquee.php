<?php
/**
 * Craftsmen — centered header + full-bleed horizontal image strip.
 * The middle image carries a play button (video showcase).
 *
 * @package Bernauer_Aviation
 */

$video_url = get_theme_mod( 'bernauer_craftsmen_video', '' );
?>
<section class="section craftsmen" id="craftsmen">
	<header class="craftsmen__header">
		<p class="sec-header__kicker">Meet the Craftsmen</p>
		<h2 class="sec-header__title craftsmen__title">The Experts Behind Every Exceptional Aircraft Interior</h2>
	</header>

	<div class="craftsmen__track" tabindex="0" aria-label="<?php esc_attr_e( 'Craftsmen gallery — scroll horizontally', 'bernauer-aviation' ); ?>">
		<div class="craftsmen__item">
			<?php bernauer_image( 'craftsmen_1', 'craftsmen__img' ); ?>
		</div>
		<div class="craftsmen__item craftsmen__item--video">
			<?php bernauer_image( 'craftsmen_2', 'craftsmen__img' ); ?>
			<?php if ( $video_url ) : ?>
				<a class="craftsmen__play" href="<?php echo esc_url( $video_url ); ?>" aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
			<?php else : ?>
				<button type="button" class="craftsmen__play" aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
			<?php endif; ?>
				<span class="craftsmen__play-halo" aria-hidden="true"></span>
				<span class="craftsmen__play-btn" aria-hidden="true">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 9.5v13l11-6.5-11-6.5z" fill="#ffffff"/>
					</svg>
				</span>
			<?php echo $video_url ? '</a>' : '</button>'; ?>
		</div>
		<div class="craftsmen__item">
			<?php bernauer_image( 'craftsmen_3', 'craftsmen__img' ); ?>
		</div>
	</div>
</section>
