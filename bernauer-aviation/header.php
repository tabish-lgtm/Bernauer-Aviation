<?php
/**
 * Header — document head, opening body, navbar.
 *
 * @package Bernauer_Aviation
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div class="site">
	<?php get_template_part( 'template-parts/navbar' ); ?>
	<main id="content" class="site-main">
