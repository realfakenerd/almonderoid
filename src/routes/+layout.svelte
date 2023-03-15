<script>
	import '../app.css';
	import '@fontsource/press-start-2p';
	import { fly } from 'svelte/transition';
	import { expoIn, expoOut } from 'svelte/easing';
	export let data;
</script>

<header>
	<nav class="navbar justify-center">
		<div>
			<a class="btn btn-link" href="/">game</a>
			<a class="btn btn-link" href="/config">settings</a>
		</div>
	</nav>
</header>

{#key data.currentRoute}
	<main
		class="flex items-center gap-x-2"
		in:fly={{ y: -5, duration: 500, delay: 200, easing: expoOut }}
		out:fly={{ y: 5, duration: 200, easing: expoIn }}
	>
		<slot />
	</main>
{/key}
