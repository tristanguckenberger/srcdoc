<script>
	// @ts-nocheck
	import { platformSession } from '$lib/stores/platformSession/index.js';
	import Notice from '$lib/ui/Notice/index.svelte';
	import Button from '$lib/ui/Button/index.svelte';
	import { enhance } from '$app/forms';

	let updating = false;
</script>

<Notice title="Account Not Active" message="Please verify your email to access all features.">
	<div slot="action" class="action-container">
		<form
			method="POST"
			action={`/?/resendVerificationEmail`}
			enctype="multipart/form-data"
			use:enhance={async ({ formData }) => {
				formData.set('userId', $platformSession?.currentUser?.id);

				updating = true;

				return async ({ update, result, action }) => {
					if (result?.status === 200) {
						await update();

						setTimeout(() => {
							updating = false;
						}, 500);
					}
				};
			}}
		>
			<Button bind:creating={updating} label="Resend Email" isRounded />
		</form>

		<Button label="Verify Now" link="/users/{$platformSession?.currentUser?.id}/verify" />
	</div>
</Notice>

<style>
	.action-container {
		display: flex;
		gap: 10px;
	}
	.action-container :global(button),
	.action-container :global(a) {
		background: -webkit-linear-gradient(
			281deg,
			var(--home-gradient-color-1) 0%,
			var(--home-gradient-color-2) 100%
		);
		transition: all 0.2s linear(0.07 -1.12%, 1 100%);
		border-radius: 6px !important;
	}
</style>
