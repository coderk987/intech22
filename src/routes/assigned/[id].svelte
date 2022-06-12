<script context="module">
	export async function load({ url }) {
		const temp = url.pathname;
		console.log(temp);
		return {
			props: {
				id: temp.substring(9, temp.length)
			}
		};
	}
</script>

<script>
	import { auth, db, storage } from '../../firebase';
	import { doc, onSnapshot, updateDoc, addDoc, collection, getDoc } from 'firebase/firestore';
	import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
	import Submissions from '../../lib/Submissions.svelte';
	import Header from '../../lib/header.svelte';
	import { user } from '../../stores';
	import Loader from '$lib/Loader.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let id;

	let isAdmin = false;

	let cur = [];
	const unsub = onSnapshot(doc(db, 'assignments', id), (doc) => {
		cur = doc.data();
	});

	let file;
	let prog;
	let url = '';
	let userSubmit = null;

	onMount(() => {
		console.log($user);
		if ($user === '') {
			goto('/login');
		}
		const docRef = getDoc(doc(db, 'users', $user.email)).then((doc) => {
			isAdmin = doc.data().isAdmin;
		});
		const checkSub = onSnapshot(collection(db, `assignments${id}/submits`), (dt) => {
			dt.forEach((doc) => {
				if (doc.data().by === $user.displayName.split(' ')[0]) {
					userSubmit = { ...doc.data(), id: doc.id };
				}
			});
		});
	});

	const handleFile = () => {
		if (file && file[0]) {
			const storageRef = ref(storage, `${id}/${file[0].name}`);
			console.log(file);
			const uploadTask = uploadBytesResumable(storageRef, file[0]);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + prog + '% done');
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				},
				(error) => {
					console.log(error);
				},
				() => {
					console.log('im run');
					getDownloadURL(storageRef).then((downloadURL) => {
						url = downloadURL;
					});
				}
			);
		}
	};

	const removeFile = () => {
		const storageRef = ref(storage, `${id}/${file[0].name}`);
		deleteObject(storageRef).then(() => {
			console.log('Removed File');
		});
		file = [];
	};

	const handleSubmit = async () => {
		console.log('submitted');
		const docRef = await addDoc(collection(db, `assignments${id}/submits`), {
			by: $user.displayName.split(' ')[0],
			file: url,
			done: false
		});
	};
</script>

{#if $user}
	<div class="ass">
		<Header />
		{#if cur.title === undefined}
			<p>&nbsp;</p>
		{:else}
			<div class="content">
				<h1 class="title">{cur.title}</h1>
				<h3 class="due">Due: {cur.deadline.toDate().toLocaleString()}</h3>
				<h2 class="descHead">Description:</h2>
				<h4 class="desc">
					{#if cur.description}
						{cur.description}
					{:else}
						<i>None</i>
					{/if}
				</h4>
				<h2 class="refer">Reference:</h2>
				{#if cur.fileName === undefined || cur.fileName === ''}
					<i>None</i>
				{:else}
					<h3 class="file">
						<i class="bi bi-file-earmark-fill" style="margin-right: 0.2em;" />
						<a href={cur.file} target="__blank"
							>{cur.fileName} <i class="bi bi-download" style="margin-left: 0.2em;" /></a
						>
					</h3>
				{/if}
				{#if !isAdmin}
					{#if userSubmit === null}
						<div class="top">
							<h2 class="my">My Work</h2>
							<button on:click={handleSubmit}>Submit Assignment</button>
						</div>
						<div class="fileIn">
							<label for="attachFile">
								<h3 class="attachLabel"><i class="bi bi-paperclip" /> Attach File</h3>
								<input type="file" bind:files={file} id="attachFile" on:change={handleFile} />
							</label>

							{#if file && file[0]}
								<div class="inputFile">
									<p style="margin-right:1em;">{file[0].name}</p>
									{#if prog == 100}
										<p on:click={removeFile}><i class="bi bi-x-circle-fill" /></p>
									{:else}
										<p>{Math.round(prog)}%</p>
									{/if}
								</div>
							{/if}
						</div>
						<div class="down">
							<button on:click={handleSubmit}>Submit Assignment</button>
						</div>
					{:else}
						<h2 class="my" style="margin-top: 2em;">My Work</h2>
						<h3 class="file">
							<i class="bi bi-file-earmark-fill" style="margin-right: 0.2em;" />
							<a href={userSubmit.file} target="__blank"
								>Submitted File <i class="bi bi-download" style="margin-left: 0.2em;" /></a
							>
						</h3>
					{/if}
				{/if}
				{#if isAdmin}
					<Submissions {id} />
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<Loader />
{/if}

<style>
	* {
		font-family: 'Ubuntu', sans-serif;
		color: rgb(230, 228, 228);
	}
	h1,
	h2,
	h3,
	h4 {
		margin: 0;
		padding: 0;
	}
	.ass {
		width: 100%;
		min-height: 100vh;
		background-color: #2a2a2a;
		margin: 0;
		padding: 0;
	}
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 1.5em 1.5em;
		box-sizing: border-box;
	}
	.title {
		margin-bottom: 0.5em;
		color: #00cc99;
	}
	.due {
		color: crimson;
		margin-bottom: 1em;
	}
	.descHead {
		color: #00cc99;
		margin-bottom: 0.5em;
	}
	.desc {
		margin-bottom: 1em;
		font-weight: normal;
	}
	.refer {
		color: #00cc99;
		margin-bottom: 0.5em;
	}
	.file {
		display: flex;
		background-color: #04765a;
		padding: 0.5em;
		margin: 0;
		width: max-content;
		border-radius: 5px;
		margin-bottom: 1em;
	}
	.file > a {
		text-decoration: none;
	}

	.my {
		color: #00cc99;
		margin-bottom: 0.5em;
	}

	.fileIn {
		display: flex;
		flex-direction: column;
	}
	.top > button {
		max-width: max-content;
		background: #00a47b;
		border: none;
		padding: 0.3em 0.5em;
		font-size: larger;
		font-weight: bolder;
		color: #b8fae9;
		border-radius: 10px;
		align-self: flex-start;
		margin-right: 1em;
	}
	input[type='file'] {
		display: none;
	}
	.inputFile {
		display: flex;
		background-color: #04765a;
		padding: 0.5em;
		margin: 1em 0;
		width: max-content;
		border-radius: 5px;
	}
	.inputFile > p {
		margin: 0;
	}
	.top {
		margin-top: 2em;
		display: flex;
		justify-content: space-between;
	}
	.attachLabel {
		margin: 1em 0;
		color: #b8fae9;
		font-weight: bold;
		font-size: x-large;
	}
	.down > button {
		display: none;
	}
	@media screen and (max-width: 470px) {
		.top > button {
			display: none;
		}
		.down {
			display: flex;
			justify-content: center;
		}
		.down > button {
			display: block;
			max-width: max-content;
			background: #00a47b;
			border: none;
			padding: 0.3em 0.5em;
			font-size: larger;
			font-weight: bolder;
			color: #b8fae9;
			border-radius: 10px;
		}
	}
</style>
