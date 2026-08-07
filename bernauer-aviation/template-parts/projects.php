<?php
/**
 * Projects — section header, filter tabs, featured project + prev/next nav.
 *
 * @package Bernauer_Aviation
 */

$filters = array( 'All Projects', 'Panels', 'Seats', 'Cockpits', 'Carpets', 'Linings', 'Curtains' );
$tags    = array( 'Aircraft Interior', 'Premium Leather', 'Precision Crafted' );
?>
<section class="section projects" id="projects">
	<header class="projects__header sec-header">
		<div class="sec-header__lead">
			<p class="sec-header__kicker">Featured Projects</p>
			<h2 class="sec-header__title">A Portfolio of Precision, Crafted for Aviation</h2>
		</div>
		<p class="sec-header__desc sec-header__desc--wide">Every project reflects our commitment to handcrafted quality, refined finishes, and bespoke aircraft interiors built for executive aviation.</p>
	</header>

	<div class="projects__content">
		<div class="projects__filters" role="tablist" aria-label="<?php esc_attr_e( 'Project categories', 'bernauer-aviation' ); ?>">
			<?php foreach ( $filters as $i => $filter ) : ?>
				<button type="button" class="projects__filter<?php echo 0 === $i ? ' is-active' : ''; ?>" role="tab" aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"><?php echo esc_html( $filter ); ?></button>
			<?php endforeach; ?>
		</div>

		<div class="project">
			<div class="project__media">
				<?php bernauer_image( 'projects_featured', 'project__img' ); ?>
			</div>
			<div class="project__info-row">
				<div class="project__info">
					<h3 class="project__title">Executive Jet Bulkhead Restoration</h3>
					<p class="project__desc">Expertly restored aircraft bulkheads featuring premium materials, precision craftsmanship, and seamless integration to enhance both cabin aesthetics and passenger comfort.</p>
				</div>
				<div class="project__tags">
					<?php foreach ( $tags as $tag ) : ?>
						<span class="project__tag"><?php echo esc_html( $tag ); ?></span>
					<?php endforeach; ?>
				</div>
			</div>

			<div class="project__nav">
				<button type="button" class="project__nav-btn" aria-label="<?php esc_attr_e( 'Previous project', 'bernauer-aviation' ); ?>">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M20 7 11 16l9 9" stroke="#09090b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<button type="button" class="project__nav-btn" aria-label="<?php esc_attr_e( 'Next project', 'bernauer-aviation' ); ?>">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M12 7l9 9-9 9" stroke="#09090b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</section>
