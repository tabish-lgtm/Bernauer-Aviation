<?php
/**
 * Projects — section header, working filter tabs, and a filterable
 * project carousel (prev/next), matching the Figma design.
 *
 * @package Bernauer_Aviation
 */

$filters = array( 'All Projects', 'Panels', 'Seats', 'Cockpits', 'Carpets', 'Linings', 'Curtains' );

// Project data. Each project resolves its image from an existing slot and is
// tagged with one or more filter categories.
$projects = array(
	array(
		'file'  => 'cabin-panels.jpg',
		'title' => 'Executive Jet Bulkhead Restoration',
		'desc'  => 'Expertly restored aircraft bulkheads featuring premium materials, precision craftsmanship, and seamless integration to enhance both cabin aesthetics and passenger comfort.',
		'tags'  => array( 'Aircraft Interior', 'Premium Leather', 'Precision Crafted' ),
		'cats'  => array( 'Panels' ),
	),
	array(
		'file'  => 'cabin-seating.jpg',
		'title' => 'Executive Divan & Storage Seating',
		'desc'  => 'A bespoke three-seat divan rebuilt with custom upholstery and integrated storage drawers — engineered for comfort, durability, and a refined cabin footprint.',
		'tags'  => array( 'Cabin Seating', 'Custom Upholstery', 'Integrated Storage' ),
		'cats'  => array( 'Seats' ),
	),
	array(
		'file'  => 'premium-leather.jpg',
		'title' => 'Diamond-Stitched Executive Seats',
		'desc'  => 'Hand-upholstered executive seats in full-grain leather with precision diamond stitching, delivering first-class comfort and a flawless, enduring finish.',
		'tags'  => array( 'Premium Leather', 'Diamond Stitch', 'Handcrafted' ),
		'cats'  => array( 'Seats' ),
	),
	array(
		'file'  => 'cabin-refurbishment.jpg',
		'title' => 'Cabin Headliner & Console Refurbishment',
		'desc'  => 'Complete refinishing of cabin headliner and console components, combining luxury materials with meticulous attention to fit, finish, and functional detail.',
		'tags'  => array( 'Headliner', 'Cabin Trim', 'Precision Crafted' ),
		'cats'  => array( 'Linings' ),
	),
	array(
		'file'  => 'hero-cabin.jpg',
		'title' => 'Full Cabin Interior Transformation',
		'desc'  => 'An end-to-end cabin transformation — seating, panels, and finishes reimagined with aviation-grade materials for a cohesive, bespoke executive interior.',
		'tags'  => array( 'Full Cabin', 'Premium Materials', 'Bespoke' ),
		'cats'  => array( 'Panels', 'Seats' ),
	),
	array(
		'file'  => 'cockpit.jpg',
		'title' => 'Cockpit Trim & Panel Refinishing',
		'desc'  => 'Precision-refinished cockpit trim and console panels, upholstered for a flawless fit and a clean, durable finish around every instrument and control.',
		'tags'  => array( 'Cockpit', 'Panel Fabrication', 'Precision Crafted' ),
		'cats'  => array( 'Cockpits' ),
	),
	array(
		'file'  => 'carpets.jpg',
		'title' => 'Cabin Aisle & Carpet Fitting',
		'desc'  => 'Custom-cut aisle runners and cabin carpeting in durable, aviation-grade materials — precisely fitted for a seamless, refined floor throughout the cabin.',
		'tags'  => array( 'Carpets', 'Custom Fit', 'Aviation Grade' ),
		'cats'  => array( 'Carpets' ),
	),
	array(
		'file'  => 'curtains.jpg',
		'title' => 'Cabin Dividers & Curtain Fitting',
		'desc'  => 'Bespoke cabin dividers and curtains crafted to complement the interior — tailored for privacy, light control, and a soft, premium finish.',
		'tags'  => array( 'Curtains', 'Cabin Dividers', 'Bespoke' ),
		'cats'  => array( 'Curtains' ),
	),
);

// Resolve image URLs for the JSON payload.
$payload = array();
foreach ( $projects as $p ) {
	$payload[] = array(
		'title' => $p['title'],
		'desc'  => $p['desc'],
		'tags'  => $p['tags'],
		'cats'  => $p['cats'],
		'img'   => esc_url( get_theme_file_uri( 'assets/images/' . $p['file'] ) ),
	);
}
$first = $payload[0];
?>
<section class="section projects" id="projects">
	<header class="projects__header sec-header">
		<div class="sec-header__lead">
			<p class="sec-header__kicker">Featured Projects</p>
			<h2 class="sec-header__title">A Portfolio of Precision, Crafted for Aviation</h2>
		</div>
		<p class="sec-header__desc sec-header__desc--wide">Every project reflects our commitment to handcrafted quality, refined finishes, and bespoke aircraft interiors built for executive aviation.</p>
	</header>

	<div class="projects__content" data-projects>
		<script type="application/json" data-projects-data><?php echo wp_json_encode( $payload ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></script>

		<div class="projects__filters" role="tablist" aria-label="<?php esc_attr_e( 'Project categories', 'bernauer-aviation' ); ?>">
			<?php foreach ( $filters as $i => $filter ) :
				$cat = 0 === $i ? 'all' : trim( $filter );
				?>
				<button type="button" class="projects__filter<?php echo 0 === $i ? ' is-active' : ''; ?>" role="tab" aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>" data-filter="<?php echo esc_attr( $cat ); ?>"><?php echo esc_html( trim( $filter ) ); ?></button>
			<?php endforeach; ?>
		</div>

		<div class="project" data-project-stage>
			<div class="project__media">
				<img class="project__img" data-project-img src="<?php echo esc_url( $first['img'] ); ?>" alt="<?php echo esc_attr( $first['title'] ); ?>" width="1312" height="600" />
			</div>
			<div class="project__info-row">
				<div class="project__info">
					<h3 class="project__title" data-project-title><?php echo esc_html( $first['title'] ); ?></h3>
					<p class="project__desc" data-project-desc><?php echo esc_html( $first['desc'] ); ?></p>
				</div>
				<div class="project__tags" data-project-tags>
					<?php foreach ( $first['tags'] as $tag ) : ?>
						<span class="project__tag"><?php echo esc_html( $tag ); ?></span>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="project__footer">
				<div class="project__nav">
					<button type="button" class="project__nav-btn" data-project-prev aria-label="<?php esc_attr_e( 'Previous project', 'bernauer-aviation' ); ?>"><?php echo bernauer_icon( 'arrow-previous' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
					<button type="button" class="project__nav-btn" data-project-next aria-label="<?php esc_attr_e( 'Next project', 'bernauer-aviation' ); ?>"><?php echo bernauer_icon( 'arrow-forward' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
				</div>
				<p class="project__count" data-project-count aria-live="polite"></p>
			</div>

			<p class="project__empty" data-project-empty hidden>More projects in this category coming soon.</p>
		</div>
	</div>
</section>
