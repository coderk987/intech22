<script>
	import { db, auth } from '../firebase.js';
	import {
		collection,
		onSnapshot,
		getDoc,
		doc,
		orderBy,
		query,
		deleteDoc
	} from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import Header from '../lib/header.svelte';
	import NoticeModal from '../lib/NoticeModal.svelte';
	import { slide, scale } from 'svelte/transition';
	import { user } from '../stores';
	import Loader from '../lib/Loader.svelte';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	let isAdmin;

	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	let du = 0;
	onMount(() => {
		if ($user === '') {
			goto('/login');
		}
		const docRef = getDoc(doc(db, 'users', $user.email)).then((doc) => {
			isAdmin = doc.data().isAdmin;
		});
		du = 500;
	});

	let q = query(collection(db, 'notices'), orderBy('date'));
	let list = [];
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		let fb = [];
		querySnapshot.forEach((doc) => {
			let item = { ...doc.data(), id: doc.id, show: false };
			fb = [item, ...fb];
		});
		list = fb;
	});

	let addModal;

	const deleteNotice = async (id) => {
		await deleteDoc(doc(db, 'notices', id));
	};
</script>

{#if $user}
	<div class="page">
		{#if addModal}
			<NoticeModal
				on:click={() => {
					addModal = false;
				}}
			/>
		{/if}
		<Header />
		<div class="items" in:slide>
			{#each list as item, id (item.id)}
				<div class="item" out:scale|local animate:flip={{ duration: du }}>
					<h2 class="title">
						{item.title}
					</h2>
					<h4 class="content" class:invisible={!list[id].show}>
						{item.content}
					</h4>
					<h3
						on:click={async () => {
							du = 0;
							await delay(1);
							list[id].show = !list[id].show;
							await delay(1);
							du = 500;
						}}
						style="margin:0.2em 0.5em;"
					>
						{#if !list[id].show}
							Show Content
						{:else}
							Hide content
						{/if}
					</h3>
					<div class="down" class:end={!isAdmin}>
						{#if isAdmin}
							<i
								class="bi bi-trash3"
								on:click={() => {
									deleteNotice(item.id);
								}}
							/>
						{/if}
						<h3 class="time">{item.date.toDate().toLocaleString()}</h3>
					</div>
				</div>
			{/each}
		</div>
		{#if isAdmin}
			<div class="add">
				<i class="bi bi-pencil-square" />
				<h3
					on:click={() => {
						addModal = true;
					}}
				>
					Add Notice
				</h3>
			</div>
		{/if}
	</div>
{:else}
	<Loader />
{/if}

<style>
	.invisible {
		display: none;
	}
	* {
		font-family: 'Ubuntu', sans-serif;
		color: whitesmoke;
	}
	h2,
	h3,
	h4 {
		padding: 0;
		margin: 0;
	}
	.page {
		min-height: 100vh;
		background-color: #2a2a2a;
	}
	.items {
		margin: 1em 0;
		padding: 0 2vw;
	}
	.item {
		background-color: rgb(66, 66, 66);
		padding: 0.5em 1em;
		display: flex;
		flex-direction: column;
		border-radius: 10px;
		margin: 1em 0;
	}
	.title {
		margin: 0.5em;
		color: #00cc99;
	}
	.content {
		margin: 1em;
		font-weight: normal;
		color: #d5fbf1;
		word-spacing: 0.5mm;
	}
	.time {
		align-self: flex-end;
		margin-bottom: 1em;
		margin-right: 1em;
		color: rgb(191, 191, 191);
	}
	.items {
		height: 70vh;
		overflow-y: auto;
		margin-bottom: 10px;
	}
	.add {
		display: flex;
		align-items: center;
		margin: 0 1.5em;
		width: max-content;
		background-color: #212121;
		border-bottom-left-radius: 20px;
		border-top-left-radius: 20px;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		cursor: pointer;
	}
	.add > i {
		background-color: #00cc99;
		padding: 0.5em;
		border-radius: 50%;
	}
	.add > h3 {
		background-color: #212121;
		padding: 0.5em;
		border-radius: 5px;
	}
	.down {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.down > h3 {
		margin: 0;
		align-self: center;
	}
	.down > i {
		background-color: rgb(243, 52, 90);
		border: 2px solid rgb(181, 35, 64);
		width: max-content;
		padding: 0.3em 0.5em;
		margin: 0;
		align-self: center;
		font-size: 1.2em;
		margin: 0 0.5em;
		border-radius: 5px;
		color: whitesmoke;
	}
	.end {
		justify-content: flex-end;
	}
</style>
