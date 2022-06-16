<script>
	import { firstTime } from '../stores';
	import { fade } from 'svelte/transition';
</script>

<div class="bg" transition:fade>
	<div class="body">
		<img src="book1.png" alt="" srcset="" />
		<h1>Welcome To HCET Portal</h1>
		<br />
		<h2>The portal Helps Teacher and students to efficently manage Assignments and Notices.</h2>
		<button
			style="margin-bottom: 0.5em;"
			on:click={() => {
				$firstTime = false;
			}}
		>
			<a href="https://github.com/coderk987/intech22/blob/main/README.md" target="_blank">
				Read the Guide
			</a>
		</button>
		<button
			on:click={() => {
				$firstTime = false;
			}}
		>
			No thanks!</button
		>
	</div>
</div>

<style>
	* {
		font-family: 'Ubuntu', sans-serif;
		color: rgb(239, 235, 235);
	}
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
	img {
		width: 300px;
	}
	a {
		text-decoration: none;
	}
	.body {
		width: 450px;
		max-width: 90vw;
		box-sizing: border-box;
		padding: 1.5em;
		background-image: linear-gradient(
			to right top,
			#7886a1,
			#6c8fac,
			#5b98b3,
			#48a1b5,
			#3baab0,
			#33b0ad,
			#31b5a7,
			#38baa0,
			#2ebf9f,
			#22c39e,
			#14c89c,
			#00cc99
		);
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
	}
	h2,
	h1 {
		text-align: center;
	}
	button {
		align-self: center;
		background: linear-gradient(to right, #60b2d5, #40ce89, #2ccd7f, #68d6a1);
		padding: 0.5em;
		font-size: 1.2em;
		border: none;
		font-weight: bolder;
		color: #ffffff;
		min-width: max-content;
		border-radius: 5px;
		box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
		background-size: 300% 100%;
		transition: all 0.4s ease;
	}
	button:hover {
		background-position: 100% 0;
		transition: all 0.4s ease;
	}
	@media screen and (max-width: 481px) {
		.body {
			padding: 0.7em 0.5em;
		}
		h1,
		h2,
		img {
			transform: scale(0.9);
		}
		h1,
		h2 {
			margin: 0.4em;
		}
	}
	@media screen and (max-width: 400px) {
		img {
			width: 250px;
		}
	}
</style>
