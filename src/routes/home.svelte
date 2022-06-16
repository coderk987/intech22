<script>
	import { db } from '../firebase';
	import { getDoc, doc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { user, firstTime } from '../stores.js';
	import { goto } from '$app/navigation';

	import Header from '../lib/header.svelte';
	import Assigned from '../lib/Assigned.svelte';
	import Completed from '../lib/Completed.svelte';
	import Create from '../lib/Create.svelte';
	import Loader from '../lib/Loader.svelte';
	import First from '../lib/First.svelte';

	let isAdmin;

	onMount(() => {
		if ($user === '') {
			goto('/login');
		}
		const docRef = getDoc(doc(db, 'users', $user.email)).then((doc) => {
			isAdmin = doc.data().isAdmin;
		});
	});

	let tab = 1;
</script>

{#if $user}
	{#if $firstTime}
		<First />
	{/if}
	<div class="home">
		<Header />

		<div class="tabs">
			<h2
				on:click={() => {
					tab = 1;
				}}
				style="margin-right: 2em"
				class:active={tab == 1}
			>
				Assigned
			</h2>
			{#if isAdmin}
				<h2
					on:click={() => {
						tab = 2;
					}}
					class:active={tab == 2}
				>
					Create
				</h2>
			{:else}
				<h2
					on:click={() => {
						tab = 2;
					}}
					class:active={tab == 2}
				>
					Completed
				</h2>
			{/if}
		</div>

		{#if tab == 1}
			<Assigned lmaoAdmin={isAdmin} />
		{:else if tab == 2}
			{#if isAdmin}
				<Create />
			{:else}
				<Completed />
			{/if}
		{/if}
	</div>
{:else}
	<Loader />
{/if}

<style>
	h2 {
		margin-bottom: 0.2em;
	}
	* {
		font-family: 'Ubuntu', sans-serif;
		color: whitesmoke;
	}
	.home {
		height: 100vh;
		background-color: #2a2a2a;
		overflow-x: hidden;
	}

	.tabs {
		margin: 1em 2em;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
	}
	.tabs > h2 {
		font-size: xx-large;
		cursor: default;
	}
	.active {
		color: #00cc99;
		transform: scale(1.1);
		padding-bottom: 4px;
		border-bottom: 3px solid #319177;
		transition: 0.3s;
	}
	@media screen and (max-width: 410px) {
		.tabs > h2 {
			font-size: x-large;
		}
	}
</style>
