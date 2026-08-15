<script lang="ts">
    interface Props {
        checked?: boolean;
        disabled?: boolean;
        label?: string;
        onchange?: (checked: boolean) => void;
    }
  
    let { checked = $bindable(false), disabled = false, label, onchange }: Props = $props();
  
    function toggle() {
        if (disabled) return;
        checked = !checked;
        onchange?.(checked);
    }
</script>

<button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    {disabled}
    onclick={toggle}
    class="md-state-layer relative inline-flex h-8 w-13 shrink-0 items-center rounded-md-full border transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)] disabled:opacity-38 disabled:pointer-events-none
        {checked
            ? 'border-md-primary bg-md-primary'
            : 'border-md-outline bg-md-surface-container-highest'}"
    style="--md-state-layer-color: var(--md-primary)"
>
    <span
        class="pointer-events-none block rounded-md-full shadow-sm transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)]
        {checked
            ? 'ml-6.5 h-6 w-6 bg-md-on-primary'
            : 'ml-1 h-4 w-4 bg-md-outline'}"
    ></span>
</button>
