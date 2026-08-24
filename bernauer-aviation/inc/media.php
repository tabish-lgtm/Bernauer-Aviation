<?php
/**
 * Shared media helpers — play-button markup and video-embed URL parsing.
 * Used by the Projects carousel and the Behind Bernauer Design video.
 *
 * @package Bernauer_Aviation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'bernauer_play_button' ) ) :
	/** Play-button markup (halo + dark circle + triangle). */
	function bernauer_play_button() {
		return '<span class="play-halo" aria-hidden="true"></span>'
			. '<span class="play-btn" aria-hidden="true">'
			. '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
			. '<path d="M12 9.5v13l11-6.5-11-6.5z" fill="#ffffff"/></svg></span>';
	}
endif;

if ( ! function_exists( 'bernauer_video_embed' ) ) :
	/** Convert a YouTube/Vimeo watch URL to an embeddable URL; empty if not one. */
	function bernauer_video_embed( $url ) {
		if ( preg_match( '~youtu\.be/([\w-]+)~', $url, $m ) || preg_match( '~youtube\.com/(?:watch\?v=|embed/)([\w-]+)~', $url, $m ) ) {
			return 'https://www.youtube-nocookie.com/embed/' . $m[1] . '?autoplay=1&rel=0';
		}
		if ( preg_match( '~vimeo\.com/(?:video/)?(\d+)~', $url, $m ) ) {
			return 'https://player.vimeo.com/video/' . $m[1] . '?autoplay=1';
		}
		return '';
	}
endif;
