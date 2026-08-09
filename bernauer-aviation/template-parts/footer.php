<?php
/**
 * Footer — dark contact section (two cards + image) and footer bar.
 *
 * @package Bernauer_Aviation
 */

$contact_title = get_theme_mod( 'bernauer_contact_title', 'Talk with Our Aviation Interior Specialists' );
$contact_desc  = get_theme_mod( 'bernauer_contact_desc', 'For private aviation clients, fleet operators, & premium aircraft interior solutions designed around comfort and craftsmanship.' );
$phone         = get_theme_mod( 'bernauer_phone', '+49 7742 927 88 30' );
$phone2        = get_theme_mod( 'bernauer_phone2', '+41 43 508 02 26' );
$email         = get_theme_mod( 'bernauer_email', 'info@bernauer.design' );
$address       = get_theme_mod( 'bernauer_address', "Weberstraße 10a\n79801 Hohentengen-Lienheim\nDeutschland" );
$map_url       = get_theme_mod( 'bernauer_map', 'https://www.google.com/maps/place/Bernauer+Design+-+Polster+%26+Taschen+%22Swiss+Made%22/@47.565653,8.44304,13z/data=!4m6!3m5!1s0x47907786b3c3375d:0x9a4b4dd068a2d55b!8m2!3d47.5749143!4d8.5111897!16s%2Fg%2F11w9877cr4?hl=de' );
$map_embed     = get_theme_mod( 'bernauer_map_embed', 'https://maps.google.com/maps?q=47.5749143,8.5111897&z=15&hl=de&output=embed' );
$copyright     = get_theme_mod( 'bernauer_copyright', '© 2026 Bernauer Aviation, Inc.' );

$phone_href = 'tel:' . preg_replace( '/[^0-9+]/', '', $phone );
?>
<footer class="footer" id="contact">
	<div class="footer__inner">
	<div class="footer__contact">
		<div class="footer__main">
			<div class="footer__intro">
				<h2 class="footer__title"><?php echo esc_html( $contact_title ); ?></h2>
				<p class="footer__desc"><?php echo esc_html( $contact_desc ); ?></p>
			</div>
			<div class="footer__methods-wrap">
				<div class="footer__methods">
					<a class="contact-card" href="<?php echo esc_attr( $phone_href ); ?>">
						<span class="contact-card__icon" aria-hidden="true">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6.6 3.5H4.5A1.5 1.5 0 0 0 3 5c0 8.3 6.7 15 15 15a1.5 1.5 0 0 0 1.5-1.5v-2.1a1.5 1.5 0 0 0-1.15-1.46l-2.9-.72a1.5 1.5 0 0 0-1.53.54l-.7.9a11.4 11.4 0 0 1-5.2-5.2l.9-.7a1.5 1.5 0 0 0 .54-1.53l-.72-2.9A1.5 1.5 0 0 0 6.6 3.5Z" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
							</svg>
						</span>
						<span class="contact-card__info">
							<span class="contact-card__label">Call Us</span>
							<span class="contact-card__value"><?php echo esc_html( $phone ); ?></span>
							<?php if ( $phone2 ) : ?>
								<span class="contact-card__value"><?php echo esc_html( $phone2 ); ?></span>
							<?php endif; ?>
						</span>
					</a>
					<a class="contact-card" href="mailto:<?php echo esc_attr( $email ); ?>">
						<span class="contact-card__icon" aria-hidden="true">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="3" y="5" width="18" height="14" rx="2" stroke="#ffffff" stroke-width="1.6"/>
								<path d="m4 7 8 6 8-6" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
						<span class="contact-card__info">
							<span class="contact-card__label">Email Us</span>
							<span class="contact-card__value"><?php echo esc_html( $email ); ?></span>
						</span>
					</a>
				</div>
				<?php if ( $address ) : ?>
					<address class="footer__address">
						<span class="footer__address-icon" aria-hidden="true">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" stroke="#a6a09b" stroke-width="1.6" stroke-linejoin="round"/>
								<circle cx="12" cy="10" r="2.5" stroke="#a6a09b" stroke-width="1.6"/>
							</svg>
						</span>
						<span class="footer__address-text"><?php echo nl2br( esc_html( $address ) ); ?></span>
						<?php if ( $map_url ) : ?>
							<a class="footer__map-link" href="<?php echo esc_url( $map_url ); ?>" target="_blank" rel="noopener noreferrer">View on map<span aria-hidden="true"> →</span></a>
						<?php endif; ?>
					</address>
				<?php endif; ?>
			</div>
		</div>
		<div class="footer__image">
			<?php if ( $map_embed ) : ?>
				<iframe
					class="footer__map"
					src="<?php echo esc_url( $map_embed ); ?>"
					title="<?php esc_attr_e( 'Bernauer Design location map', 'bernauer-aviation' ); ?>"
					loading="lazy"
					referrerpolicy="no-referrer-when-downgrade"
					allowfullscreen
				></iframe>
			<?php else : ?>
				<?php bernauer_image( 'contact', 'footer__img' ); ?>
			<?php endif; ?>
		</div>
	</div>

	<div class="footer__bar">
		<p class="footer__copy"><?php echo esc_html( $copyright ); ?></p>

		<div class="footer__social">
			<a href="<?php echo esc_url( get_theme_mod( 'bernauer_instagram', 'https://www.instagram.com/bernauer.design/' ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><?php echo bernauer_icon( 'instagram' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
			<a href="<?php echo esc_url( get_theme_mod( 'bernauer_facebook', 'https://www.facebook.com/bernauer.design/' ) ); ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><?php echo bernauer_icon( 'facebook' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
		</div>
	</div>
	</div><!-- .footer__inner -->
</footer>
