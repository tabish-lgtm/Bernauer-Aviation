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
		'hero'            => array( 'label' => 'Hero — cabin', 'w' => 1312, 'h' => 600, 'node' => '33:975' ),

		'wwd_1'           => array( 'label' => 'What we do — large left', 'w' => 644, 'h' => 424, 'node' => '33:985' ),
		'wwd_2'           => array( 'label' => 'What we do — right top', 'w' => 644, 'h' => 424, 'node' => '33:990' ),
		'wwd_3'           => array( 'label' => 'What we do — wide bottom', 'w' => 1312, 'h' => 424, 'node' => '33:1000' ),

		'proj_1'          => array( 'label' => 'Projects — 1', 'w' => 644, 'h' => 400, 'node' => '33:1015' ),
		'proj_2'          => array( 'label' => 'Projects — 2', 'w' => 644, 'h' => 400, 'node' => '33:1025' ),
		'proj_3'          => array( 'label' => 'Projects — 3', 'w' => 644, 'h' => 400, 'node' => '33:1035' ),

		'materials_1'     => array( 'label' => 'Materials — left', 'w' => 644, 'h' => 448, 'node' => '33:1120' ),
		'materials_2'     => array( 'label' => 'Materials — right', 'w' => 644, 'h' => 448, 'node' => '33:1125' ),

		'gallery_1'       => array( 'label' => 'Gallery — 1', 'w' => 644, 'h' => 552, 'node' => '33:1136' ),
		'gallery_2'       => array( 'label' => 'Gallery — 2', 'w' => 644, 'h' => 552, 'node' => '33:1138' ),

		'marquee_1'       => array( 'label' => 'Marquee — 1', 'w' => 520, 'h' => 680, 'node' => '33:1147' ),
		'marquee_2'       => array( 'label' => 'Marquee — 2', 'w' => 520, 'h' => 680, 'node' => '33:1148' ),
		'marquee_3'       => array( 'label' => 'Marquee — 3', 'w' => 520, 'h' => 680, 'node' => '33:1149' ),
		'marquee_4'       => array( 'label' => 'Marquee — 4', 'w' => 520, 'h' => 680, 'node' => '33:1150' ),
		'marquee_5'       => array( 'label' => 'Marquee — 5', 'w' => 520, 'h' => 680, 'node' => '33:1151' ),

		'contact'         => array( 'label' => 'Contact — image', 'w' => 600, 'h' => 543, 'node' => '33:1156' ),
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
