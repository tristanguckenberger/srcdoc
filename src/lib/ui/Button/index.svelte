<script>
	// @ts-nocheck

	import { run } from 'svelte/legacy';
	import { themeDataStore } from '$lib/stores/themeStore';
	import { page } from '$app/stores';
	import { platformSession } from '$lib/stores/platformSession';
	import ToolTip from '$lib/ui/ToolTip/index.svelte';
	import ImagePlaceHolder from '$lib/ui/ImagePlaceHolder/index.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {any} label
	 * @property {any} link
	 * @property {any} action
	 * @property {string} [additionalClasses]
	 * @property {string} [type]
	 * @property {boolean} [isRounded]
	 * @property {any} userName
	 * @property {any} userAvatar
	 * @property {any} showDropDown
	 * @property {any} style
	 * @property {any} formaction
	 * @property {any} creating
	 * @property {any} disabled
	 */

	/** @type {Props} */
	let {
		label,
		link,
		action,
		additionalClasses = '',
		type = 'submit',
		isRounded = false,
		userName,
		userAvatar,
		showDropDown,
		style,
		formaction,
		creating = $bindable(),
		disabled
	} = $props();

	let profileControl = $state(false);
	let showToolTip = $state(false);

	run(() => {
		profileControl = Boolean(userName);
	});

	let close = '<-';

	let themeString = $derived($themeDataStore?.theme?.join(' '));
	let showSideBarToggle = $derived(
		label === 'open' || label === 'close' || label === 'open-folder' || label === 'close-folder'
	);
	let authBtn = $derived(
		label === 'Sign In' ||
			label === 'Sign Up' ||
			label?.includes('Continue') ||
			label?.includes('Sign Up')
	);
	let isHomePage = $derived($page?.route?.id === '/');
	let isIcon = $derived(
		label === 'open' ||
			label === 'close' ||
			label === 'play' ||
			label === 'pause' ||
			label === 'fav' ||
			label === 'save' ||
			label === 'close-folder' ||
			label === 'open-folder' ||
			label === 'flip-layout'
	);
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
				{#if userAvatar}
					<img
						class="avatar"
						src={`${userAvatar}` || 'https://picsum.photos/50'}
						alt="user avatar"
					/>
				{:else}
					<div class="avatar">
						<ImagePlaceHolder />
					</div>
				{/if}
				<span>{userName}</span>
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
			{:else if label === 'engine-edit'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="36"
					height="36"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"
					/></svg
				>
			{/if}
		</a>
	{:else}
		<button
			{disabled}
			{formaction}
			class:isRounded={isRounded || userName}
			typeof={type}
			onclick={() => {
				action?.();
			}}
			class:disabled
			class:authBtn
			class:isHomePage
			class:showSideBarToggle
			class:isIcon
			class:userName
			class:showDropDown
			class:profileControl
			class:logoutButton={label === 'Logout'}
			class:isCancelButton={label === 'Cancel'}
			class:isDoneButton={label === 'Done'}
			class:verifyMe={label === 'Verify Me'}
			class={additionalClasses}
			class:muted={label === 'New Project' && !$platformSession?.currentUser?.id}
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
			{:else if label === 'flip-layout'}
				<div
					class="icon-tooltip-container"
					onmouseover={() => {
						showToolTip = true;
					}}
					onmouseleave={() => {
						showToolTip = false;
					}}
					onclick={() => {
						showToolTip = false;
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M88,104H40a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V76.69L62.63,62.06A95.43,95.43,0,0,1,130,33.94h.53a95.36,95.36,0,0,1,67.07,27.33,8,8,0,0,1-11.18,11.44,79.52,79.52,0,0,0-55.89-22.77h-.45A79.56,79.56,0,0,0,73.94,73.37L59.31,88H88a8,8,0,0,1,0,16Zm128,48H168a8,8,0,0,0,0,16h28.69l-14.63,14.63a79.56,79.56,0,0,1-56.13,23.43h-.45a79.52,79.52,0,0,1-55.89-22.77,8,8,0,1,0-11.18,11.44,95.36,95.36,0,0,0,67.07,27.33H126a95.43,95.43,0,0,0,67.36-28.12L208,179.31V208a8,8,0,0,0,16,0V160A8,8,0,0,0,216,152Z"
						/></svg
					>
					{#if showToolTip}
						<ToolTip text="Flip Editor Layout" position="bottom" />
					{/if}
				</div>
			{:else if label === 'Logout'}
				<div class="logout">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"
						/></svg
					>
					{label}
				</div>
			{:else if label === 'screenshot'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z"
					/></svg
				>
			{:else if label === 'open-folder'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z"
					/></svg
				>
			{:else if label === 'close-folder'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					viewBox="0 0 256 256"
					><path
						d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64l27.73,20.8a16.12,16.12,0,0,0,9.6,3.2H200v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z"
					/></svg
				>
			{:else if label === 'play'}
				<div
					class="icon-tooltip-container"
					onmouseover={() => {
						showToolTip = true;
					}}
					onmouseleave={() => {
						showToolTip = false;
					}}
					onclick={() => {
						showToolTip = false;
					}}
				>
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
					{#if showToolTip}
						<ToolTip text="Compile Code" position="bottom" />
					{/if}
				</div>
			{:else if label === 'save'}
				<div
					class="icon-tooltip-container"
					onmouseover={() => {
						showToolTip = true;
					}}
					onmouseleave={() => {
						showToolTip = false;
					}}
					onclick={() => {
						showToolTip = false;
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M222.14,77.17,178.83,33.86A19.86,19.86,0,0,0,164.69,28H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V91.31A19.86,19.86,0,0,0,222.14,77.17ZM164,204H92V156h72Zm40,0H188V152a20,20,0,0,0-20-20H88a20,20,0,0,0-20,20v52H52V52H163l41,41ZM164,80a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h56A12,12,0,0,1,164,80Z"
						/></svg
					>
					{#if showToolTip}
						<ToolTip text="Save" position="bottom" />
					{/if}
				</div>
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
			{:else if label && !creating}
				{label}
			{:else if label && creating}
				<div id="loading"></div>
			{:else if userName}
				<a href={link} class="profile-quick-control">
					{#if userAvatar}
						<img
							class="avatar"
							src={`${userAvatar}` ?? 'https://picsum.photos/50'}
							alt="user avatar"
						/>
					{:else}
						<div class="avatar">
							<ImagePlaceHolder />
						</div>
					{/if}
					<span>{userName}</span>
				</a>
			{:else if label === 'engine-edit'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="36"
					height="36"
					fill="#ffffff"
					viewBox="0 0 256 256"
					><path
						d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"
					/></svg
				>
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
		background-color: var(--button-highlight);
		transition: background-color 250ms ease;
	}
	button.isHomePage,
	a.isHomePage {
		background-color: unset !important;
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
		background-color: var(--sidebar-toggle) !important;
		backdrop-filter: saturate(180%) blur(20px);
	}

	a.showSideBarToggle {
		width: 36.5px !important;
		height: 36.5px !important;
		max-width: 36.5px !important;
		max-height: 36.5px !important;
		background-color: #1c1d1fab !important;
		backdrop-filter: saturate(180%) blur(20px);
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
		background-color: var(--nav-dropdown) !important;
		backdrop-filter: saturate(180%) blur(20px);
	}
	button.isRounded.userName:hover,
	a.isRounded.userName:hover {
		/* background-color: var(--button-highlight) !important; */
	}
	.avatar {
		border-radius: 50%;
		width: 23.5px;
		height: 23.5px;
		object-fit: cover;
		border: 2px solid #a69160;
		color: #e3f1f6;
		overflow: hidden;
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
		color: var(--color-primary);
		font-size: 1rem;
		font-weight: 900;
		font-family: 'Geologica';
	}
	button.verifyMe {
		color: var(--color-secondary) !important;
	}
	.logout {
		flex-direction: row;
		gap: 25px;
		color: var(--color-primary);
		padding-block: 0;
		border-width: 0;
		border-top-width: 0px;
		border-right-width: 0px;
		border-bottom-width: 0px;
		border-left-width: 0px;
		border-radius: 4px;
		margin-right: 10px;
		text-decoration: none;
		font-size: 0.9rem;
		font-family: var(--action-font) !important;
		text-wrap: nowrap;
		border-style: none !important;
		display: flex;
		align-items: center;
		max-height: 36.5px;
		height: 16.5px;
		font-weight: 500;
	}
	.logout svg {
		width: 1.6rem;
		height: 1.6rem;
		fill: var(--color-primary);
	}
	button.muted {
		opacity: 0.3;
	}
	button.muted:hover {
		cursor: not-allowed;
	}
	.icon-tooltip-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#loading {
		display: inline-block;
		width: 10px;
		height: 10px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		animation: spin 1s ease-in-out infinite;
		-webkit-animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			-webkit-transform: rotate(360deg);
		}
	}
	@-webkit-keyframes spin {
		to {
			-webkit-transform: rotate(360deg);
		}
	}
	button.disabled {
		cursor: not-allowed;
	}
	button.disabled svg {
		fill: var(--color-primary-muted);
	}
</style>
