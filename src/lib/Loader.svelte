<div class="page">
	<div class="loader" />
</div>

<style>
	.page {
		background-color: rgb(42, 42, 42);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
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
