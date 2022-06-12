<script>
	import { auth } from '../firebase';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '../stores.js';
	import { browser } from '$app/env';

	onMount(() => {
		console.log($user);

		if ($user === '') {
			goto('/login');
		} else {
			goto('/home');
		}
	});
</script>

<div class="page">
	<div
		class="loader"
		on:click={() => {
			console.log($user);
		}}
	/>
</div>

<style>
	.page {
		background-color: rgb(42, 42, 42);
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}
	.loader {
		width: 200px;
		height: 200px;
		border: 16px solid rgb(52, 52, 52);
		border-top: 16px solid #00cc99;
		border-bottom: 16px solid #00cc99;
		border-radius: 50%;
		animation: load 2s linear infinite;
	}

	@keyframes load {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
