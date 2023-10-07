<script>
    //@ts-nocheck
    import { isVertical, editorContainerHeight, editorOutContainerHeight } from '$lib/stores/layoutStore';
    import { hover } from '$lib/actions/hover';
    import { fade } from 'svelte/transition';
    import { splitInstanceStore, editorSplit, editorElement } from '$lib/stores/splitStore';

    /**
	 * @type {string | string[]}
	 */
     export let id;
    /**
	 * @type {any}
	 */
     export let label;

    /**
	 * @type {HTMLElement}
	 */
    let split;
    /**
	 * @type {number}
	 */
    let splitClientWidth = 0;
    /**
	 * @type {number}
	 */
    let splitClientHeight = 0;
    let showPaneOptions = false;

    $: showOptionsObserved = showPaneOptions;
    $: value = $isVertical;

    // The editor is full and the output is closed
     $: isOutput = $editorOutContainerHeight && $editorOutContainerHeight <= 30;

     // The editor is closed and the output is full
     $: isEditor = $editorContainerHeight && $editorContainerHeight <= 30;

     $: {
        if (split) {
            let splitModel = split?.querySelector('.slot-control-bar .container');
            // Edge case 1: the editor is full and the output is closed
            if (isOutput && !isEditor) {
                split.style.minWidth = `${30}px`;
                
                if ((id?.includes('js') || id?.includes('css') || id?.includes('html'))) {
                    if (splitClientWidth <= 33) {
                        splitModel.style.transform = 'rotate(90deg)';
                    } else {
                        splitModel.style.transform = 'rotate(0deg)';
                    }
                }
            // Edge case 2: the editor is closed and the output is full
            } else if (isEditor && !isOutput) {
                if ((id?.includes('js') || id?.includes('css') || id?.includes('html'))) {
                    split.style.minWidth = `${80}px`;
                    splitModel.style.transform = 'rotate(0deg)';
                }
            // Edge case 3: the editor and the output are both open
            } else if (!isEditor && !isOutput) {
                split.style.minWidth = `${30}px`;
                if (splitClientWidth <= 33) {
                    if (!isEditor && !isOutput) {
                        splitModel.style.transform = 'rotate(90deg)';
                    }
                } else {
                    if (!isEditor && !isOutput) {
                        splitModel.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    }

    const maximize = async (/** @type {MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }} */ currentChild, isVertical = false) => {
		const { target } = currentChild;
		const selection = target.closest('section');
        switch (selection?.id) {
            case 'split-html':
            $editorSplit.setSizes([93.12459240436259, 3.437263361299153, 3.4381442343382815]);
            $splitInstanceStore.setSizes([97, 3]);
                break;
            case 'split-css':
            $editorSplit.collapse(0);
            $editorSplit.collapse(2);
            $splitInstanceStore.setSizes([97, 3]);
                break;
            case 'split-js':
            $editorSplit.collapse(0);
            $editorSplit.collapse(1);
            $splitInstanceStore.setSizes([97, 3]);

                break;
            case 'split-output':
            $splitInstanceStore.setSizes([3, 97]);
                break;
        }
	};

</script>

<section
    id={id}
    class="section-panel"
    style="overflow-x: visible;"
    bind:this={split}
    bind:clientWidth={splitClientWidth}
    bind:clientHeight={splitClientHeight}
    >
    <div
        class="slot-control-bar"
        role="button"
        tabindex="0"
        on:dblclick={(e) => {
            maximize(e, !value);
        }}
        
    >
        <div class="container no-selection" role="button" tabindex="0" use:hover on:hovered={() => (showPaneOptions = !(splitClientWidth <= 30) ? true : false)} on:mouseleave={() => (showPaneOptions = false)}>    
            {label}
            {#if showOptionsObserved}
                <div class="pane-options" in:fade|local="{{ delay: 50, duration: 100 }}" out:fade|local="{{ delay: 0, duration: 200 }}">
                    option
                </div>
            {/if}
        </div>
    </div>
    <slot name="pane-content" />
</section>

<style>
    .slot-control-bar {
		position: relative;
	}
    .slot-control-bar:hover {
        cursor: pointer;
    }
    .container {
        border-radius: 6px 6px 0px 0px;
        padding: 0 10px 0 10px;
        z-index: 1;
        width: calc(100% - 20px);
        height: 30px;
        position: absolute;
        display: flex;
        align-items: center;
        /* transition: background-color 300ms cubic-bezier(0.215, 0.610, 0.355, 1); */
    }
    .section-panel {
        border-radius: 6px;
        border: 2px solid #5c5c5c;
        min-width: 30px;
    }
    :global(.split.vertical) {
        display: flex !important;
        flex-direction: column !important;
    }
</style>