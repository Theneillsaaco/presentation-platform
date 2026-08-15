<script lang="ts">
    interface Props {
        value?: string;
        label?: string;
        placeholder?: string;
        error?: string;
        disabled?: boolean;
        type?: "text" | "email" | "password" | "search";
        oninput?: (value: string) => void;
    }
  
    let {
        value = $bindable(""),
        label,
        placeholder,
        error,
        disabled = false,
        type = "text",
        oninput,
    }: Props = $props();
  
    let focused = $state(false);
    let id = `tf-${Math.random().toString(36).slice(2, 9)}`;
  
    function handleInput(e: Event) {
        value = (e.target as HTMLInputElement).value;
        oninput?.(value);
    }
</script>

<div class="flex flex-col gap-1">
    <div class="relative">
        {#if label}
            <label
                for={id}
                class="pointer-events-none absolute left-3 font-body text-md-on-surface-variant transition-all duration-150 ease-[cubic-bezier(0.2,0,0,1)]
                {focused || value
                    ? '-top-2 bg-md-surface px-1 text-label-small'
                    : 'top-1/2 -translate-y-1/2 text-body-large'}
                {focused ? 'text-md-primary' : ''}
                {error ? 'text-md-error' : ''}"
            >
                {label}
            </label>
        {/if}
        
        <input
            {id}
            {type}
            {disabled}
            {placeholder}
            {value}
            oninput={handleInput}
            onfocus={() => (focused = true)}
            onblur={() => (focused = false)}
            class="h-14 w-full rounded-md-xs border bg-transparent px-3 text-body-large text-md-on-surface outline-none
                transition-colors duration-150 ease-[cubic-bezier(0.2,0,0,1)]
                disabled:opacity-38 disabled:pointer-events-none
                {error
                  ? 'border-md-error focus:border-md-error'
                  : 'border-md-outline focus:border-md-primary focus:border-2'}"
        />
    </div>
    
    {#if error}
        <span class="px-3 text-body-small text-md-error">{error}</span>
    {/if}
</div>
