<?php
/**
 * In-house production — "Fully equipped 280 m² upholstery workshop":
 * text + equipment checklist (left), photo (right). Figma node 64:442.
 *
 * @package Bernauer_Aviation
 */

$features = array(
	array( 'icon' => 'cutter', 'text' => 'CNC cutter for precise material cutting' ),
	array( 'icon' => 'needle', 'text' => 'Embroidery machine' ),
	array( 'icon' => 'robot',  'text' => 'Sewing robot for consistent quality' ),
	array( 'icon' => 'spray',  'text' => 'Modern adhesive spray system' ),
	array( 'icon' => 'sewing', 'text' => 'High-quality industrial sewing machines' ),
	array( 'icon' => 'table',  'text' => 'Large working tables & tooling' ),
	array( 'icon' => 'boxes',  'text' => 'Well-organized material storage' ),
);
?>
<section class="section feature-split" id="workshop">
	<div class="feature-split__row">
		<div class="feature-split__text reveal">
			<div class="feature-split__head">
				<p class="sec-header__kicker">In-House Production</p>
				<h2 class="sec-header__title feature-split__title">Fully equipped 280 m² upholstery workshop</h2>
				<p class="feature-split__desc">Our own workshop provides the infrastructure and flexibility for professional aircraft interior refurbishment, individual components and larger project packages.</p>
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
		<div class="feature-split__media reveal">
			<?php bernauer_image( 'workshop', 'feature-split__img' ); ?>
		</div>
	</div>
</section>
