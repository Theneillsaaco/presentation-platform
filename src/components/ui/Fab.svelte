<script lang="ts">
    interface Props {
        size?: "small" | "regular" | "large";
        variant?: "primary" | "secondary" | "tertiary";
        label?: string;
        onclick?: (e: MouseEvent) => void;
        children?: import("svelte").Snippet;
    }
  
    let {
        size = "regular",
        variant = "primary",
        label,
        onclick,
        children,
    }: Props = $props();
  
    const sizes: Record<string, string> = {
        small: "h-10 w-10 rounded-md-md",
        regular: "h-14 w-14 rounded-md-lg",
        large: "h-24 w-24 rounded-md-xl",
    };
  
    const variants: Record<string, string> = {
        primary: "bg-md-primary-container text-md-on-primary-container [--md-state-layer-color:var(--md-on-primary-container)]",
        secondary: "bg-md-secondary-container text-md-on-secondary-container [--md-state-layer-color:var(--md-on-secondary-container)]",
        tertiary: "bg-md-tertiary-container text-md-on-tertiary-container [--md-state-layer-color:var(--md-on-tertiary-container)]",
    };
</script>

<button
    type="button"
    {onclick}
    aria-label={label}
    title={label}
    class="md-state-layer inline-flex items-center justify-center shadow-[var(--md-elevation-shadow-3)]
        transition-shadow duration-150 ease-[cubic-bezier(0.2,0,0,1)] hover:shadow-[var(--md-elevation-shadow-4)]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-md-primary
        {sizes[size]} {variants[variant]}"
>
  {@render children?.()}
</button>
