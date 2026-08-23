<?php
/**
 * One Team band — In-House Production | "One team. One goal." medallion |
 * On-Site Project Support, flanked by photos, with a navy Our Commitment bar.
 * Figma node 184:459.
 *
 * @package Bernauer_Aviation
 */

$inhouse = array(
	'CNC cutter for precise material cutting',
	'Embroidery machine',
	'Sewing robot for consistent quality',
	'Modern adhesive spray system',
	'High-quality industrial sewing machines',
	'Large working tables & tooling',
	'Well-organized material storage',
);
$onsite = array(
	'Flexible support at your facility',
	'Seamless integration into your team',
	'AOG Support',
	'Skilled workforce in Switzerland, Germany and the EU',
);

$commit_title = get_theme_mod( 'bernauer_commit_title', 'Our Commitment' );
$commit_desc  = get_theme_mod( 'bernauer_commit_desc', 'We are committed to continuous improvement and long-term partnerships. Your project – our responsibility.' );
?>
<section class="oneteam" id="workshop">
	<div class="oneteam__band reveal">
		<div class="oneteam__photo oneteam__photo--left"><?php bernauer_image( 'workshop', 'oneteam__img' ); ?></div>

		<div class="oneteam__inner">
			<div class="oneteam__col">
				<div class="oneteam__col-head">
					<span class="oneteam__badge" aria-hidden="true"><?php echo bernauer_icon( 'warehouse' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
					<div class="oneteam__col-heading">
						<p class="oneteam__eyebrow">In-House Production</p>
						<p class="oneteam__subtitle">Fully equipped 280 m² upholstery workshop</p>
					</div>
				</div>
				<p class="oneteam__desc">Our own workshop provides the infrastructure and flexibility for professional aircraft interior refurbishment, individual components and larger project packages.</p>
				<ul class="oneteam__list">
					<?php foreach ( $inhouse as $item ) : ?>
						<li class="oneteam__item"><span class="oneteam__dot" aria-hidden="true"></span><span><?php echo esc_html( $item ); ?></span></li>
					<?php endforeach; ?>
				</ul>
			</div>

			<div class="oneteam__medallion" aria-hidden="true">
				<span class="oneteam__medallion-icon"><?php echo bernauer_icon( 'people-group' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
				<p class="oneteam__medallion-title">One Team.<br>One Goal.</p>
				<span class="oneteam__medallion-rule"></span>
				<p class="oneteam__medallion-sub">Your Project.</p>
			</div>

			<div class="oneteam__col oneteam__col--right">
				<div class="oneteam__col-head">
					<span class="oneteam__badge" aria-hidden="true"><?php echo bernauer_icon( 'plane-line' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
					<div class="oneteam__col-heading">
						<p class="oneteam__eyebrow">On-Site Project Support</p>
						<p class="oneteam__subtitle">Skilled support directly at your facility</p>
					</div>
				</div>
				<ul class="oneteam__list">
					<?php foreach ( $onsite as $item ) : ?>
						<li class="oneteam__item"><span class="oneteam__dot" aria-hidden="true"></span><span><?php echo esc_html( $item ); ?></span></li>
					<?php endforeach; ?>
				</ul>
				<p class="oneteam__desc">When projects require additional capacity, our specialists work alongside your team on-site and support your project where it matters.</p>
			</div>
		</div>

		<div class="oneteam__photo oneteam__photo--right"><?php bernauer_image( 'onsite', 'oneteam__img' ); ?></div>
	</div>

	<div class="oneteam__commit">
		<div class="oneteam__commit-inner">
			<span class="oneteam__commit-icon" aria-hidden="true"><?php echo bernauer_icon( 'shield-check' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
			<h3 class="oneteam__commit-title"><?php echo esc_html( $commit_title ); ?></h3>
			<p class="oneteam__commit-desc"><?php echo esc_html( $commit_desc ); ?></p>
		</div>
	</div>
</section>
