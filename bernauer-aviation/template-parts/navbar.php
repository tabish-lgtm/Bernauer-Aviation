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
				<svg width="27" height="36" viewBox="0 0 96 128" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M33 2L33 122L18 122L5 111L14 34L33 2Z" fill="#09090b"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M56 44C77.6 44 96 62.4 96 84C96 105.6 77.6 124 56 124C34.4 124 16 105.6 16 84C16 62.4 34.4 44 56 44ZM56 68C64.8 68 72 75.2 72 84C72 92.8 64.8 100 56 100C47.2 100 40 92.8 40 84C40 75.2 47.2 68 56 68Z" fill="#09090b"/>
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
