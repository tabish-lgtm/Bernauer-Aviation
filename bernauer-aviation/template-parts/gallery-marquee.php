<?php
/**
 * Meet the Craftsmen — "Craftsmanship built from experience": founder bio +
 * portrait, followed by a row of three craftsmanship video tiles.
 * Figma node 64:499.
 *
 * Each tile defaults to a bundled clip and can be overridden per-slot in the
 * Customizer with a self-hosted file or a YouTube/Vimeo link. A poster (the
 * matching craftsmen_* image slot, if uploaded) shows with a play button;
 * otherwise the video's first frame is used.
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

$bio = array(
	'What started with a passion for craftsmanship, leather and vehicle interiors has grown into a specialist business serving demanding interior projects across aviation, vehicles and furniture.',
	'After training as an automotive upholsterer and gaining experience with renowned companies—including work on private aircraft interiors—Lukas founded Bernauer in 2015. His approach has remained simple: understand the project, work precisely and deliver interiors that stand up to the highest expectations.',
	'Today, he brings hands-on craftsmanship, technical understanding and a strong focus on customer collaboration to every project.',
);

// Three tiles. Each defaults to a bundled clip and can be overridden per-slot.
$items = array(
	array( 'mod' => 'bernauer_video_1', 'file' => 'process-1.mp4',  'slot' => 'craftsmen_1' ),
	array( 'mod' => 'bernauer_video_2', 'file' => 'process-4.mp4',  'slot' => 'craftsmen_2' ),
	array( 'mod' => 'bernauer_video_3', 'file' => 'process-10.mp4', 'slot' => 'craftsmen_3' ),
);
?>
<section class="section craftsmen" id="craftsmen">
	<div class="craftsmen__bio reveal">
		<div class="craftsmen__intro">
			<div class="craftsmen__intro-head">
				<p class="sec-header__kicker">Meet the Craftsmen</p>
				<h2 class="sec-header__title craftsmen__title">Craftsmanship built from experience.</h2>
				<div class="craftsmen__body">
					<?php foreach ( $bio as $para ) : ?>
						<p><?php echo esc_html( $para ); ?></p>
					<?php endforeach; ?>
				</div>
			</div>
			<div class="craftsmen__person">
				<p class="craftsmen__name">Lukas Bernauer</p>
				<p class="craftsmen__role">Founder &amp; Managing Director</p>
			</div>
		</div>
		<div class="craftsmen__portrait">
			<?php bernauer_image( 'craftsmen_portrait', 'craftsmen__portrait-img' ); ?>
		</div>
	</div>

	<div class="craftsmen__track" tabindex="0" aria-label="<?php esc_attr_e( 'Craftsmanship videos', 'bernauer-aviation' ); ?>">
		<?php foreach ( $items as $item ) :
			$override   = get_theme_mod( $item['mod'], '' );
			$video      = $override ? $override : get_theme_file_uri( 'assets/videos/' . $item['file'] );
			$embed      = $override ? bernauer_video_embed( $override ) : '';
			$poster     = bernauer_image_src( $item['slot'] );
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
