<?php
/**
 * On-site project support — "Skilled support directly at your facility":
 * photo (left), text + checklist (right). Figma node 64:476.
 *
 * @package Bernauer_Aviation
 */

$features = array(
	array( 'icon' => 'headphones',  'text' => 'Flexible support at your facility' ),
	array( 'icon' => 'grid-circle', 'text' => 'Seamless integration into your team' ),
	array( 'icon' => 'learning',    'text' => 'AOG Support' ),
	array( 'icon' => 'globe',       'text' => 'Skilled workforce in Switzerland, Germany and the EU' ),
);
?>
<section class="section feature-split feature-split--reverse" id="onsite">
	<div class="feature-split__row">
		<div class="feature-split__media reveal">
			<?php bernauer_image( 'onsite', 'feature-split__img' ); ?>
		</div>
		<div class="feature-split__text reveal">
			<div class="feature-split__head">
				<p class="sec-header__kicker">On-Site Project Support</p>
				<h2 class="sec-header__title feature-split__title">Skilled support directly at your facility</h2>
				<p class="feature-split__desc">When projects require additional capacity, our specialists work alongside your team on-site and support your project where it matters.</p>
			</div>
			<ul class="feature-list">
				<?php foreach ( $features as $item ) : ?>
					<li class="feature-list__item">
						<span class="feature-list__icon" aria-hidden="true"><?php echo bernauer_icon( $item['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
						<span class="feature-list__text"><?php echo esc_html( $item['text'] ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>
