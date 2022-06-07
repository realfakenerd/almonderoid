<script>
	import '../app.css';
	import '@fontsource/press-start-2p';
</script>

<header>
	<nav class="navbar justify-center">
		<div>
			<a class="btn btn-link" href="/">game</a>
			<a class="btn btn-link" href="/config">settings</a>
		</div>
	</nav>
</header>

<main class="grid place-items-center">
	<div class="px-10">
		<slot />
	</div>
</main>
