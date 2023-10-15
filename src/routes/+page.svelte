<script lang="ts">
	import { game } from '$lib/setup/game';
	import { highScore, isGameOver, score, lives, keyStore, isGamePaused, isGameStarted } from '$lib/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	const keys = get(keyStore);
	let start: () => void;
	let pause: () => void;
	let reset: () => void;
	let continueGame: () => void;
	
	onMount(() => {
		const gameSettings = game();

		start = gameSettings.start;
		pause = gameSettings.pause;
		reset = gameSettings.reset;
		continueGame = gameSettings.continueGame;
	})

	
	function handlePause() {
		if(get(isGamePaused)) continueGame();
		else pause();
	}
</script>

<section class="flex flex-col w-full gap-y-2 p-2">
	<div class="flex flex-col items-center">
		<h1>Controls</h1>
	</div>
	<div class="flex flex-col gap-y-2">
		<h3><kbd class="kbd">{keys.shootKey}</kbd> to shoot</h3>
		<h3><kbd class="kbd">{keys.forwardKey}</kbd> to go forward</h3>
		<h3><kbd class="kbd">{keys.leftKey}</kbd> to rotate left</h3>
		<h3><kbd class="kbd">{keys.rightKey}</kbd> to rotate right</h3>
		<p class="text-sm">
			you can also change<br />
			the settings of the game
			<a class="link decoration-wavy hover:text-primary" href="/config">here</a>
		</p>
	</div>
</section>

<div>
	<div class="my-2 inline-flex w-full justify-between text-lg">
		<h2>SCORE: {$score}</h2>
		<h2>LIVES: {$lives}</h2>
		<h2>HIGHSCORE: {$highScore}</h2>
	</div>

	<div class="relative">
		{#if $isGameOver}
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 transform">
				<span class="text-3xl text-primary">GAME OVER</span>
			</div>
		{/if}
		{#if $isGamePaused}
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 transform">
				<span class="text-3xl text-secondary">PAUSED</span>
			</div>
		{/if}
		<!-- {#if !$isGameStarted}
		<div
			class="absolute top-1/2 transform left-1/2 
			-translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
		>
			<h2 class="text-xl">Play the Game</h2>
			<button on:click={() => setupGame()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="transition-color h-20 w-20 duration-300 hover:text-primary"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
		{/if} -->
		<canvas
			class="rounded-box border-2 border-primary bg-neutral shadow-md shadow-red-600/50"
			height="460"
			width="640"
			id="game"
		/>
	</div>
</div>
<div class="flex flex-col gap-y-2 w-full items-start justify-between">
	<button class="btn border-2 border-primary" disabled={$isGameStarted} on:click={start}>START</button>
	<button class="btn border-2 border-primary" disabled={!$isGameStarted} on:click={handlePause}>{$isGamePaused ? "CONTINUE" : "PAUSE"}</button>
	<button class="btn border-2 border-primary" disabled={!$isGameStarted}  on:click={reset}>RESET</button>
	<!-- {#if $lives > 0}
		<ul out:fade={{ duration: 500 }} class="rounded-box inline-flex bg-neutral py-3 px-5">
			{#each Array($lives) as _, i (i)}
				<li>
					<Lives />
				</li>
			{/each}
		</ul>
	{/if} -->
</div>
