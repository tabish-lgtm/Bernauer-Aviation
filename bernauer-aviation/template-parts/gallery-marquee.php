<?php
/**
 * Craftsmen — centered header + full-bleed horizontal media strip.
 * Each item can carry a video (self-hosted file or YouTube/Vimeo). When a
 * video is set the item shows a poster + play button that starts playback;
 * otherwise it shows the poster image alone.
 *
 * @package Bernauer_Aviation
 */

/** Play-button markup (halo + dark circle + triangle). */
function bernauer_play_button() {
	return '<span class="craftsmen__play-halo" aria-hidden="true"></span>'
		. '<span class="craftsmen__play-btn" aria-hidden="true">'
		. '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
		. '<path d="M12 9.5v13l11-6.5-11-6.5z" fill="#ffffff"/></svg></span>';
}

/** Convert a YouTube/Vimeo watch URL to an embeddable URL; empty if not one. */
function bernauer_video_embed( $url ) {
	if ( preg_match( '~youtu\.be/([\w-]+)~', $url, $m ) || preg_match( '~youtube\.com/(?:watch\?v=|embed/)([\w-]+)~', $url, $m ) ) {
		return 'https://www.youtube-nocookie.com/embed/' . $m[1] . '?autoplay=1&rel=0';
	}
	if ( preg_match( '~vimeo\.com/(?:video/)?(\d+)~', $url, $m ) ) {
		return 'https://player.vimeo.com/video/' . $m[1] . '?autoplay=1';
	}
	return '';
}

$items = array(
	array( 'slot' => 'craftsmen_1', 'video' => get_theme_mod( 'bernauer_video_1', '' ) ),
	array( 'slot' => 'craftsmen_2', 'video' => get_theme_mod( 'bernauer_video_2', '' ) ),
	array( 'slot' => 'craftsmen_3', 'video' => get_theme_mod( 'bernauer_video_3', '' ) ),
);
?>
<section class="section craftsmen" id="craftsmen">
	<header class="craftsmen__header">
		<p class="sec-header__kicker">Meet the Craftsmen</p>
		<h2 class="sec-header__title craftsmen__title">The Experts Behind Every Exceptional Aircraft Interior</h2>
	</header>

	<div class="craftsmen__track" tabindex="0" aria-label="<?php esc_attr_e( 'Craftsmen gallery — scroll horizontally', 'bernauer-aviation' ); ?>">
		<?php foreach ( $items as $item ) :
			$poster = bernauer_image_src( $item['slot'] );
			$video  = $item['video'];
			$embed  = $video ? bernauer_video_embed( $video ) : '';
			$is_file = $video && ! $embed;
			?>
			<div class="craftsmen__item<?php echo $video ? ' craftsmen__item--video' : ''; ?>">
				<?php if ( $is_file ) : ?>
					<video class="craftsmen__video" poster="<?php echo esc_url( $poster['url'] ); ?>" preload="none" playsinline controls>
						<source src="<?php echo esc_url( $video ); ?>">
					</video>
					<button type="button" class="craftsmen__play" data-video-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
						<?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</button>
				<?php elseif ( $embed ) : ?>
					<div class="craftsmen__embed" data-embed="<?php echo esc_url( $embed ); ?>" style="background-image:url('<?php echo esc_url( $poster['url'] ); ?>')">
						<button type="button" class="craftsmen__play" data-embed-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
							<?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</button>
					</div>
				<?php else : ?>
					<?php bernauer_image( $item['slot'], 'craftsmen__img' ); ?>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
</section>
