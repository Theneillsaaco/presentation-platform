<script lang="ts">
  /**
   * Live MD3 palette. Every swatch reads the CSS variable, so it re-colors
   * when the theme toggles and when a slide forces `theme: light|dark`.
   */
  const pairs = [
    { name: "primary", bg: "--md-primary", fg: "--md-on-primary" },
    { name: "primary-container", bg: "--md-primary-container", fg: "--md-on-primary-container" },
    { name: "secondary-container", bg: "--md-secondary-container", fg: "--md-on-secondary-container" },
    { name: "tertiary-container", bg: "--md-tertiary-container", fg: "--md-on-tertiary-container" },
    { name: "error-container", bg: "--md-error-container", fg: "--md-on-error-container" },
  ];
  const surfaces = [
    "--md-surface-container-lowest",
    "--md-surface-container-low",
    "--md-surface-container",
    "--md-surface-container-high",
    "--md-surface-container-highest",
  ];
</script>

<div class="flex w-full flex-col gap-4">
  <div class="grid grid-cols-5 gap-3">
    {#each pairs as p (p.name)}
      <div
        class="flex h-28 flex-col justify-end rounded-md-lg p-3 font-mono text-label-medium"
        style="background:var({p.bg});color:var({p.fg})"
      >
        {p.name}
      </div>
    {/each}
  </div>

  <div class="flex overflow-hidden rounded-md-lg border border-md-outline-variant">
    {#each surfaces as s (s)}
      <div class="flex h-14 flex-1 items-end p-2 font-mono text-label-small text-md-on-surface-variant" style="background:var({s})">
        {s.replace("--md-surface-container-", "").replace("--md-surface-container", "container")}
      </div>
    {/each}
  </div>
</div>
