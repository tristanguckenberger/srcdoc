<script>
	import { fly } from 'svelte/transition';
	import { sideBarState } from '$lib/stores/layoutStore';

	/**
	 * Make bars "breath" in and out,
	 *
	 * Make bars move across the page, cascade the bars so they are not all moving at the same time
	 * so they are staggered
	 */
</script>

<div
	class="loader-container"
	class:showSideBar={$sideBarState}
	transition:fly={{
		y: 100,
		duration: 100
	}}
>
	<span class="loader top" />
	<span class="loader bottom" />
</div>

<style>
	.loader-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		display: flex;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #1c1d1f9e;
	}
	.loader {
		position: relative;
		width: 75px;
		height: 100px;
		z-index: 1000;
		background-repeat: no-repeat;
		background-image: linear-gradient(#d82121 50px, transparent 0),
			linear-gradient(#ed6237 50px, transparent 0), linear-gradient(#f2b705 50px, transparent 0),
			linear-gradient(#043c3f 50px, transparent 0), linear-gradient(#216f73 50px, transparent 0);
		background-size: 8px 100%;
		background-position: 0px 50px, 15px 58px, 30px 66px, 45px 78px, 60px 90px;
		animation: pillerPushUp 3s cubic-bezier(0, 0.41, 0.3, 0.33) infinite;
		animation-direction: reverse;
	}

	.loader.top {
		transform: rotate3d(1, 0, 0, 180deg);
	}
	.loader:after {
		content: '';
		position: absolute;
		bottom: 30px;
		left: -1px;
		width: 10px;
		height: 10px;
		z-index: 1000;
		background-color: #d82121;
		border-radius: 50%;
		animation: ballStepUp 3s cubic-bezier(0, 0.41, 0.3, 0.33) infinite;
		animation-direction: reverse;
	}

	@media (min-width: 498px) {
		.loader-container.showSideBar .loader {
			left: 115px;
		}
	}

	@keyframes pillerPushUp {
		0%,
		40%,
		100% {
			background-position: 0px 90px, 15px 78px, 30px 66px, 45px 58px, 60px 50px;
		}
		50%,
		90% {
			background-position: 0px 50px, 15px 58px, 30px 66px, 45px 78px, 60px 90px;
		}
	}

	@keyframes ballStepUp {
		0% {
			transform: translate(0, 0);
			background-color: #d82121;
		}
		7% {
			transform: translate(7px, -10px);
			background-color: #ed6237;
		}
		10% {
			transform: translate(15px, -10px);
			background-color: #ed6237;
		}
		17% {
			transform: translate(22px, -22px);
			background-color: #f2b705;
		}
		20% {
			transform: translate(30px, -22px);
			background-color: #f2b705;
		}
		27% {
			transform: translate(37px, -30px);
			background-color: #043c3f;
		}
		30% {
			transform: translate(45px, -30px);
			background-color: #043c3f;
		}
		37% {
			transform: translate(52px, -38px);
			background-color: #216f73;
		}
		40% {
			transform: translate(60px, -38px);
			background-color: #216f73;
		}
		47% {
			background-color: #216f73;
		}
		50% {
			transform: translate(60px, 2px);
			background-color: #216f73;
		}
		57% {
			transform: translate(52px, -10px);
			background-color: #043c3f;
		}
		60% {
			transform: translate(45px, -10px);
			background-color: #043c3f;
		}
		67% {
			transform: translate(37px, -22px);
			background-color: #f2b705;
		}
		70% {
			transform: translate(30px, -22px);
			background-color: #f2b705;
		}
		77% {
			transform: translate(22px, -30px);
			background-color: #ed6237;
		}
		80% {
			transform: translate(15px, -30px);
			background-color: #ed6237;
		}
		87% {
			transform: translate(7px, -38px);
			background-color: #ed6237;
		}
		90% {
			transform: translate(0, -38px);
			background-color: #d82143;
		}
		100% {
			transform: translate(0, 2px);
			background-color: #d82143;
		}
	}
</style>
