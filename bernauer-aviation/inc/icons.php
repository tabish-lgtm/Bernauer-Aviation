<?php
/**
 * Inline SVG icons — the exact glyphs exported from the Figma design.
 *
 * Benefit glyphs are solid and fixed black (#09090b). Social glyphs use
 * `currentColor` so each placement (light navbar / dark footer) sets its own
 * tone via CSS. Arrow glyphs are the button's inner mark only — the 56×56
 * button chrome (surface + border) is drawn in CSS.
 *
 * @package Bernauer_Aviation
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return an inline SVG by name.
 *
 * @param string $name Icon name.
 * @return string SVG markup (empty string if unknown).
 */
function bernauer_icon( $name ) {
	$open32 = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
	$open24 = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
	$open56 = '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
	$open20l = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';

	switch ( $name ) {
		// --- Benefit glyphs (solid, Figma export) ---
		case 'aviation':
			return $open32 . '<path d="M19.2124 8.45358V5.87398C19.2124 4.0986 17.7732 2.65936 15.9978 2.65936C14.2224 2.65936 12.7832 4.0986 12.7832 5.87398V8.45358C12.7832 9.40067 12.2808 10.2767 11.4634 10.7551L4.94338 14.5709C3.76964 15.2578 4.25687 17.055 5.61685 17.055H11.6489C12.3853 17.055 12.9822 17.6519 12.9822 18.3883V21.6902C12.9822 22.571 12.6915 23.4272 12.1552 24.1258L9.78872 27.2088C9.35406 27.775 9.44611 28.5839 9.99691 29.038C10.3709 29.3463 10.8834 29.4258 11.3332 29.2453L14.9823 27.7483C15.6303 27.4825 16.3568 27.4823 17.0049 27.7477L20.6623 29.2453C21.1122 29.4258 21.6247 29.3463 21.9986 29.038C22.5494 28.5839 22.6415 27.775 22.2068 27.2088L19.8403 24.1258C19.304 23.4272 19.0133 22.571 19.0133 21.6902V18.3883C19.0133 17.6519 19.6103 17.055 20.3467 17.055H26.3787C27.7387 17.055 28.2259 15.2578 27.0522 14.5709L20.5321 10.7551C19.7147 10.2767 19.2124 9.40067 19.2124 8.45358Z" fill="#09090B"/></svg>';
		case 'craftsmanship':
			return $open32 . '<path d="M24.9603 15.1045C25.6226 16.7774 25.3878 18.6414 24.3275 20.1289L17.2669 28.7012C17.1886 28.811 17.0974 28.9071 16.9974 28.9883V18.4727C17.9746 18.077 18.6644 17.1191 18.6644 16C18.6644 14.5272 17.4701 13.333 15.9974 13.333C14.5246 13.333 13.3304 14.5272 13.3304 16C13.3304 17.1191 14.0201 18.077 14.9974 18.4727V28.9883C14.8973 28.9071 14.8061 28.811 14.7278 28.7012L7.6673 20.1289C6.60701 18.6414 6.37212 16.7774 7.03449 15.1045L8.67707 10H23.3177L24.9603 15.1045ZM22.6644 2.66699C24.1369 2.66717 25.3302 3.86051 25.3304 5.33301C25.3304 6.80566 24.137 7.99982 22.6644 8H9.33039C7.85778 7.99982 6.66437 6.80566 6.66437 5.33301C6.66455 3.86051 7.85789 2.66717 9.33039 2.66699H22.6644Z" fill="#09090B"/></svg>';
		case 'materials':
			return $open32 . '<path d="M24.7185 4.96356L28.6146 9.40199C29.5188 10.432 29.5726 11.9673 28.7428 13.0597L18.2446 26.8795C17.1097 28.3735 14.8851 28.3735 13.7502 26.8795L3.252 13.0597C2.4222 11.9673 2.47601 10.432 3.38019 9.40199L7.27631 4.96356C7.81432 4.35067 8.58547 4 9.39528 4H13.4773H18.8325H22.5995C23.4093 4 24.1805 4.35067 24.7185 4.96356Z" fill="#09090B"/></svg>';
		case 'delivery':
			return $open32 . '<path fill-rule="evenodd" clip-rule="evenodd" d="M17.6475 15.7641L30.0378 3.37379C30.4284 2.98327 30.4284 2.3501 30.0378 1.95958C29.6473 1.56906 29.0141 1.56906 28.6236 1.95958L24.692 5.89121C22.3576 3.88154 19.3194 2.66669 15.9974 2.66669C8.6336 2.66669 2.66406 8.63622 2.66406 16C2.66406 23.3638 8.6336 29.3334 15.9974 29.3334C23.3612 29.3334 29.3307 23.3638 29.3307 16C29.3307 13.3626 28.565 10.9041 27.2437 8.83461L24.0673 12.011C24.6627 13.2132 24.9974 14.5675 24.9974 16C24.9974 20.9706 20.968 25 15.9974 25C11.0268 25 6.9974 20.9706 6.9974 16C6.9974 11.0295 11.0268 7.00002 15.9974 7.00002C18.1224 7.00002 20.0754 7.73649 21.6151 8.96812L20.1896 10.3936C19.021 9.51842 17.5697 9.00002 15.9974 9.00002C12.1314 9.00002 8.9974 12.134 8.9974 16C8.9974 19.866 12.1314 23 15.9974 23C19.8634 23 22.9974 19.866 22.9974 16C22.9974 15.1303 22.8388 14.2976 22.5489 13.5294L19.6379 16.4404C19.4203 18.2578 17.8734 19.6667 15.9974 19.6667C13.9724 19.6667 12.3307 18.0251 12.3307 16C12.3307 13.975 13.9724 12.3334 15.9974 12.3334C16.6465 12.3334 17.2563 12.502 17.7852 12.798L16.2333 14.3499C16.1562 14.339 16.0775 14.3334 15.9974 14.3334C15.0769 14.3334 14.3307 15.0795 14.3307 16C14.3307 16.9205 15.0769 17.6667 15.9974 17.6667C16.9179 17.6667 17.6641 16.9205 17.6641 16C17.6641 15.9199 17.6584 15.8412 17.6475 15.7641Z" fill="#09090B"/></svg>';
		case 'tailored':
			return $open32 . '<path d="M26.6445 19.9805C26.6445 19.9805 29.3115 22.7713 29.3115 24.9805C29.3115 27.1896 27.9779 27.9805 26.6445 27.9805C25.3113 27.9804 23.9785 27.1895 23.9785 24.9805C23.9785 22.7782 26.628 19.9978 26.6445 19.9805ZM12.3955 4.14455C13.9378 2.61826 16.4343 2.61822 17.9766 4.14455L27.3672 13.4395C27.5967 13.6667 27.7028 13.9908 27.6514 14.3096C27.5998 14.6285 27.397 14.9036 27.1074 15.0469L23.0791 17.0401L14.8457 25.1885C13.3034 26.7148 10.8069 26.7149 9.26465 25.1885L3.00391 18.9922C2.23137 18.2276 1.84376 17.221 1.84375 16.2158C1.84375 15.2107 2.23138 14.2041 3.00391 13.4395L12.3955 4.14455ZM16.5693 5.56643C15.8064 4.8114 14.5657 4.81145 13.8027 5.56643L4.41113 14.8613C4.30047 14.9709 4.2061 15.0899 4.12793 15.2158H22.2568L24.9648 13.875L16.5693 5.56643Z" fill="#09090B"/></svg>';
		case 'finish':
			return $open32 . '<path d="M15.25 15.1299V29.2763C14.7662 29.2049 14.2893 29.0657 13.834 28.8554L7.16699 25.7763C5.24118 24.8867 4.00005 22.902 4 20.7119V11.2881C4.00001 10.7152 4.08621 10.1567 4.24609 9.6279L15.25 15.1299ZM27.7529 9.6279C27.9129 10.1568 28 10.7151 28 11.2881V20.7119C27.9999 22.902 26.7588 24.8867 24.833 25.7763L18.166 28.8554C17.7107 29.0657 17.2338 29.2049 16.75 29.2763V15.1299L27.7529 9.6279ZM13.834 3.1445C15.213 2.50758 16.787 2.50758 18.166 3.1445L24.833 6.2236C25.793 6.66707 26.582 7.3832 27.1328 8.26071L16 13.8281L4.86621 8.26071C5.41702 7.383 6.20682 6.66714 7.16699 6.2236L13.834 3.1445Z" fill="#09090B"/></svg>';

		// --- Benefits: large column glyphs (solid, fixed black) ---
			case 'experience':
				return $open32 . '<path d="M16 3.333c-4.05 0-7.333 3.283-7.333 7.334 0 2.86 1.638 5.336 4.026 6.545l-1.36 9.52a1 1 0 0 0 1.47 1.02L16 27.02l3.197 1.732a1 1 0 0 0 1.47-1.02l-1.36-9.52a7.334 7.334 0 0 0 4.026-6.545c0-4.05-3.283-7.334-7.333-7.334Zm0 2.667a4.667 4.667 0 1 1 0 9.333 4.667 4.667 0 0 1 0-9.333Z" fill="#09090B"/></svg>';
			case 'document':
				return $open32 . '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 4.667A2.667 2.667 0 0 1 10.667 2h7.115c.707 0 1.385.281 1.885.781l4.885 4.886c.5.5.781 1.178.781 1.885v15.781A2.667 2.667 0 0 1 22.667 30H10.667A2.667 2.667 0 0 1 8 27.333V4.667ZM12 12a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1Zm1 4a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2h-7Zm0 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z" fill="#09090B"/></svg>';
			case 'user-card':
				return $open32 . '<path fill-rule="evenodd" clip-rule="evenodd" d="M4 8a3.333 3.333 0 0 1 3.333-3.333h17.334A3.333 3.333 0 0 1 28 8v16a3.333 3.333 0 0 1-3.333 3.333H7.333A3.333 3.333 0 0 1 4 24V8Zm8 2.667a2.667 2.667 0 1 1 5.333 0 2.667 2.667 0 0 1-5.333 0Zm2.667 4.666c-2.887 0-5.334 1.86-5.334 4.267 0 .368.299.667.667.667h9.333a.667.667 0 0 0 .667-.667c0-2.407-2.446-4.267-5.333-4.267ZM21 11a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-1 5a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1Z" fill="#09090B"/></svg>';

		// --- One Team band badge glyphs (outline, currentColor, ~40px) ---
			case 'warehouse':
				return '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 17 20 8l14 9v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V17Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 34V22h12v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 26h12M14 30h12" stroke="currentColor" stroke-width="1.4"/></svg>';
			case 'people-group':
				return '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="20" cy="14" r="3.4" stroke="currentColor" stroke-width="1.5"/><circle cx="11" cy="16" r="2.8" stroke="currentColor" stroke-width="1.5"/><circle cx="29" cy="16" r="2.8" stroke="currentColor" stroke-width="1.5"/><path d="M14 27a6 6 0 0 1 12 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 27a5 5 0 0 1 6-4.9M34 27a5 5 0 0 0-6-4.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

		// --- Why-choose column glyphs (outline, currentColor, ~40px) ---
			case 'plane-line':
				return '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 5c1.1 0 2 1.4 2 3.2v6.1l11 6.6v2.5l-11-3.2v6.3l3 2.2v2.1l-5-1.4-5 1.4v-2.1l3-2.2v-6.3l-11 3.2v-2.5l11-6.6V8.2C18 6.4 18.9 5 20 5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
			case 'clipboard-check':
				return '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="9" y="8" width="22" height="26" rx="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M15 8V6.5A2.5 2.5 0 0 1 17.5 4h5A2.5 2.5 0 0 1 25 6.5V8" stroke="currentColor" stroke-width="1.4"/><path d="M14.5 20.5l3 3 6-6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 28h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
			case 'people-chat':
				return '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="14" cy="14" r="4" stroke="currentColor" stroke-width="1.4"/><circle cx="26" cy="14" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M6 31a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M22 24.5A8 8 0 0 1 34 31" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M15 6.5A5 5 0 0 1 25 6.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

		// --- Small checklist glyphs (20px, currentColor line icons) ---
			case 'search':
				return $open20l . '<circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.6"/><path d="m20 20-4.5-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
			case 'folder':
				return $open20l . '<path d="M3 7a2 2 0 0 1 2-2h3.5l2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
			case 'archive-check':
				return $open20l . '<rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" stroke-width="1.6"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" stroke="currentColor" stroke-width="1.6"/><path d="m9.5 13.5 2 2 3.5-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
			case 'chat':
				return $open20l . '<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3.5V16H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
			case 'clock':
				return $open20l . '<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
			case 'headphones':
				return $open20l . '<path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="3" y="13" width="4" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="17" y="13" width="4" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>';
			case 'users':
				return $open20l . '<circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17 14.2a5.5 5.5 0 0 1 3.5 4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
			case 'shield-check':
				return $open20l . '<path d="M12 3l7 2.5V11c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V5.5L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
			case 'grid-circle':
				return $open20l . '<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="9" r="1.3" fill="currentColor"/><circle cx="15" cy="9" r="1.3" fill="currentColor"/><circle cx="9" cy="15" r="1.3" fill="currentColor"/><circle cx="15" cy="15" r="1.3" fill="currentColor"/></svg>';
			case 'learning':
				return $open20l . '<path d="M12 4 3 8.5l9 4.5 9-4.5L12 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 11v4.5c0 1 2.24 2.5 5 2.5s5-1.5 5-2.5V11" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
			case 'globe':
				return $open20l . '<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" stroke="currentColor" stroke-width="1.6"/></svg>';

		// --- Workshop equipment glyphs (20px, currentColor line icons) ---
			case 'cutter':
				return $open20l . '<circle cx="8" cy="16" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M10 14 20 4M16 4h4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
			case 'needle':
				return $open20l . '<path d="M20 4 8 16m0 0-3 3m3-3-1.5-1.5M8 16l-1.5-1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18" cy="6" r="1.6" stroke="currentColor" stroke-width="1.6"/></svg>';
			case 'robot':
				return $open20l . '<rect x="5" y="8" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M12 4v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="4" r="1.4" fill="currentColor"/><circle cx="9.5" cy="13" r="1.2" fill="currentColor"/><circle cx="14.5" cy="13" r="1.2" fill="currentColor"/></svg>';
			case 'spray':
				return $open20l . '<rect x="7" y="8" width="8" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M9 8V6a2 2 0 0 1 2-2h1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M15 6h2M15 9h3M17 4v0M19 7v0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
			case 'sewing':
				return $open20l . '<rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M9 6v12M9 9h6M9 15h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
			case 'table':
				return $open20l . '<path d="M3 8h18M4 8v11M20 8V19M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2M8 8v3M16 8v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
			case 'boxes':
				return $open20l . '<rect x="4" y="11" width="7" height="8" rx="1" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="11" width="7" height="8" rx="1" stroke="currentColor" stroke-width="1.6"/><rect x="8.5" y="4" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.6"/></svg>';

		// --- Social (currentColor) ---
		case 'instagram':
			return $open24 . '<path d="M17.1791 8.08049C17.0586 7.77031 16.9147 7.54876 16.6821 7.31612C16.4495 7.08349 16.228 6.93948 15.9179 6.81901C15.6839 6.72762 15.3323 6.61961 14.6844 6.59053C13.9839 6.55868 13.7735 6.55176 11.9986 6.55176C11.7771 6.55176 11.5792 6.55176 11.402 6.55176C10.1629 6.55176 9.9262 6.56007 9.31291 6.58776C8.66501 6.61684 8.31337 6.72485 8.07941 6.81624C7.7693 6.93671 7.5478 7.08072 7.31522 7.31335C7.08264 7.54599 6.93866 7.76754 6.81822 8.07772C6.72684 8.31174 6.61886 8.66346 6.58979 9.31151C6.55795 10.0122 6.55103 10.2213 6.55103 11.9965C6.55103 13.7717 6.55795 13.9822 6.58979 14.6828C6.61886 15.3309 6.72823 15.6826 6.81822 15.9166C6.93866 16.2268 7.08264 16.4484 7.31522 16.681C7.5478 16.9136 7.7693 17.0576 8.07941 17.1781C8.31337 17.2695 8.66501 17.3775 9.31291 17.408C10.0134 17.4398 10.2238 17.4467 11.9986 17.4467C13.7735 17.4467 13.9839 17.4398 14.6844 17.408C15.3323 17.3789 15.6839 17.2709 15.9179 17.1795C16.228 17.059 16.4495 16.915 16.6821 16.6824C16.9147 16.4497 17.0586 16.2296 17.1791 15.9194C17.2705 15.6854 17.3784 15.3337 17.4075 14.6856C17.4394 13.9849 17.4463 13.7745 17.4463 12.0006C17.4463 10.2268 17.4394 10.0163 17.4075 9.31566C17.3784 8.66761 17.2691 8.31589 17.1791 8.08188V8.08049ZM11.9986 15.414C10.1145 15.414 8.5861 13.8866 8.5861 12.0006C8.5861 10.1146 10.1145 8.5873 11.9986 8.5873C13.8828 8.5873 15.4112 10.116 15.4112 12.0006C15.4112 13.8852 13.8842 15.414 11.9986 15.414ZM15.5455 9.25058C15.1052 9.25058 14.7481 8.89332 14.7481 8.45298C14.7481 8.01264 15.1052 7.65538 15.5455 7.65538C15.9857 7.65538 16.3429 8.01264 16.3429 8.45298C16.3429 8.89332 15.9857 9.25058 15.5455 9.25058Z" fill="currentColor"/><path d="M11.9986 14.2163C13.2219 14.2163 14.2137 13.2243 14.2137 12.0007C14.2137 10.7771 13.2219 9.78516 11.9986 9.78516C10.7753 9.78516 9.78357 10.7771 9.78357 12.0007C9.78357 13.2243 10.7753 14.2163 11.9986 14.2163Z" fill="currentColor"/><path d="M20.9834 6.90076C20.9266 6.17794 20.8034 5.6919 20.5501 5.17817C20.3424 4.75721 20.1126 4.44426 19.779 4.12301C19.1837 3.55389 18.4555 3.20771 17.5874 3.08308C17.1666 3.02216 17.0835 3.00415 14.9322 3H12.0028C8.2455 3 7.14629 3.00415 6.93309 3.02216C6.16197 3.08585 5.68159 3.20771 5.15967 3.46804C4.75681 3.66882 4.43839 3.90007 4.12552 4.22548C3.55376 4.81814 3.20766 5.5465 3.08306 6.41472C3.02215 6.83568 3.00415 6.92153 3 9.07062C3 9.78791 3 10.7309 3 11.9965C3 15.7519 3.00415 16.85 3.02215 17.0632C3.08445 17.8138 3.20212 18.2859 3.45132 18.8024C3.92755 19.7911 4.8371 20.5333 5.90863 20.8103C6.27965 20.9058 6.68943 20.9585 7.21551 20.9834C7.43839 20.9931 9.7102 21 11.9834 21C14.2566 21 16.5298 20.9972 16.7471 20.9862C17.3563 20.9571 17.7107 20.91 18.1011 20.8089C19.1795 20.5306 20.0725 19.7994 20.5584 18.7969C20.802 18.2929 20.9266 17.8027 20.9834 17.0909C20.9958 16.9358 21 14.4627 21 11.9938C21 9.52481 20.9945 7.05585 20.982 6.90076H20.9834ZM18.6036 14.7411C18.5704 15.4486 18.4582 15.9319 18.2949 16.3543C18.1246 16.7918 17.8976 17.1616 17.5279 17.5313C17.1583 17.901 16.7886 18.1281 16.3512 18.2984C15.9289 18.4632 15.4444 18.5754 14.737 18.6072C14.0281 18.639 13.8025 18.6474 11.9972 18.6474C10.192 18.6474 9.96631 18.639 9.2575 18.6072C8.55007 18.5754 8.06691 18.4632 7.64467 18.2984C7.2072 18.1281 6.83756 17.901 6.46793 17.5313C6.09829 17.1616 5.87125 16.7904 5.70097 16.3543C5.53623 15.9319 5.42547 15.4486 5.39225 14.7411C5.36041 14.0321 5.3521 13.8064 5.3521 12.0007C5.3521 10.195 5.36041 9.9693 5.39225 9.26033C5.42409 8.55273 5.53623 8.06947 5.70097 7.64713C5.87125 7.20955 6.09829 6.83983 6.46793 6.47011C6.83756 6.10039 7.20858 5.8733 7.64467 5.70436C8.06691 5.53958 8.55007 5.42742 9.2575 5.39557C9.96631 5.36372 10.1934 5.35541 11.9958 5.35541H11.9986C13.8025 5.35541 14.0281 5.36372 14.737 5.39557C15.4444 5.42742 15.9276 5.53958 16.3512 5.70436C16.7886 5.8733 17.1583 6.10039 17.5279 6.47011C17.8976 6.83983 18.1246 7.21094 18.2949 7.64713C18.4582 8.06947 18.5704 8.55273 18.6036 9.26033C18.6354 9.9693 18.6437 10.1964 18.6437 12.0007C18.6437 13.805 18.6354 14.0321 18.6036 14.7411Z" fill="currentColor"/></svg>';
		case 'facebook':
			return $open24 . '<path d="M12 3C7.05 3 3 7.07035 3 12.0452C3 16.509 6.303 20.2176 10.56 21V14.5779H8.31V12.0452H10.56V10.0553C10.56 7.79397 12 6.52764 14.07 6.52764C14.7 6.52764 15.42 6.61809 16.05 6.70854V9.01508H14.88C13.8 9.01508 13.53 9.55779 13.53 10.2814V12.0452H15.915L15.51 14.5779H13.53V20.991C17.7825 20.204 21 16.509 21 12.0452C21 7.07035 16.95 3 12 3Z" fill="currentColor"/></svg>';
		case 'linkedin':
			return $open24 . '<path d="M4.98 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3.3 9h3.36v11H3.3V9Zm5.5 0h3.22v1.5h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.05 2.25 4.05 5.18V20h-3.36v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.59V20H8.8V9Z" fill="currentColor"/></svg>';

		// --- Project nav arrows (inner glyph only; button chrome is CSS) ---
		case 'arrow-forward':
			return $open56 . '<path fill-rule="evenodd" clip-rule="evenodd" d="M36.7071 28.7071C37.0976 28.3166 37.0976 27.6834 36.7071 27.2929L31.3738 21.9595C30.9832 21.569 30.3501 21.569 29.9596 21.9595C29.569 22.3501 29.569 22.9832 29.9596 23.3738L33.5858 27H20C19.4477 27 19 27.4477 19 28C19 28.5523 19.4477 29 20 29H33.5858L29.9596 32.6262C29.569 33.0167 29.569 33.6499 29.9596 34.0404C30.3501 34.4309 30.9832 34.4309 31.3738 34.0404L36.7071 28.7071Z" fill="currentColor"/></svg>';
		case 'arrow-previous':
			return $open56 . '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.2929 27.2929C18.9024 27.6834 18.9024 28.3166 19.2929 28.7071L24.6262 34.0405C25.0168 34.431 25.6499 34.431 26.0404 34.0405C26.431 33.6499 26.431 33.0168 26.0404 32.6262L22.4142 29H36C36.5523 29 37 28.5523 37 28C37 27.4477 36.5523 27 36 27H22.4142L26.0404 23.3738C26.431 22.9833 26.431 22.3501 26.0404 21.9596C25.6499 21.5691 25.0168 21.5691 24.6262 21.9596L19.2929 27.2929Z" fill="currentColor"/></svg>';
	}

	return '';
}
