<?php
/**
 * Fallback template — renders the same one-page layout as the front page.
 *
 * @package Bernauer_Aviation
 */

get_header();

get_template_part( 'template-parts/hero' );
get_template_part( 'template-parts/what-we-do' );
get_template_part( 'template-parts/projects' );
get_template_part( 'template-parts/benefits' );
get_template_part( 'template-parts/cta-band' );
get_template_part( 'template-parts/oneteam' );
get_template_part( 'template-parts/behind-bernauer' );

get_footer();
