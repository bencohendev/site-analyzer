<script lang="ts">
  import { goto } from '$app/navigation';
  
  let url = '';
  let error = '';
  let isAnalyzing = false;

  function formatUrl(input: string): string {
    // Remove any whitespace
    input = input.trim();
    
    // If URL doesn't start with http:// or https://, add https://
    if (!input.match(/^https?:\/\//)) {
      input = 'https://' + input;
    }
    
    return input;
  }

  async function handleSubmit() {
    error = '';
    if (!url) {
      error = 'Please enter a URL';
      return;
    }
    const formattedUrl = formatUrl(url);

    isAnalyzing = true;
    try {
      await goto(`/results?url=${encodeURIComponent(formattedUrl)}`);
    } catch (e) {
      error = 'Failed to analyze website. Please try again.';
    } finally {
      isAnalyzing = false;
    }
  }
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center">
  <div class="w-full max-w-2xl p-8 bg-white rounded-lg shadow-sm">
    <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Site Analyzer</h1>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="url" class="block text-sm font-medium text-gray-700 mb-1">
          Enter website URL
        </label>
        <input
          type="text"
          id="url"
          bind:value={url}
          placeholder="https://example.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        {#if error}
          <p class="mt-1 text-sm text-red-600">{error}</p>
        {/if}
      </div>
      
      <button
        type="submit"
        disabled={isAnalyzing}
        class="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Site'}
      </button>
    </form>
  </div>
</div>
