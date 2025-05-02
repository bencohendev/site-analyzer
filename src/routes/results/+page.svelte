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
        evidence?: string[];
      }[];
    };
  }
  
  let analysis: Analysis | null = null;
  let error = '';
  let loading = true;
  let expandedTechs: Set<string> = new Set();

  function toggleTechDetails(techName: string) {
    if (expandedTechs.has(techName)) {
      expandedTechs.delete(techName);
    } else {
      expandedTechs.add(techName);
    }
    expandedTechs = expandedTechs; // trigger reactivity
  }

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
          {#if key !== 'url' && key !== 'techStack' && (key === 'structure' || key === 'performance')}
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <dl class="space-y-3">
                {#each section.items as item}
                  <div class="flex justify-between">
                    <dt class="text-gray-600">{item.name}</dt>
                    <dd class="font-medium text-gray-900">{item.value}</dd>
                  </div>
                {/each}
              </dl>
            </div>
          {/if}
        {/each}
      </div>

      {#if analysis && analysis.techStack}
        <div class="my-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">{analysis.techStack.title}</h2>
            <dl class="space-y-3">
              {#each analysis.techStack.items as item, i}
                <div class="flex flex-col">
                  <dt class="text-gray-600 font-medium mb-2">{item.name}</dt>
                  <dd class="font-medium text-gray-900 pl-4">
                    <div>
                      {#if item.value !== 'Not detected'}
                        <div class="space-y-2">
                          {#each item.value.split(', ') as tech}
                            <div class="flex flex-col">
                              <div class="flex items-center space-x-2">
                                <button
                                  on:click={() => toggleTechDetails(tech.split(' (')[0])}
                                  class="text-gray-600 hover:text-gray-900 focus:outline-none"
                                >
                                  <svg
                                    class="w-4 h-4 transform transition-transform {expandedTechs.has(tech.split(' (')[0]) ? 'rotate-180' : ''}"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <span>{tech}</span>
                                {#if tech.includes('%')}
                                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      class="h-full bg-blue-600 rounded-full"
                                      style="width: {tech.match(/\d+/)?.[0] ?? 0}%"
                                    ></div>
                                  </div>
                                {/if}
                              </div>
                              {#if expandedTechs.has(tech.split(' (')[0])}
                                <div class="mt-1 text-sm text-gray-500 pl-6">
                                  {#if item.evidence}
                                    <div class="space-y-1">
                                      {#each item.evidence as evidence}
                                        <div class="flex items-center space-x-1">
                                          <span class="text-gray-400">•</span>
                                          <span>{evidence}</span>
                                        </div>
                                      {/each}
                                    </div>
                                  {/if}
                                </div>
                              {/if}
                            </div>
                          {/each}
                        </div>
                      {:else}
                        <span class="text-gray-500">Not detected</span>
                      {/if}
                    </div>
                  </dd>
                </div>
                {#if i < analysis.techStack.items.length - 1}
                  <div class="border-t border-gray-200 my-3"></div>
                {/if}
              {/each}
            </dl>
          </div>
        </div>
      {/if}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each Object.entries(analysis) as [key, section]}
          {#if key !== 'url' && key !== 'techStack' && (key === 'seo' || key === 'accessibility')}
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <dl class="space-y-3">
                {#each section.items as item}
                  <div class="flex justify-between">
                    <dt class="text-gray-600">{item.name}</dt>
                    <dd class="font-medium text-gray-900">{item.value}</dd>
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