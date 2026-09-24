<script lang="ts">
  import { slideActive } from "@/lib/reveal/active";

  interface Series {
    name: string;
    values: number[];
  }

  interface Props {
    labels: string[];
    series: Series[];
    /** Appended to the value labels, e.g. "mm". */
    unit?: string;
    decimals?: number;
  }

  let { labels, series, unit = "", decimals = 2 }: Props = $props();

  const W = 800;
  const H = 380;
  const PAD = { l: 56, r: 16, t: 28, b: 44 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const palette = ["var(--md-primary)", "var(--md-tertiary)", "var(--md-secondary)"];
  const STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  const TICKS = 4;

  // Bars grow when the slide holding this chart becomes current.
  let active = $state(false);

  const step = $derived.by(() => {
    const max = Math.max(...series.flatMap((s) => s.values), 0) || 1;
    const rough = max / TICKS;
    const pow = 10 ** Math.floor(Math.log10(rough));
    return (STEPS.find((n) => n * pow >= rough) ?? 10) * pow;
  });
  const axisMax = $derived(step * TICKS);
  const ticks = $derived(Array.from({ length: TICKS + 1 }, (_, i) => i * step));

  const groupW = $derived(plotW / Math.max(labels.length, 1));
  const barW = $derived((groupW * 0.72) / Math.max(series.length, 1));

  const y = (v: number) => PAD.t + plotH - (plotH * v) / axisMax;
  const x = (li: number, si: number) =>
    PAD.l + li * groupW + (groupW - barW * series.length) / 2 + si * barW;
  const fmt = (v: number) => v.toFixed(decimals);
</script>

<div class="flex w-full flex-col items-center gap-4" use:slideActive={(v) => (active = v)}>
  <svg viewBox="0 0 {W} {H}" class="w-full max-w-4xl" role="img" aria-label="Gráfico de barras">
    {#each ticks as t (t)}
      <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--md-outline-variant)" stroke-dasharray={t === 0 ? "none" : "3 5"} />
      <text x={PAD.l - 10} y={y(t) + 4} text-anchor="end" font-size="12" fill="var(--md-on-surface-variant)" font-family="var(--font-mono)">
        {fmt(t)}
      </text>
    {/each}

    {#each labels as label, li (label)}
      {#each series as s, si (s.name)}
        {@const v = s.values[li] ?? 0}
        <rect
          class="bar"
          class:grown={active}
          x={x(li, si)}
          y={y(v)}
          width={barW - 4}
          height={PAD.t + plotH - y(v)}
          rx="4"
          fill={palette[si % palette.length]}
          style="transition-delay:{(li * series.length + si) * 70}ms"
        />
        <text
          class="value"
          class:grown={active}
          x={x(li, si) + (barW - 4) / 2}
          y={y(v) - 8}
          text-anchor="middle"
          font-size="12"
          fill="var(--md-on-surface)"
          font-family="var(--font-mono)"
          style="transition-delay:{(li * series.length + si) * 70 + 350}ms"
        >
          {fmt(v)}{unit}
        </text>
      {/each}
      <text x={PAD.l + li * groupW + groupW / 2} y={H - PAD.b + 26} text-anchor="middle" font-size="13" fill="var(--md-on-surface-variant)">
        {label}
      </text>
    {/each}
  </svg>

  {#if series.length > 1}
    <div class="flex gap-6 font-mono text-label-medium text-md-on-surface-variant">
      {#each series as s, si (s.name)}
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-sm" style="background:{palette[si % palette.length]}"></span>
          {s.name}
        </span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .bar {
    transform: scaleY(0);
    transform-box: fill-box;
    transform-origin: bottom;
    transition: transform 600ms var(--md-easing-emphasized-decel);
  }
  .bar.grown {
    transform: scaleY(1);
  }
  .value {
    opacity: 0;
    transition: opacity 300ms var(--md-easing-standard);
  }
  .value.grown {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .bar, .value { transition: none; }
  }
</style>
