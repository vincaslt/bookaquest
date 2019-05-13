<script>
	import SubscriptionSection from './SubscriptionSection.svelte';
	import HeroSection from './HeroSection.svelte';
</script>

<style>
	.content {
		padding: 50px;
	}

	.brand {
		display: flex;
		align-items: center;
		color: #444C59;
	}

	.brand h1 {
		font-size: 24px;
		margin-left: 15px;
	}

	footer {
		text-align: center;
		color: #7D909D;
		font-size: 18px;
		padding: 12px;
	}

	@media(max-width: 480px) {
    .content {
			padding: 15px;
		}
  }
</style>

<div class="content">
	<div class="brand">
		<img alt="Logo" src="/form2book-logo.svg" height="50" width="50" />
		<h1>Form2Book</h1>
	</div>
	<HeroSection />
</div>
<SubscriptionSection />
<footer>© 2019 Form2Book, All Rights Reserved.</footer>
