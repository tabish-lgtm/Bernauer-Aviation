<?php
/**
 * Editable image slots.
 *
 * Every photographic image in the design is a named slot. Each slot ships with
 * a lightweight SVG placeholder (correct aspect ratio, on-palette) and is
 * overridable in Appearance → Customize → Bernauer Images by uploading the real
 * export. This mirrors the Figma node → slot map documented in README.md.
 *
 * @package Bernauer_Aviation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The full catalogue of image slots.
 *
 * key    => slot id (used as the theme_mod name: bernauer_img_{key})
 * label  => human label shown in the Customizer
 * w / h  => intrinsic aspect ratio (used for the placeholder + <img> sizing)
 * node   => originating Figma node id (documentation only)
 *
 * @return array<string,array<string,mixed>>
 */
function bernauer_image_slots() {
	return array(
		'hero'            => array( 'label' => 'Hero — cabin', 'w' => 1312, 'h' => 600, 'node' => '64:293', 'file' => 'hero-cabin.jpg' ),

		// Services — "Specialized aircraft interior services" (6 tiles).
		'svc_seating'     => array( 'label' => 'Service — Aircraft seating & divans', 'w' => 644, 'h' => 424, 'node' => '64:303', 'file' => 'cabin-seating.jpg' ),
		'svc_foam'        => array( 'label' => 'Service — Foam mock-ups, modification & replacement', 'w' => 644, 'h' => 424, 'node' => '64:308', 'file' => 'high-density-foam.jpg' ),
		'svc_panels'      => array( 'label' => 'Service — Cabin panels & linings', 'w' => 644, 'h' => 424, 'node' => '64:314', 'file' => 'cabin-panels.jpg' ),
		'svc_carpets'     => array( 'label' => 'Service — Carpets & fabric flooring', 'w' => 644, 'h' => 424, 'node' => '64:319', 'file' => 'carpets.jpg' ),
		'svc_leather'     => array( 'label' => 'Service — Leather restoration', 'w' => 644, 'h' => 424, 'node' => '64:325', 'file' => 'leather-restoration.jpg' ),
		'svc_curtains'    => array( 'label' => 'Service — Curtains & custom sewing', 'w' => 644, 'h' => 424, 'node' => '64:330', 'file' => 'curtains.jpg' ),

		// CTA band — "Your workshop or ours. One team" (dark background photo).
		'cta_bg'          => array( 'label' => 'CTA band — background photo', 'w' => 1440, 'h' => 568, 'node' => '64:435', 'file' => 'cabin-refurbishment.jpg' ),

		// In-house production — "Fully equipped 280 m² upholstery workshop".
		'workshop'        => array( 'label' => 'Workshop — in-house production photo', 'w' => 668, 'h' => 566, 'node' => '64:475', 'file' => 'workshop.jpg' ),

		// On-site support — "Skilled support directly at your facility".
		'onsite'          => array( 'label' => 'On-site support — photo', 'w' => 668, 'h' => 570, 'node' => '64:478', 'file' => 'onsite.jpg' ),

		// Meet the Craftsmen — founder portrait.
		'craftsmen_portrait' => array( 'label' => 'Craftsmen — Lukas Bernauer portrait', 'w' => 668, 'h' => 568, 'node' => '64:510', 'file' => 'portrait.jpg' ),

		// Behind Bernauer Design — video poster frame.
		'behind_poster'   => array( 'label' => 'Behind Bernauer Design — video poster', 'w' => 636, 'h' => 768, 'node' => '184:586', 'file' => 'behind-poster.jpg' ),

		// Craftsmen — three video tiles (posters optional).
		'craftsmen_1'     => array( 'label' => 'Craftsmen video 1 — poster (optional)', 'w' => 400, 'h' => 500, 'node' => '64:512' ),
		'craftsmen_2'     => array( 'label' => 'Craftsmen video 2 — poster (optional)', 'w' => 400, 'h' => 500, 'node' => '64:518' ),
		'craftsmen_3'     => array( 'label' => 'Craftsmen video 3 — poster (optional)', 'w' => 400, 'h' => 500, 'node' => '64:524' ),

		'contact'         => array( 'label' => 'Contact — image', 'w' => 574, 'h' => 543, 'node' => '64:558' ),
	);
}

/**
 * Build an on-palette SVG placeholder as a data URI.
 *
 * @param int    $w     Width.
 * @param int    $h     Height.
 * @param string $label Optional label rendered faintly in the centre.
 * @return string data: URI
 */
function bernauer_placeholder_uri( $w, $h, $label = '' ) {
	$w   = max( 1, (int) $w );
	$h   = max( 1, (int) $h );
	$txt = $label ? '<text x="50%" y="50%" fill="#a6a09b" font-family="Geist, sans-serif" font-size="18" letter-spacing="2" text-anchor="middle" dominant-baseline="middle" text-transform="uppercase">' . esc_html( strtoupper( $label ) ) . '</text>' : '';
	$svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' . $w . '" height="' . $h . '" viewBox="0 0 ' . $w . ' ' . $h . '" role="img">'
		. '<rect width="' . $w . '" height="' . $h . '" fill="#e7e2dc"/>'
		. '<rect x="0.5" y="0.5" width="' . ( $w - 1 ) . '" height="' . ( $h - 1 ) . '" fill="none" stroke="#d6cfc6" stroke-width="1"/>'
		. $txt
		. '</svg>';

	return 'data:image/svg+xml;base64,' . base64_encode( $svg );
}

/**
 * Resolve a slot's image URL — the uploaded override if present, else the
 * placeholder data URI.
 *
 * @param string $key Slot key.
 * @return array{url:string,w:int,h:int,label:string,is_placeholder:bool}
 */
function bernauer_image_src( $key ) {
	$slots = bernauer_image_slots();
	$slot  = isset( $slots[ $key ] ) ? $slots[ $key ] : array( 'label' => $key, 'w' => 800, 'h' => 600 );

	$mod = get_theme_mod( 'bernauer_img_' . $key, '' );
	if ( $mod ) {
		return array(
			'url'            => esc_url( $mod ),
			'w'              => (int) $slot['w'],
			'h'              => (int) $slot['h'],
			'label'          => $slot['label'],
			'is_placeholder' => false,
		);
	}

	// Bundled default shipped with the theme (assets/images), if present.
	if ( ! empty( $slot['file'] ) && file_exists( get_theme_file_path( 'assets/images/' . $slot['file'] ) ) ) {
		return array(
			'url'            => esc_url( get_theme_file_uri( 'assets/images/' . $slot['file'] ) ),
			'w'              => (int) $slot['w'],
			'h'              => (int) $slot['h'],
			'label'          => $slot['label'],
			'is_placeholder' => false,
		);
	}

	return array(
		'url'            => bernauer_placeholder_uri( $slot['w'], $slot['h'], $slot['label'] ),
		'w'              => (int) $slot['w'],
		'h'              => (int) $slot['h'],
		'label'          => $slot['label'],
		'is_placeholder' => true,
	);
}

/**
 * Echo a fully-formed <img> for a slot.
 *
 * @param string $key       Slot key.
 * @param string $css_class Optional extra class.
 * @param string $alt       Optional alt text (defaults to slot label).
 */
function bernauer_image( $key, $css_class = '', $alt = '' ) {
	$img = bernauer_image_src( $key );
	$alt = $alt ? $alt : $img['label'];
	printf(
		'<img class="ba-img%1$s" src="%2$s" width="%3$d" height="%4$d" alt="%5$s" loading="lazy" decoding="async" />',
		$css_class ? ' ' . esc_attr( $css_class ) : '',
		$img['url'],
		(int) $img['w'],
		(int) $img['h'],
		esc_attr( $alt )
	);
}

/**
 * Register a Customizer panel with an upload control per image slot.
 *
 * @param WP_Customize_Manager $wp_customize Customizer.
 */
function bernauer_customize_images( $wp_customize ) {
	$wp_customize->add_section( 'bernauer_images', array(
		'title'       => __( 'Bernauer Images', 'bernauer-aviation' ),
		'description' => __( 'Upload the real photo for each slot. Empty slots show an on-palette placeholder.', 'bernauer-aviation' ),
		'priority'    => 30,
	) );

	foreach ( bernauer_image_slots() as $key => $slot ) {
		$setting = 'bernauer_img_' . $key;
		$wp_customize->add_setting( $setting, array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $setting, array(
			'label'       => $slot['label'],
			'description'  => sprintf( __( 'Figma node %s · %d×%d', 'bernauer-aviation' ), $slot['node'], $slot['w'], $slot['h'] ),
			'section'     => 'bernauer_images',
			'settings'    => $setting,
		) ) );
	}
}
add_action( 'customize_register', 'bernauer_customize_images' );
