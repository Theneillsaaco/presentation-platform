<script lang="ts">
    interface Props {
        selected?: boolean;
        disabled?: boolean;
        onclick?: (e: MouseEvent) => void;
        children?: import("svelte").Snippet;
    }

    let { selected = false, disabled = false, onclick, children }: Props = $props();
</script>

<button
    type="button"
    {disabled}
    {onclick}
    aria-pressed={selected}
    class="md-state-layer inline-flex h-8 items-center gap-1.5 rounded-md-sm border px-4 text-label-large
        transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]
        disabled:opacity-38 disabled:pointer-events-none
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary
        {selected
            ? 'border-transparent bg-md-secondary-container text-md-on-secondary-container [--md-state-layer-color:var(--md-on-secondary-container)]'
            : 'border-md-outline text-md-on-surface-variant [--md-state-layer-color:var(--md-on-surface-variant)]'}"

>
    {@render children?.()}
</button>