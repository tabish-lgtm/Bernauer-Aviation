<?php
/**
 * Why Choose Bernauer — centered heading + 3 columns (outline icon, uppercase
 * title with amber underline, copy / amber-dot checklists). Figma node 184:451.
 *
 * @package Bernauer_Aviation
 */

$columns = array(
	array(
		'icon'  => 'plane-line',
		'title' => '14+ Years Experience',
		'blocks' => array(
			array( 'type' => 'para', 'text' => 'More than 14 years of hands-on experience in upholstery, foam work and interior refurbishment for Business & Commercial Aviation.' ),
			array( 'type' => 'para', 'text' => 'We understand the highest expectations of MRO´s, completion centers and operations.' ),
		),
	),
	array(
		'icon'  => 'clipboard-check',
		'title' => 'Documented Quality Processes',
		'blocks' => array(
			array( 'type' => 'list', 'items' => array( 'Structured Incoming Inspection', 'Project documentation', 'Final Quality Report' ) ),
			array( 'type' => 'para', 'text' => 'Our procedures are aligned with aviation regulations and industry best practices – ensuring consistent, traceable and reliable results you can trust.' ),
		),
	),
	array(
		'icon'  => 'people-chat',
		'title' => 'Reliable, Flexible & Customer-Focused',
		'blocks' => array(
			array( 'type' => 'list', 'items' => array(
				'Clear communication',
				'Reliable delivery times',
				'Flexible support – in our workshop or on-site at your facility',
				'Close coordination with your project team',
				'Short decision-making paths',
			) ),
		),
	),
);
?>
<section class="section benefits" id="benefits">
	<div class="benefits__inner">
		<header class="benefits__header reveal">
			<h2 class="benefits__heading">Why Choose Bernauer?</h2>
			<p class="benefits__lede">A specialized aircraft interior partner combining aviation experience, documented quality processes and flexible, customer-focused support.</p>
		</header>

		<div class="benefits__cols reveal">
			<?php foreach ( $columns as $col ) : ?>
				<article class="why-col">
					<span class="why-col__icon" aria-hidden="true"><?php echo bernauer_icon( $col['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
					<h3 class="why-col__title"><?php echo esc_html( $col['title'] ); ?></h3>
					<div class="why-col__body">
						<?php foreach ( $col['blocks'] as $block ) : ?>
							<?php if ( 'list' === $block['type'] ) : ?>
								<ul class="why-col__list">
									<?php foreach ( $block['items'] as $item ) : ?>
										<li class="why-col__item"><span class="why-col__dot" aria-hidden="true"></span><span><?php echo esc_html( $item ); ?></span></li>
									<?php endforeach; ?>
								</ul>
							<?php else : ?>
								<p class="why-col__para"><?php echo esc_html( $block['text'] ); ?></p>
							<?php endif; ?>
						<?php endforeach; ?>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
