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
		<a class="navbar__icon" href="<?php echo esc_url( get_theme_mod( 'bernauer_instagram', 'https://www.instagram.com/bernauer.design/' ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" stroke="#09090b" stroke-width="1.6"/>
				<circle cx="12" cy="12" r="4.25" stroke="#09090b" stroke-width="1.6"/>
				<circle cx="17.2" cy="6.8" r="1.15" fill="#09090b"/>
			</svg>
		</a>
		<a class="navbar__icon" href="<?php echo esc_url( get_theme_mod( 'bernauer_facebook', 'https://www.facebook.com/bernauer.design/' ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" fill="#09090b"/>
			</svg>
		</a>
	</nav>
</header>
