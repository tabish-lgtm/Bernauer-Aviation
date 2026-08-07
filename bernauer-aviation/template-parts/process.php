<?php
/**
 * Process — centered header + 3 numbered steps in a bordered panel.
 *
 * @package Bernauer_Aviation
 */

$steps = array(
	array(
		'num'   => '01',
		'title' => 'Design & Material Selection',
		'desc'  => 'Every project starts with precise planning, accurate measurements, and premium aviation certified materials tailored to every aircraft.',
	),
	array(
		'num'   => '02',
		'title' => 'Handcrafted Precision',
		'desc'  => 'Our craftsmen handcraft every component with precision, ensuring flawless fit, lasting durability, exceptional comfort, and premium quality.',
	),
	array(
		'num'   => '03',
		'title' => 'Installation & Quality Inspection',
		'desc'  => 'Expertly installed, aligned, and inspected to ensure exceptional safety, luxury, precision, and lasting craftsmanship before every delivery.',
	),
);
?>
<section class="section process" id="process">
	<header class="process__header">
		<p class="sec-header__kicker">The Craft</p>
		<h2 class="sec-header__title">Every Aircraft Interior Crafted With Precision</h2>
	</header>

	<div class="process__steps">
		<?php foreach ( $steps as $step ) : ?>
			<div class="process-step">
				<span class="process-step__num"><?php echo esc_html( $step['num'] ); ?></span>
				<div class="process-step__text">
					<h3 class="process-step__title"><?php echo esc_html( $step['title'] ); ?></h3>
					<p class="process-step__desc"><?php echo esc_html( $step['desc'] ); ?></p>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</section>
