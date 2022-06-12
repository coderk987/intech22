<script context="module">
	export function load({ error, status }) {
		return {
			props: { error, status }
		};
	}
</script>

<script>
	export let status;
	export let error;
</script>

<div class="page">
	<h1>
		Oops..
		{status}
	</h1>
	<h2>{error.message}</h2>
	<img src="pepeBig.png" class="big" alt="sad pepe" />
	<img src="pepeSmall.png" class="small" alt="sad pepe" />
</div>

<style>
	* {
		font-family: 'Ubuntu', sans-serif;
		color: whitesmoke;
	}
	.page {
		width: 100vw;
		min-height: 100vh;
		background-color: #2a2a2a;
		padding: 2em 4em;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	h1 {
		text-align: center;
		font-size: 5em;
		margin: 0;
		color: #00cc99;
	}
	h2 {
		text-align: center;
		font-size: 3em;
		color: #8de2cd;
		margin-bottom: 0.5em;
	}
	img {
		text-align: center;
		display: block;
		max-width: 95vw;
	}
	.small {
		display: none;
	}
	@media screen and (max-width: 810px) {
		.page {
			padding: 2em;
		}
	}
	@media screen and (max-width: 610px) {
		.small {
			display: block;
			height: 450px;
		}
		.big {
			display: none;
		}
		h1 {
			font-size: 4.5em;
		}
		h2 {
			font-size: 2.5em;
			margin-bottom: 0;
		}
		.page {
			padding-bottom: 0;
		}
	}
	@media screen and (max-width: 430px) {
		.small {
			height: 350px;
		}
	}
</style>
