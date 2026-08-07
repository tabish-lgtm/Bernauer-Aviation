<?php
/**
 * Customizer — editable text, contact details, and social links.
 *
 * @package Bernauer_Aviation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register text settings.
 *
 * @param WP_Customize_Manager $wp_customize Customizer.
 */
function bernauer_customize_text( $wp_customize ) {
	$wp_customize->add_section( 'bernauer_content', array(
		'title'    => __( 'Bernauer Content', 'bernauer-aviation' ),
		'priority' => 28,
	) );

	$fields = array(
		'bernauer_hero_title'    => array( 'label' => 'Hero title', 'default' => 'Crafting Comfort. Above Every Horizon.', 'type' => 'textarea' ),
		'bernauer_hero_desc'     => array( 'label' => 'Hero description', 'default' => 'Luxury aircraft interiors handcrafted with precision, premium materials, and uncompromising attention to detail.', 'type' => 'textarea' ),
		'bernauer_contact_title' => array( 'label' => 'Contact title', 'default' => 'Talk with Our Aviation Interior Specialists', 'type' => 'textarea' ),
		'bernauer_contact_desc'  => array( 'label' => 'Contact description', 'default' => 'For private aviation clients, fleet operators, & premium aircraft interior solutions designed around comfort and craftsmanship.', 'type' => 'textarea' ),
		'bernauer_phone'         => array( 'label' => 'Phone 1', 'default' => '+49 7742 927 88 30', 'type' => 'text' ),
		'bernauer_phone2'        => array( 'label' => 'Phone 2', 'default' => '+41 43 508 02 26', 'type' => 'text' ),
		'bernauer_email'         => array( 'label' => 'Email', 'default' => 'info@bernauer.design', 'type' => 'text' ),
		'bernauer_address'       => array( 'label' => 'Address', 'default' => "Weberstraße 10a\n79801 Hohentengen-Lienheim\nDeutschland", 'type' => 'textarea' ),
		'bernauer_map'           => array( 'label' => 'Map link URL (address "View on map")', 'default' => 'https://www.google.com/maps/place/Bernauer+Design+-+Polster+%26+Taschen+%22Swiss+Made%22/@47.565653,8.44304,13z/data=!4m6!3m5!1s0x47907786b3c3375d:0x9a4b4dd068a2d55b!8m2!3d47.5749143!4d8.5111897!16s%2Fg%2F11w9877cr4?hl=de', 'type' => 'url' ),
		'bernauer_map_embed'     => array( 'label' => 'Map embed URL (footer iframe)', 'default' => 'https://maps.google.com/maps?q=Bernauer+Design+-+Polster+%26+Taschen+Swiss+Made&hl=de&z=15&output=embed', 'type' => 'url' ),
		'bernauer_copyright'     => array( 'label' => 'Copyright', 'default' => '© 2026 Bernauer Aviation, Inc.', 'type' => 'text' ),
		'bernauer_craftsmen_video' => array( 'label' => 'Craftsmen video URL', 'default' => '', 'type' => 'url' ),
		'bernauer_instagram'     => array( 'label' => 'Instagram URL', 'default' => '#', 'type' => 'url' ),
		'bernauer_linkedin'      => array( 'label' => 'LinkedIn URL', 'default' => '#', 'type' => 'url' ),
		'bernauer_facebook'      => array( 'label' => 'Facebook URL', 'default' => '#', 'type' => 'url' ),
		'bernauer_link_blog'     => array( 'label' => 'Footer link: Blog', 'default' => '#', 'type' => 'url' ),
		'bernauer_link_jobs'     => array( 'label' => 'Footer link: Jobs', 'default' => '#', 'type' => 'url' ),
		'bernauer_link_legals'   => array( 'label' => 'Footer link: Legals', 'default' => '#', 'type' => 'url' ),
	);

	foreach ( $fields as $id => $field ) {
		$sanitize = 'url' === $field['type'] ? 'esc_url_raw' : ( 'textarea' === $field['type'] ? 'sanitize_textarea_field' : 'sanitize_text_field' );
		$wp_customize->add_setting( $id, array(
			'default'           => $field['default'],
			'sanitize_callback' => $sanitize,
			'transport'         => 'refresh',
		) );
		$wp_customize->add_control( $id, array(
			'label'   => $field['label'],
			'section' => 'bernauer_content',
			'type'    => 'textarea' === $field['type'] ? 'textarea' : 'text',
		) );
	}
}
add_action( 'customize_register', 'bernauer_customize_text' );
