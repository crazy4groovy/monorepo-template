<script lang="ts">
  import { add, capitalize, formatCurrency } from 'package1'

  const appName = 'Svelte App'
  const apiUrl = 'http://localhost:3000'
  const env = 'development'
</script>

<h1>{appName}</h1>
<p>Welcome to the Svelte app in the monorepo!</p>
<div
  style="
		margin-top: 1rem;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 4px;
	"
>
  <p style="margin-top: 0; font-weight: bold">Environment Variables:</p>
  <ul style="margin-bottom: 1rem">
    <li>Environment: {env}</li>
    <li>API URL: {apiUrl}</li>
  </ul>
  <p style="font-weight: bold">Using package1 utilities:</p>
  <ul>
    <li>Capitalize: {capitalize('hello world')}</li>
    <li>Add: 5 + 3 = {add(5, 3)}</li>
    <li>Currency: {formatCurrency(1234.56)}</li>
  </ul>
</div>
