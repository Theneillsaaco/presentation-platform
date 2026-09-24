<script lang="ts">
  interface Series {
    name: string;
    values: number[];
  }

  interface Props {
    labels: string[];
    series: Series[];
  }

  let { labels, series }: Props = $props();

  const W = 800;
  const H = 380;
  const PAD = 40;

  const maxValue = $derived(Math.max(1, ...series.flatMap((s) => s.values)));
  const palette = ["var(--md-primary)", "var(--md-tertiary)", "var(--md-secondary)"];

  function barX(labelIndex: number, seriesIndex: number, total: number) {
    const groupWidth = (W - PAD * 2) / Math.max(labels.length, 1);
    const barWidth = groupWidth / Math.max(total, 1) - 6;
    return PAD + labelIndex * groupWidth + seriesIndex * (barWidth + 6);
  }

  function barHeight(value: number) {
    return ((H - PAD * 2) * value) / maxValue;
  }
</script>

<div class="flex w-full flex-col items-center gap-4">
  <svg viewBox="0 0 {W} {H}" class="w-full max-w-3xl">
    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--md-outline-variant)" />
    {#each labels as label, li (label)}
      {#each series as s, si (s.name)}
        {@const h = barHeight(s.values[li] ?? 0)}
        <rect
          x={barX(li, si, series.length)}
          y={H - PAD - h}
          width={(W - PAD * 2) / Math.max(labels.length, 1) / Math.max(series.length, 1) - 6}
          height={h}
          rx="3"
          fill={palette[si % palette.length]}
        />
      {/each}
      <text
        x={barX(li, 0, series.length) + (W - PAD * 2) / Math.max(labels.length, 1) / 2 - 10}
        y={H - PAD + 20}
        font-size="12"
        fill="var(--md-on-surface-variant)"
      >
        {label}
      </text>
    {/each}
  </svg>

  {#if series.length > 1}
    <div class="flex gap-6 font-mono text-label-small text-md-on-surface-variant">
      {#each series as s, si (s.name)}
        <span class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-sm" style="background:{palette[si % palette.length]}"></span>
          {s.name}
        </span>
      {/each}
    </div>
  {/if}
</div>
