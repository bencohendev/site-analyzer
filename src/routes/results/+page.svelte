<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  interface AnalysisItem {
    name: string;
    value: string | number;
  }

  interface AnalysisSection {
    title: string;
    items: AnalysisItem[];
  }

  interface DetectedTech {
    name: string;
    confidence: number;
    evidence: string[];
  }

  interface Analysis {
    url: string;
    structure: AnalysisSection;
    performance: AnalysisSection;
    seo: AnalysisSection;
    accessibility: AnalysisSection;
    techStack: {
      title: string;
      items: {
        name: string;
        value: string;
      }[];
    };
  }
  
  let analysis: Analysis | null = null;
  let error = '';
  let loading = true;

  function exportResults() {
    if (!analysis) return;
    
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-analysis-${new URL(analysis.url).hostname}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  onMount(async () => {
    const url = $page.url.searchParams.get('url');
    if (!url) {
      error = 'No URL provided';
      loading = false;
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      analysis = await response.json();
    } catch (e) {
      error = 'Failed to analyze website. Please try again.';
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-[calc(100vh-4rem)] py-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Analysis Results</h1>
      {#if analysis}
        <p class="mt-2 text-gray-600">{analysis.url}</p>
      {/if}
    </div>

    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p class="mt-4 text-gray-600">Analyzing website...</p>
      </div>
    {:else if error}
      <div class="text-center py-12">
        <p class="text-red-600">{error}</p>
        <a
          href="/"
          class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </a>
      </div>
    {:else if analysis}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each Object.entries(analysis) as [key, section]}
          {#if key !== 'url'}
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <dl class="space-y-3">
                {#each section.items as item}
                  <div class="flex justify-between">
                    <dt class="text-gray-600">{item.name}</dt>
                    <dd class="font-medium text-gray-900">
                      {#if key === 'techStack'}
                        <div class="text-right">
                          {#if item.value !== 'Not detected'}
                            <div class="space-y-2">
                              {#each item.value.split(', ') as tech}
                                <div class="flex items-center justify-end space-x-2">
                                  <span>{tech}</span>
                                  {#if tech.includes('%')}
                                    <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        class="h-full bg-blue-600 rounded-full"
                                        style="width: {tech.match(/\d+/)[0]}%"
                                      ></div>
                                    </div>
                                  {/if}
                                </div>
                              {/each}
                            </div>
                          {:else}
                            <span class="text-gray-500">Not detected</span>
                          {/if}
                        </div>
                      {:else}
                        {item.value}
                      {/if}
                    </dd>
                  </div>
                {/each}
              </dl>
            </div>
          {/if}
        {/each}
      </div>

      <div class="mt-8 flex justify-center space-x-4">
        <button
          on:click={exportResults}
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Export Results
        </button>
        <a
          href="/"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Analyze Another Site
        </a>
      </div>
    {/if}
  </div>
</div> 