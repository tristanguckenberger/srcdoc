<script>
	/**
	 * SearchBar.svelte
	 * @description A flexible search bar component
	 *
	 * @param {string} placeholder
	 * @param {string} value
	 * @param {string} id
	 * @param {string} name
	 * @param {string} type
	 * @param {string} label
	 * @param {string} icon
	 * @param {string} iconColor
	 * @param {string} iconSize
	 * @param {string} iconPosition
	 * @param {string} iconClass
	 * @param {string} iconStyle
	 * @param {string} inputClass
	 * @param {string} inputStyle
	 * @param {string} labelClass
	 * @param {string} labelStyle
	 * @param {string} containerClass
	 * @param {string} containerStyle
	 * @param {string} formClass
	 * @param {string} formStyle
	 * @param {string} buttonClass
	 * @param {string} buttonStyle
	 *
	 * @slot icon - optional
	 * @slot label - optional
	 * @slot input - optional
	 * @slot button - optional
	 *
	 *
	 */

	export let placeholder = 'Search...';
	export let value = '';
	export let id = '';
	export let name = '';
	export let type = 'text';
	export let label = '';
	export let icon = '';
	export let iconColor = '';
	export let iconSize = '';
	export let iconPosition = '';
	export let iconClass = '';
	export let iconStyle = '';
	export let inputClass = '';
	export let inputStyle = '';
	export let labelClass = '';
	export let labelStyle = '';
	export let containerClass = '';
	export let containerStyle = '';
	export let formClass = '';
	export let formStyle = '';
	export let buttonClass = '';
	export let buttonStyle = '';

	let inputId = id || name;

	let inputStyleString = '';
	let labelStyleString = '';
	let iconStyleString = '';
	let containerStyleString = '';
	let formStyleString = '';
	let buttonStyleString = '';
</script>

<div class={`search-bar-container ${containerClass}`} style={containerStyleString}>
	<form class={`search-bar-form ${formClass}`} style={formStyleString}>
		{#if label}
			<label for={inputId} class={`search-bar-label ${labelClass}`} style={labelStyleString}>
				<slot name="label">
					{label}
				</slot>
			</label>
		{/if}
		<div class={`search-bar-input-container ${iconPosition}`} style={inputStyleString}>
			<slot name="icon">
				{#if icon}
					<div class={`search-bar-icon ${iconClass}`} style={iconStyleString}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							fill="#000000"
							viewBox="0 0 256 256"
							><path
								d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
							/></svg
						>
					</div>
				{/if}
			</slot>
			<slot name="input">
				<input
					{type}
					id={inputId}
					{name}
					{placeholder}
					{value}
					class={`search-bar-input ${inputClass}`}
					style={inputStyle}
				/>
			</slot>
		</div>
	</form>
</div>

<style>
	.search-bar-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.search-bar-form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.search-bar-label {
		margin-bottom: 0.5em;
	}
	.search-bar-input-container {
		display: flex;
		align-items: center;
		width: 100%;
	}
	.search-bar-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 0.5em;
	}
	.search-bar-input {
		flex: 1;
		padding: 10px;
		height: 1rem;
		border-radius: 0.25em;
		border: none;
		background-color: #171819;
		color: var(--color-primary);
		font-family: 'Inter', sans-serif;
		font-size: 1.125rem;
		border-radius: 6px;
		transition: all 0.5s cubic-bezier(0.87, -0.41, 0.19, 1.44);
	}
	.search-bar-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5em;
		border-radius: 0.25em;
		background-color: #007bff;
		color: white;
		border: none;
		cursor: pointer;
	}
	.search-bar-button:hover {
		background-color: #0056b3;
	}
	.search-bar-input-container.left {
		justify-content: flex-start;
	}

	.search-bar-input-container.right {
		justify-content: flex-end;
	}
</style>
