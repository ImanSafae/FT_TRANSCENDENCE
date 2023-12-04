<div class="row-center instructions">
	<div class="column-center">
		<div class="keycap column-center">▲</div>
		<span class="instructions-txt">Up</span>
	</div>
	<div class="column-center">
		<div class="keycap column-center">▼</div>
		<span class="instructions-txt">Down</span>
	</div>
</div>

<style>
	.instructions {
		position: absolute;
		top: 80%;
		left: 50%;

		transform: translate(-50%, -50%);

		gap: 1rem;
	}

	.instructions > div {
		width: 40px;
		height: 100px;

		gap: 0.4rem;
	}

	.instructions-txt {
		color: rgba(240, 240, 240, 0.5);
		font-size: 15px;
	}

	.keycap {
		width: 40px;
		height: 40px;

		border-radius: 0.6rem;
		border: solid rgba(240, 240, 240, 0.4) 3px;
		color: rgba(240, 240, 240, 0.4);

		font-weight: 700;
		font-size: 25px;
	}
</style>
