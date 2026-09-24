<script lang="ts">
  import { slideActive } from "@/lib/reveal/active";

  interface Series {
    name: string;
    values: number[];
  }

  interface Props {
    labels: string[];
    series: Series[];
    unit?: string;
    decimals?: number;
  }

  let { labels, series, unit = "", decimals = 2 }: Props = $props();

  const W = 800;
  const H = 380;
  const PAD = { l: 56, r: 24, t: 28, b: 44 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const palette = ["var(--md-primary)", "var(--md-tertiary)", "var(--md-secondary)"];
  const TICKS = 4;

  let active = $state(false);

  const all = $derived(series.flatMap((s) => s.values));
  const lo = $derived(Math.min(...all));
  const hi = $derived(Math.max(...all));
  // Pad the range so the line never touches the frame.
  const min = $derived(Math.max(0, lo - (hi - lo) * 0.15));
  const max = $derived(hi + (hi - lo) * 0.15 || 1);

  const px = (i: number) => PAD.l + (labels.length < 2 ? plotW / 2 : (plotW * i) / (labels.length - 1));
  const py = (v: number) => PAD.t + plotH - (plotH * (v - min)) / (max - min || 1);
  const fmt = (v: number) => v.toFixed(decimals);
  const ticks = $derived(Array.from({ length: TICKS + 1 }, (_, i) => min + ((max - min) * i) / TICKS));
  const path = (values: number[]) => values.map((v, i) => `${i ? "L" : "M"}${px(i)} ${py(v)}`).join(" ");
</script>

<div class="flex w-full flex-col items-center gap-4" use:slideActive={(v) => (active = v)}>
  <svg viewBox="0 0 {W} {H}" class="w-full max-w-4xl" role="img" aria-label="Gráfico de líneas">
    {#each ticks as t (t)}
      <line x1={PAD.l} x2={W - PAD.r} y1={py(t)} y2={py(t)} stroke="var(--md-outline-variant)" stroke-dasharray="3 5" />
      <text x={PAD.l - 10} y={py(t) + 4} text-anchor="end" font-size="12" fill="var(--md-on-surface-variant)" font-family="var(--font-mono)">
        {fmt(t)}
      </text>
    {/each}

    {#each labels as label, i (label)}
      <text x={px(i)} y={H - PAD.b + 26} text-anchor="middle" font-size="13" fill="var(--md-on-surface-variant)">{label}</text>
    {/each}

    {#each series as s, si (s.name)}
      <path
        class="line"
        class:drawn={active}
        d={path(s.values)}
        pathLength="1"
        fill="none"
        stroke={palette[si % palette.length]}
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      {#each s.values as v, i (i)}
        <circle
          class="dot"
          class:drawn={active}
          cx={px(i)}
          cy={py(v)}
          r="5"
          fill={palette[si % palette.length]}
          style="transition-delay:{600 + i * 90}ms"
        />
        <text
          class="dot"
          class:drawn={active}
          x={px(i)}
          y={py(v) - 12}
          text-anchor="middle"
          font-size="12"
          fill="var(--md-on-surface)"
          font-family="var(--font-mono)"
          style="transition-delay:{600 + i * 90}ms"
        >
          {fmt(v)}{unit}
        </text>
      {/each}
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
  .line {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 900ms var(--md-easing-standard);
  }
  .line.drawn {
    stroke-dashoffset: 0;
  }
  .dot {
    opacity: 0;
    transition: opacity 250ms var(--md-easing-standard);
  }
  .dot.drawn {
    opacity: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .line, .dot { transition: none; }
  }
</style>
