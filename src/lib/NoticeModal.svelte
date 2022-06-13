<script>
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { db } from '../firebase';
	import { fade } from 'svelte/transition';

	let title;
	let con;

	$: console.log(title, serverTimestamp());
	const AddNotice = async () => {
		const docRef = await addDoc(collection(db, 'notices'), {
			title: title,
			content: con,
			date: new Date()
		});
	};
</script>

<div class="bg" on:click|self>
	<div class="inputs" transition:fade={{ duration: 400 }}>
		<div class="top">
			<h3>Add Notice:</h3>
			<i class="bi bi-x" on:click|self />
		</div>
		<p style="margin-top: 0;">Title:</p>
		<input type="text" bind:value={title} />
		<p>Content:</p>
		<textarea bind:value={con} cols="30" rows="10" style="resize: vertical" />
		<button on:click={AddNotice}>Add Notice</button>
	</div>
</div>

<style>
	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: rgba(0, 0, 0, 0.2);
		z-index: 2;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 5em;
	}

	.inputs {
		display: flex;
		flex-direction: column;
		padding: 1em;
		background-color: #151515;
		border: 1px solid rgb(210, 210, 210);
		border-radius: 10px;
		width: 500px;
		max-width: 95vw;
		box-sizing: border-box;
	}
	input,
	textarea {
		padding: 0.5em;
	}
	.inputs > * {
		margin: 0.5em 0;
	}
	.inputs > p {
		font-weight: bolder;
		color: #00cc99;
		font-size: larger;
	}
	button {
		width: 40%;
		align-self: center;
		background: #00a47b;
		border: none;
		padding: 0.3em 0;
		font-size: larger;
		font-weight: bolder;
		color: #b8fae9;
		border-radius: 5px;
	}
	i {
		background-color: crimson;
		border: 1px solid currentColor;
		width: max-content;
		padding: 0 0.1em;
		align-self: flex-end;
		margin: 0;
		font-size: 1.5em;
	}
	h3 {
		margin: 0;
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
