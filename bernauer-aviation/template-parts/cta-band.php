<?php
/**
 * CTA band — "Your workshop or ours. One team" full-width dark photo band
 * with a left-anchored gradient. Figma node 64:435.
 *
 * @package Bernauer_Aviation
 */

$cta = bernauer_image_src( 'cta_bg' );
?>
<section class="cta-band" id="cta-band" style="background-image:url('<?php echo esc_url( $cta['url'] ); ?>')">
	<div class="cta-band__overlay" aria-hidden="true"></div>
	<div class="cta-band__inner reveal">
		<h2 class="cta-band__title">Your workshop or ours. One team</h2>
		<p class="cta-band__desc">We adapt to your project needs – providing professional support exactly where you need it.</p>
	</div>
</section>
