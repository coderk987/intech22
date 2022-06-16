<script>
	import { auth } from '../firebase';
	import Search from './search.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { signOut } from 'firebase/auth';
	import { user } from '../stores.js';
	import { browser } from '$app/env';

	let modal = false;
	let tab = 3;
	let tempUser = browser && JSON.parse(localStorage.getItem('curUser'));
	onMount(() => {
		let path = $page.url.pathname;
		if (path == '/home') tab = 2;
		else if (path == '/quiz') tab = 3;
		else if (path == '/notices') tab = 1;
		else if (path.substr(0, 9) == '/assigned') tab = 2;
	});

	const logOut = () => {
		signOut(auth);
		$user = '';
		goto('/login');
	};
</script>

{#if modal}
	<Search
		on:click={() => {
			modal = false;
		}}
	/>
{/if}

{#if $user}
	<header>
		<h3 class="welcome">
			Welcome {tempUser.displayName.split(' ')[0]}
			<span class="gradeInfo" style="color: #00cc99;"
				>&nbsp;Of Class {tempUser.displayName.split(' ')[1]}</span
			>
		</h3>
		<div class="icons">
			<i
				class="bi bi-search"
				style="margin-right: 0.7em;"
				on:click={() => {
					modal = true;
				}}
			/>
			<i class="bi bi-box-arrow-in-right" on:click={logOut} />
		</div>
	</header>
	<div class="nav">
		<i
			class="bi bi-megaphone-fill left"
			on:click={() => {
				goto('/notices');
				tab = 1;
			}}
			class:active={tab == 1}
		/>
		<i
			class="bi bi-house-door-fill"
			on:click={() => {
				goto('/home');
				tab = 2;
			}}
			class:active={tab == 2}
		/>
		<i
			class="bi bi-lightbulb-fill right"
			on:click={() => {
				goto('/quiz');
				tab = 3;
			}}
			class:active={tab == 3}
		/>
	</div>
{/if}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;700&display=swap');
	* {
		font-family: 'Ubuntu', sans-serif;
		color: whitesmoke;
	}
	header {
		width: 100vw;
		background-color: #222423;
		color: whitesmoke;
		margin: 0;
		padding: 1em 1.5em;
		display: flex;
		justify-content: space-between;
		position: relative;
		box-sizing: border-box;
	}
	h3 {
		margin: 0;
		padding: 0;
		font-weight: bolder;
		font-size: x-large;
		color: #00cc99;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	.welcome {
		display: flex;
	}
	.icons {
		margin-left: auto;
	}
	.icons > i {
		font-size: x-large;
		color: #00cc99;
		cursor: pointer;
	}
	.icons > i:hover {
		color: #8de2cd;
		font-weight: bolder;
	}
	.nav {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	.nav > i {
		font-size: x-large;
		color: whitesmoke;
		padding: 0.5em 0.7em;
		border: 3px solid #149e7c;
		margin: 0 0.5em;
		border-radius: 5px;
		border-top: none;
		border-top-left-radius: 0%;
		border-top-right-radius: 0%;
		background-color: rgb(27, 27, 27);
		cursor: pointer;
		position: relative;
	}
	.nav > .active {
		background-color: #00cc99;
		color: rgb(27, 27, 27);
		transition: 0.3s ease-in-out;
		transform: scale(1.2);
		margin-top: 5px;
	}

	@media screen and (max-width: 680px) {
		h3 {
			left: 0%;
			transform: translateX(0%);
			margin-left: 0.5em;
		}
	}

	@media screen and (max-width: 500px) {
		.gradeInfo {
			display: none;
		}
	}
</style>
