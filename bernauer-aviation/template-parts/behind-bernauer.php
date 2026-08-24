<?php
/**
 * Behind Bernauer Design — heading, founder video (left) and the studio story
 * (right). Figma node 184:583.
 *
 * The video defaults to a poster frame with a play button; set a self-hosted
 * MP4 or a YouTube/Vimeo link in the Customizer (Behind Bernauer Design video).
 *
 * @package Bernauer_Aviation
 */

$video    = get_theme_mod( 'bernauer_behind_video', 'https://vimeo.com/1220775721' );
$embed    = $video ? bernauer_video_embed( $video ) : '';
$poster   = bernauer_image_src( 'behind_poster' );
$linkedin = get_theme_mod( 'bernauer_linkedin', 'https://www.linkedin.com/in/lukas-bernauer-/' );
?>
<section class="section bb" id="behind">
	<h2 class="bb__heading">Behind Bernauer Design</h2>

	<div class="bb__row reveal">
		<div class="bb__media">
			<?php if ( $embed ) : ?>
				<div class="bb__frame bb__embed" data-embed="<?php echo esc_url( $embed ); ?>" style="background-image:url('<?php echo esc_url( $poster['url'] ); ?>')">
					<button type="button" class="bb__play" data-embed-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>"><?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
				</div>
			<?php elseif ( $video ) : ?>
				<div class="bb__frame">
					<video class="bb__video" preload="metadata" playsinline controls poster="<?php echo esc_url( $poster['url'] ); ?>">
						<source src="<?php echo esc_url( $video ); ?>" type="video/mp4">
					</video>
					<button type="button" class="bb__play" data-video-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>"><?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
				</div>
			<?php else : ?>
				<div class="bb__frame">
					<?php bernauer_image( 'behind_poster', 'bb__poster' ); ?>
					<span class="bb__play bb__play--static" aria-hidden="true"><?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
				</div>
			<?php endif; ?>
			<div class="bb__overlay" aria-hidden="true"></div>
			<div class="bb__caption">
				<div class="bb__person">
					<p class="bb__name">Lukas Bernauer</p>
					<p class="bb__role">Founder &amp; Managing Director</p>
				</div>
				<?php if ( $linkedin ) : ?>
					<a class="bb__linkedin" href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><?php echo bernauer_icon( 'linkedin' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
				<?php endif; ?>
			</div>
		</div>

		<div class="bb__story">
			<h3 class="bb__subhead">Craftsmanship. Experience. Teamwork.</h3>
			<p class="bb__text">Bernauer Design is an owner-managed upholstery company with a clear focus on high-quality aircraft interiors. What started as a specialist upholstery business has developed into an experienced partner for demanding aviation interior projects.</p>

			<h3 class="bb__subhead">Experience from inside the aviation industry</h3>
			<p class="bb__text">Founder and Managing Director <strong>Lukas Bernauer</strong> brings more than <strong>14 years of experience</strong> in aircraft interiors, including several years working within known companies like <strong>SR Technics</strong> and <strong>Jet Aviation</strong>. This background has shaped the way we work today: with a strong understanding of the quality, precision, flexibility and reliability expected in business aviation.</p>

			<h3 class="bb__subhead">A skilled team – not a production line</h3>
			<p class="bb__text">Today, our team consists of skilled professionals covering upholstery, sewing, pattern development, foam work, panel refurbishment, carpets and customized textile solutions.</p>
			<p class="bb__text">Many projects require more than simply following a predefined process. Damaged components have to be assessed, materials understood, patterns reconstructed and individual solutions developed. This is where the experience and craftsmanship of our team makes the difference.</p>

			<h3 class="bb__subhead">From the first inspection to the finished component</h3>
			<p class="bb__text">Our work is carried out in-house wherever possible. Incoming components are inspected and documented before refurbishment begins. During production, our team combines traditional craftsmanship with modern equipment and controlled working processes.</p>
			<p class="bb__text">Whether it is a single cabin component, a complete set of seats or a larger refurbishment project, our approach remains the same:</p>
			<p class="bb__text bb__text--strong">Understand the requirement. Work precisely. Inspect the result. Deliver quality.</p>
			<p class="bb__text">The video provides an insight into our workshop, our processes and some of the aircraft interior components completed by our team.</p>
		</div>
	</div>
</section>
