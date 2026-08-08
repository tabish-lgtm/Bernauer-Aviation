<?php
/**
 * Navbar — logo + tagline (left), social icons (right).
 *
 * @package Bernauer_Aviation
 */
?>
<header class="navbar" data-nav-root>
	<a class="navbar__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
		<?php if ( has_custom_logo() ) : ?>
			<?php the_custom_logo(); ?>
		<?php else : ?>
			<span class="navbar__mark" aria-hidden="true">
				<svg width="25" height="36" viewBox="0 0 25.324 36.404" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="0" y="0" width="7.4" height="36.404" rx="3.7" fill="#09090b"/>
					<circle cx="14.02" cy="25.1" r="11.3" fill="#09090b"/>
				</svg>
			</span>
			<span class="navbar__wordmark">
				<span class="navbar__name">Bernauer Aviation</span>
				<span class="navbar__tagline">Aircraft Interior</span>
			</span>
		<?php endif; ?>
	</a>

	<nav class="navbar__social" aria-label="<?php esc_attr_e( 'Social links', 'bernauer-aviation' ); ?>">
		<a class="navbar__icon" href="<?php echo esc_url( get_theme_mod( 'bernauer_instagram', 'https://www.instagram.com/bernauer.design/' ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><?php echo bernauer_icon( 'instagram' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
		<a class="navbar__icon" href="<?php echo esc_url( get_theme_mod( 'bernauer_facebook', 'https://www.facebook.com/bernauer.design/' ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><?php echo bernauer_icon( 'facebook' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
	</nav>
</header>
