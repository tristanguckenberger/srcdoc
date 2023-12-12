<script>
	// @ts-nocheck
	import { themeDataStore } from '$lib/stores/themeStore';
	import { page } from '$app/stores';

	export let label;
	export let link;
	export let action;
	export let additionalClasses = '';
	export let type = 'submit';
	export let isRounded = false;
	export let userName;
	export let userAvatar;
	export let showDropDown;
	export let style;

	let profileControl = false;

	$: profileControl = Boolean(userName);

	// $: console.log(userAvatar);

	let close = '<-';

	$: themeString = $themeDataStore?.theme?.join(' ');
	$: showSideBarToggle = label === 'open' || label === 'close';
	$: authBtn =
		label === 'Sign In' ||
		label === 'Sign Up' ||
		label?.includes('Continue') ||
		label?.includes('Sign Up');
	$: isHomePage = $page?.route?.id === '/';
	$: isIcon =
		label === 'open' ||
		label === 'close' ||
		label === 'play' ||
		label === 'pause' ||
		label === 'fav';
</script>

<div style={`${themeString}`} class:authBtn>
	{#if link && !action}
		<a
			href={link}
			class:isRounded={isRounded || userName}
			class:showSideBarToggle
			class:isHomePage
			class:isIcon
			class:userName
			class={additionalClasses}
			{style}
		>
			{#if label === 'open'}
				<svg xmlns="http://www.w3.org/2000/svg" fill="#000000"
					><path
						d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z"
					/></svg
				>
			{:else if label === 'close'}
				{close}
			{:else if label}
				{label}
			{:else if userName}
				<img
					class="avatar"
					src={`${userAvatar}` ?? 'https://picsum.photos/50'}
					alt="user avatar"
				/><span>{userName}</span>
				<!-- <div class="more-dropdown" on:click={action}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"
						/></svg
					>
				</div> -->
			{/if}
		</a>
	{:else}
		<button
			class:isRounded={isRounded || userName}
			typeof={type}
			on:click={() => !userName && action && action()}
			class:authBtn
			class:isHomePage
			class:showSideBarToggle
			class:follow={label === 'Follow'}
			class:isIcon
			class:userName
			class:showDropDown
			class:profileControl
			class:logoutButton={label === 'Logout'}
			class:isCancelButton={label === 'Cancel'}
			class:isDoneButton={label === 'Done'}
			class={additionalClasses}
			{style}
		>
			{#if label === 'open'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36ZM44,60H76V196H44ZM212,196H100V60H212Z"
					/></svg
				>
			{:else if label === 'close'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
					/></svg
				>
			{:else if label === 'play'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z"
					/></svg
				>
			{:else if label === 'pause'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"
					/></svg
				>
			{:else if label === 'fav'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M178,28c-20.09,0-37.92,7.93-50,21.56C115.92,35.93,98.09,28,78,28A66.08,66.08,0,0,0,12,94c0,72.34,105.81,130.14,110.31,132.57a12,12,0,0,0,11.38,0C138.19,224.14,244,166.34,244,94A66.08,66.08,0,0,0,178,28Zm-5.49,142.36A328.69,328.69,0,0,1,128,202.16a328.69,328.69,0,0,1-44.51-31.8C61.82,151.77,36,123.42,36,94A42,42,0,0,1,78,52c17.8,0,32.7,9.4,38.89,24.54a12,12,0,0,0,22.22,0C145.3,61.4,160.2,52,178,52a42,42,0,0,1,42,42C220,123.42,194.18,151.77,172.51,170.36Z"
					/></svg
				>
			{:else if label}
				{label}
			{:else if userName}
				<a href={link} class="profile-quick-control">
					<img
						class="avatar"
						src={`${userAvatar}` ?? 'https://picsum.photos/50'}
						alt="user avatar"
					/><span>{userName}</span>
				</a>
				<button class="dropdown-btn" on:click={() => action && action(showDropDown)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M144,128a16,16,0,1,1-16-16A16,16,0,0,1,144,128ZM60,112a16,16,0,1,0,16,16A16,16,0,0,0,60,112Zm136,0a16,16,0,1,0,16,16A16,16,0,0,0,196,112Z"
						/></svg
					>
				</button>
			{/if}
		</button>
	{/if}
</div>

<style>
	a,
	button {
		padding-block: 0;
		color: var(--color-primary) !important;
		border-width: 0;
		border-radius: 4px;
		padding: 10px;
		text-decoration: none;
		font-size: 1rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
	}
	svg {
		width: 1rem;
		height: 1rem;
		fill: var(--folder-button-color);
	}
	a:hover,
	button:hover {
		color: var(--text-color-highlight);
		cursor: pointer;
		background-color: var(--button-highlight) !important;
		transition: background-color 250ms ease;
	}
	button.isHomePage,
	a.isHomePage {
		background-color: #2e324c !important;
		color: #ffffff !important;
		height: calc(100% - 20px);
	}

	.isIcon {
		background-color: var(--button-highlight) !important;
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		min-width: 36.5px !important;
		min-height: 36.5px !important;
	}

	button.showSideBarToggle {
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
	}

	a.showSideBarToggle {
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
	}
	button.follow {
		margin-right: 10px;
		transform: translateY(27px);
		background-color: #ffffff54 !important;
		color: var(--color-primary) !important;
	}
	button.authBtn {
		height: 100%;
		background-color: #4da5ff !important;
	}
	div.authBtn {
		height: 100%;
		/* padding-top: 20px; */
	}
	button.isRounded,
	a.isRounded {
		border-radius: 20px;
		width: 100%;
		justify-content: center;
		height: 100%;
	}
	button.isRounded.userName,
	a.isRounded.userName {
		width: unset !important;
		height: fit-content;
		gap: 9px;
		border-radius: 30px;
		align-items: center;
		background-color: var(--button-highlight) !important;
	}
	button.isRounded.userName:hover,
	a.isRounded.userName:hover {
		background-color: #252629 !important;
	}
	.avatar {
		border-radius: 50%;
		width: 23.5px;
		height: 23.5px;
		object-fit: cover;
		border: 2px solid #a69160;
		color: #e3f1f6;
	}
	.profile-quick-control {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 0px;
	}
	button.showDropDown {
		border-bottom-right-radius: 0px !important;
		border-bottom-left-radius: 0px !important;
		border-top-left-radius: 18px !important;
		border-top-right-radius: 18px !important;
		position: relative;
		left: 10px;
	}
	button.profileControl {
		padding-left: 4.67px;
	}
	button.logoutButton {
		background-color: transparent !important;
		color: var(--color-primary) !important;
	}
	.dropdown-btn {
		background-color: transparent !important;
	}
	.profile-quick-control span {
		color: #e3f1f6;
		font-size: 1rem;
		font-weight: 900;
		font-family: 'Geologica';
	}
</style>
