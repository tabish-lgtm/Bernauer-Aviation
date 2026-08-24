<?php
/**
 * Projects — "A Portfolio of Precision, Crafted for Aviation": section header,
 * working filter tabs, and a filterable project carousel (prev/next) that
 * supports both image and video projects. Figma node 184:410.
 *
 * Each project's media is either an image (assets/images/{file}) or a video
 * (poster image + a self-hosted file or YouTube/Vimeo link). Copy is taken
 * verbatim from the Figma design.
 *
 * @package Bernauer_Aviation
 */

$filters = array( 'All Projects', 'Panels', 'Seats', 'Cockpits', 'Carpets', 'Linings', 'Accessories' );

// The full portfolio pulled from Figma. Each category shares its copy across
// its numbered photos (proj-{slug}-{n}.jpg), matching the Figma project frames.
$categories = array(
	array(
		'cat'   => 'Panels',
		'slug'  => 'panels',
		'count' => 7,
		'title' => 'Executive Jet Side Panel Restoration',
		'desc'  => 'Expertly restored aircraft side panels with premium materials, seamless finishes, and precision craftsmanship for a refined cabin experience.',
		'tags'  => array( 'Cabin Side Panels', 'Custom Upholstery', 'Seamless Finishing' ),
		'video' => get_theme_mod( 'bernauer_video_panels', 'https://vimeo.com/1220782225' ),
	),
	array(
		'cat'   => 'Seats',
		'slug'  => 'seats',
		'count' => 14,
		'title' => 'Luxury Aircraft Seat Refurbishment',
		'desc'  => 'Aircraft seats refurbished with premium leather, custom foam shaping, and precision stitching for exceptional comfort and elegance.',
		'tags'  => array( 'Seat Upholstery', 'Custom Foam', 'Fine Stitching' ),
		'video' => get_theme_mod( 'bernauer_video_seats', 'https://vimeo.com/1220782252' ),
	),
	array(
		'cat'   => 'Cockpits',
		'slug'  => 'cockpit',
		'count' => 9,
		'title' => 'Aircraft Cockpit Interior Refinement',
		'desc'  => 'Cockpit interiors restored with meticulous craftsmanship, premium materials, and precision finishing to elevate both functionality and aesthetics.',
		'tags'  => array( 'Flight Controls', 'Premium Trim', 'Handcrafted Finish' ),
	),
	array(
		'cat'   => 'Carpets',
		'slug'  => 'carpets',
		'count' => 3,
		'title' => 'Luxury Aircraft Carpet Installation',
		'desc'  => 'Premium aircraft carpeting precisely fitted using certified materials to enhance cabin comfort, reduce noise, and deliver a refined interior finish.',
		'tags'  => array( 'Custom Fit', 'Aviation Certified', 'Precision Installed' ),
	),
	array(
		'cat'   => 'Linings',
		'slug'  => 'linings',
		'count' => 12,
		'title' => 'Aircraft Interior Linings',
		'desc'  => 'Precision refurbishment and upholstery of aircraft interior linings and panels — combining premium craftsmanship, precise fit and consistently high-quality finishes.',
		'tags'  => array( 'Cabin Furniture', 'Wood Veneers', 'Precision Inlays' ),
	),
	array(
		'cat'   => 'Accessories',
		'slug'  => 'accessories',
		'count' => 6,
		'title' => 'Aircraft Interior Accessories',
		'desc'  => 'Custom-made and refurbished aircraft accessories — including curtains, bags, covers and tailored textile components, crafted to match the cabin interior with precision and attention to detail.',
		'tags'  => array( 'Cabin Storage', 'Privacy Systems', 'Bespoke Finishes' ),
	),
);

$projects = array();
foreach ( $categories as $c ) {
	$cat_video = isset( $c['video'] ) ? $c['video'] : '';
	for ( $n = 1; $n <= $c['count']; $n++ ) {
		// The first project of a category with a video plays that clip
		// (its photo becomes the poster).
		$is_video = ( 1 === $n && $cat_video );
		$projects[] = array(
			'type'  => $is_video ? 'video' : 'image',
			'file'  => 'proj-' . $c['slug'] . '-' . $n . '.jpg',
			'video' => $is_video ? $cat_video : '',
			'title' => $c['title'],
			'desc'  => $c['desc'],
			'tags'  => $c['tags'],
			'cats'  => array( $c['cat'] ),
		);
	}
}

/**
 * Resolve a project's media URL: bundled file if present, else a placeholder.
 *
 * @param string $file Image file name in assets/images.
 * @return string URL or data URI.
 */
function bernauer_project_media( $file ) {
	if ( $file && file_exists( get_theme_file_path( 'assets/images/' . $file ) ) ) {
		return get_theme_file_uri( 'assets/images/' . $file );
	}
	return bernauer_placeholder_uri( 1312, 600, 'Project' );
}

// Build the JSON payload consumed by the carousel JS.
$payload = array();
foreach ( $projects as $p ) {
	$type  = isset( $p['type'] ) ? $p['type'] : 'image';
	$vid   = isset( $p['video'] ) ? $p['video'] : '';
	$payload[] = array(
		'type'  => $type,
		'title' => $p['title'],
		'desc'  => $p['desc'],
		'tags'  => $p['tags'],
		'cats'  => $p['cats'],
		'img'   => esc_url( bernauer_project_media( $p['file'] ) ),
		'video' => $vid ? esc_url( $vid ) : '',
		'embed' => $vid ? bernauer_video_embed( $vid ) : '',
	);
}
$first = $payload[0];
?>
<section class="section projects" id="projects">
	<header class="projects__header sec-header reveal">
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
			<div class="project__media" data-project-media>
				<img class="project__img" data-project-img src="<?php echo esc_url( $first['img'] ); ?>" alt="<?php echo esc_attr( $first['title'] ); ?>" width="1312" height="600" />
				<button type="button" class="project__play<?php echo 'video' === $first['type'] ? '' : ' is-hidden'; ?>" data-project-play aria-label="<?php esc_attr_e( 'Play video', 'bernauer-aviation' ); ?>">
					<?php echo bernauer_play_button(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</button>
			</div>

			<div class="project__nav">
				<button type="button" class="project__nav-btn" data-project-prev aria-label="<?php esc_attr_e( 'Previous project', 'bernauer-aviation' ); ?>"><?php echo bernauer_icon( 'arrow-previous' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
				<button type="button" class="project__nav-btn" data-project-next aria-label="<?php esc_attr_e( 'Next project', 'bernauer-aviation' ); ?>"><?php echo bernauer_icon( 'arrow-forward' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></button>
				<p class="project__count" data-project-count aria-live="polite"></p>
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

			<p class="project__empty" data-project-empty hidden>More projects in this category coming soon.</p>
		</div>
	</div>
</section>
