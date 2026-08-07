<?php
/**
 * Bernauer Aviation — theme functions.
 *
 * @package Bernauer_Aviation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

if ( ! defined( 'BERNAUER_VERSION' ) ) {
	define( 'BERNAUER_VERSION', '1.0.0' );
}

// Editable image-slot system (placeholders + Customizer controls).
require_once get_theme_file_path( 'inc/images.php' );
// Editable text / contact / social settings.
require_once get_theme_file_path( 'inc/customizer.php' );

/**
 * Theme supports.
 */
function bernauer_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'custom-logo', array(
		'height'      => 36,
		'width'       => 216,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'bernauer-aviation' ),
	) );
}
add_action( 'after_setup_theme', 'bernauer_setup' );

/**
 * Enqueue styles and scripts.
 */
function bernauer_assets() {
	// Main stylesheet (contains theme header + all styles).
	wp_enqueue_style(
		'bernauer-style',
		get_stylesheet_uri(),
		array(),
		BERNAUER_VERSION
	);

	// Front-end interactions (mobile nav, marquee).
	wp_enqueue_script(
		'bernauer-main',
		get_theme_file_uri( 'assets/js/main.js' ),
		array(),
		BERNAUER_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'bernauer_assets' );

/**
 * Helper: return a theme asset image URL.
 *
 * @param string $file File name inside assets/images.
 * @return string
 */
function bernauer_img( $file ) {
	return esc_url( get_theme_file_uri( 'assets/images/' . $file ) );
}
