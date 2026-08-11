<?php
/**
 * Benefits — "Why choose bernauer": centered header + 3-column panel
 * (experience / documented quality / customer focus). Figma node 64:375.
 *
 * @package Bernauer_Aviation
 */

$columns = array(
	array(
		'icon'  => 'experience',
		'title' => '14+ Years of experience in aviation',
		'paras' => array(
			'More than 14 years of hands-on experience in upholstery, foam work and interior refurbishment for Business & Commercial Aviation.',
			'We understand the highest expectations of MROs, completion centers and operators.',
		),
		'list'  => array(),
	),
	array(
		'icon'  => 'document',
		'title' => 'Documented quality process',
		'paras' => array(
			'Our procedures are aligned with aviation regulations and industry best practices – ensuring consistent, traceable and reliable results you can trust.',
		),
		'list'  => array(
			array( 'icon' => 'search', 'text' => 'Structured Incoming Inspection' ),
			array( 'icon' => 'folder', 'text' => 'Project documentation' ),
			array( 'icon' => 'archive-check', 'text' => 'Final Quality Report' ),
		),
	),
	array(
		'icon'  => 'user-card',
		'title' => 'Reliable, Flexible & Customer focused',
		'paras' => array(),
		'list'  => array(
			array( 'icon' => 'chat', 'text' => 'Clear communication' ),
			array( 'icon' => 'clock', 'text' => 'Reliable delivery times' ),
			array( 'icon' => 'headphones', 'text' => 'Flexible support – in our workshop or on-site at your facility' ),
			array( 'icon' => 'users', 'text' => 'Close coordination with your project team' ),
			array( 'icon' => 'shield-check', 'text' => 'Short decision-making paths' ),
		),
	),
);
?>
<section class="section benefits" id="benefits">
	<div class="benefits__inner">
		<header class="benefits__header reveal">
			<p class="sec-header__kicker">Why US</p>
			<h2 class="sec-header__title">Why choose bernauer</h2>
			<p class="benefits__lede">A specialized aircraft interior partner combining aviation experience, documented quality processes and flexible, customer-focused support.</p>
		</header>

		<div class="benefits__panel reveal">
			<?php foreach ( $columns as $col ) : ?>
				<article class="why-col">
					<span class="why-col__icon" aria-hidden="true"><?php echo bernauer_icon( $col['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
					<div class="why-col__text">
						<div class="why-col__head">
							<h3 class="why-col__title"><?php echo esc_html( $col['title'] ); ?></h3>
							<?php foreach ( $col['paras'] as $para ) : ?>
								<p class="why-col__desc"><?php echo esc_html( $para ); ?></p>
							<?php endforeach; ?>
						</div>
						<?php if ( ! empty( $col['list'] ) ) : ?>
							<ul class="why-col__list">
								<?php foreach ( $col['list'] as $item ) : ?>
									<li class="why-col__item">
										<span class="why-col__item-icon" aria-hidden="true"><?php echo bernauer_icon( $item['icon'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
										<span class="why-col__item-text"><?php echo esc_html( $item['text'] ); ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
