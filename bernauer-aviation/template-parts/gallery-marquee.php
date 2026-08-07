<?php
/**
 * Craftsmen — centered header + full-bleed horizontal video strip.
 *
 * Ships with five bundled craftsmanship clips (assets/videos). Each item can be
 * overridden per-slot in the Customizer with a self-hosted file or a
 * YouTube/Vimeo link. A poster (the matching craftsmen_* image slot, if
 * uploaded) shows with a play button; otherwise the video's first frame is used.
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

// Bundled defaults: file in assets/videos + matching optional poster slot.
$items = array(
	array( 'mod' => 'bernauer_video_1', 'file' => 'process-1.mp4',  'slot' => 'craftsmen_1' ),
	array( 'mod' => 'bernauer_video_2', 'file' => 'process-3.mp4',  'slot' => 'craftsmen_2' ),
	array( 'mod' => 'bernauer_video_3', 'file' => 'panels.mp4',     'slot' => 'craftsmen_3' ),
	array( 'mod' => 'bernauer_video_4', 'file' => 'process-5.mp4',  'slot' => 'craftsmen_4' ),
	array( 'mod' => 'bernauer_video_5', 'file' => 'process-10.mp4', 'slot' => 'craftsmen_5' ),
);
?>
<section class="section craftsmen" id="craftsmen">
	<header class="craftsmen__header">
		<p class="sec-header__kicker">Meet the Craftsmen</p>
		<h2 class="sec-header__title craftsmen__title">The Experts Behind Every Exceptional Aircraft Interior</h2>
	</header>

	<div class="craftsmen__track" tabindex="0" aria-label="<?php esc_attr_e( 'Craftsmen videos — scroll horizontally', 'bernauer-aviation' ); ?>">
		<?php foreach ( $items as $item ) :
			$override = get_theme_mod( $item['mod'], '' );
			$video    = $override ? $override : get_theme_file_uri( 'assets/videos/' . $item['file'] );
			$embed    = $override ? bernauer_video_embed( $override ) : '';
			$poster   = bernauer_image_src( $item['slot'] );
			$poster_url = $poster['is_placeholder'] ? '' : $poster['url'];
			?>
			<div class="craftsmen__item craftsmen__item--video">
				<?php if ( $embed ) : ?>
					<div class="craftsmen__embed" data-embed="<?php echo esc_url( $embed ); ?>"<?php echo $poster_url ? ' style="background-image:url(\'' . esc_url( $poster_url ) . '\')"' : ''; ?>>
						<button type="button" class="craftsmen__play" data-embed-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
							<?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</button>
					</div>
				<?php else : ?>
					<video class="craftsmen__video" preload="metadata" playsinline controls<?php echo $poster_url ? ' poster="' . esc_url( $poster_url ) . '"' : ''; ?>>
						<source src="<?php echo esc_url( $video ); ?>" type="video/mp4">
					</video>
					<button type="button" class="craftsmen__play" data-video-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
						<?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</button>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
</section>
