<script>
	// @ts-nocheck
	import { afterUpdate, createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
	import { editorStore } from '$lib/stores/editorStore';
	import { themeKeyStore } from '$lib/stores/themeStore';
	import { appClientWidth } from '$lib/stores/layoutStore';

	export let IFTitle;
	export let value;
	export let options;

	let Monaco;
	let container;
	let editor = null;
	let models = null;

	let selectionsContainer;
	let rightSelector;
	let leftSelector;
	let selectorMenu;
	let globalPoseMenu = 0;
	let disabledMove = false;

	$: if (IFTitle === 'js') {
		IFTitle = 'javascript';
	}
	$: model = editor?.getModel();
	$: uri = model?.uri;
	$: editorId = editor?._id;

	onMount(async () => {
		try {
			self.MonacoEnvironment = {
				getWorker: function (_moduleId, label) {
					if (label === 'js') {
						label = 'javascript';
					}
					if (label === 'json') {
						return new jsonWorker();
					}
					if (label === 'css' || label === 'scss' || label === 'less') {
						return new cssWorker();
					}
					if (label === 'html' || label === 'handlebars' || label === 'razor') {
						return new htmlWorker();
					}
					if (label === 'typescript' || label === 'javascript') {
						return new tsWorker();
					}
					return new tsWorker();
				}
			};
			Monaco = await import('monaco-editor');

			// Define light theme
			Monaco.editor.defineTheme('omni-light', {
				base: 'vs',
				inherit: true,
				rules: [],
				colors: {
					'editor.background': '#FBFBFB'
				}
			});

			// Define dark theme
			Monaco.editor.defineTheme('omni-dark', {
				base: 'vs-dark',
				inherit: true,
				rules: [],
				colors: {
					'editor.background': '#1d1e20'
				}
			});
			// create editor
			editor = Monaco.editor.create(container, {
				value,
				language: IFTitle,
				...options
			});
			model = editor.getModel();

			Monaco.editor.setModelLanguage(model || editor.getModel(), IFTitle);
			Monaco?.editor?.setTheme(`omni-${$themeKeyStore || 'light'}`);

			// Touch functionality initialization
			if ($appClientWidth <= 498) {
				initializeSelector();
			}

			const editorElement = container;
			let touchTimeout;
			let touchCount = 0;
			let startPosition;
			let isSelecting = false;

			function getLineYCoordinate(position) {
				const lineTop = editor.getTopForLineNumber(position.lineNumber);
				const editorCoords = editorElement.getBoundingClientRect();
				const lineY = window.scrollY + editorCoords.top + lineTop - tapsHeight;
				return lineY;
			}

			function isPositionInSelection(position) {
				const selection = editor.getSelection();
				if (!selection || selection.isEmpty()) {
					return false;
				}

				const startPosition = selection.getStartPosition();
				const endPosition = selection.getEndPosition();

				const isInRange =
					(position.lineNumber > startPosition.lineNumber ||
						(position.lineNumber === startPosition.lineNumber &&
							position.column >= startPosition.column)) &&
					(position.lineNumber < endPosition.lineNumber ||
						(position.lineNumber === endPosition.lineNumber &&
							position.column <= endPosition.column));

				return isInRange;
			}

			editorElement.addEventListener('touchstart', (event) => {
				if (selectorMenu.contains(event.target) || selectionsContainer.contains(event.target)) {
					event.stopPropagation();
					event.preventDefault();
				}
				touchCount++;
				if (touchTimeout) {
					clearTimeout(touchTimeout);
				}

				touchTimeout = setTimeout(() => {
					isSelecting = true;
					if (!isPositionInSelection(startPosition)) {
						editor.setPosition(startPosition);
					}
					let YValue = getLineYCoordinate(startPosition);
					showContextMenu(event.touches[0].clientX, YValue - 50);
				}, 1000); // 1 second long press to show context menu
				const touch = event.touches[0];
				const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);
				if (target && target.position) {
					startPosition = target.position;
				}
			});

			editorElement.addEventListener('touchend', () => {
				if (touchTimeout) {
					clearTimeout(touchTimeout);
				}
				if (isSelecting) {
					isSelecting = false;
				}
				if (disabledMove) {
					disabledMove = false;
				}
			});

			const tapsHeight = -3;
			const leftLength = document.querySelector('.monaco-editor .margin').offsetWidth;

			editorElement.addEventListener('touchmove', (event) => {
				if (touchTimeout) {
					clearTimeout(touchTimeout);
				}

				if (disabledMove) {
					event.preventDefault();
					event.stopPropagation();
				}

				if (startPosition && isSelecting) {
					event.preventDefault();
					event.stopPropagation();
					const touch = event.touches[0];
					const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);
					if (target && target.position) {
						editor.setSelection(
							new Monaco.Selection(
								startPosition.lineNumber,
								startPosition.column,
								target.position.lineNumber,
								target.position.column
							)
						);
						isSelecting = true;
					}
				}
			});

			editor.onDidChangeCursorSelection((e) => {
				const selection = e.selection;
				const startPosition = selection.getStartPosition();
				const endPosition = selection.getEndPosition();

				if (selection.isEmpty()) {
					selectionsContainer.classList.add('hidden');
					selectorMenu.classList.add('hidden');
					return;
				}

				const startLineTop = editor.getTopForLineNumber(startPosition.lineNumber);
				const endLineTop = editor.getTopForLineNumber(endPosition.lineNumber);

				const startCoords = editor.getScrolledVisiblePosition(startPosition);
				const endCoords = editor.getScrolledVisiblePosition(endPosition);

				if (startCoords && endCoords) {
					const editorCoords = editorElement.getBoundingClientRect();

					const leftSelectorX = editorCoords.left + startCoords.left - leftLength;
					const leftSelectorY = editorCoords.top + startLineTop - tapsHeight;
					const rightSelectorX = editorCoords.left + endCoords.left - leftLength;
					const rightSelectorY = editorCoords.top + endLineTop - tapsHeight;

					leftSelector.style.transform = `translateX(${leftSelectorX - 30}px) translateY(${
						leftSelectorY - 8
					}px)`;
					rightSelector.style.transform = `translateX(${rightSelectorX - 30}px) translateY(${
						rightSelectorY - 8
					}px)`;
					globalPoseMenu = leftSelectorY - 50;
				}

				selectionsContainer.classList.remove('hidden');
			});
		} catch (error) {
			console.error('error', error);
		}
	});

	function initializeSelector() {
		// Create the selectors container
		selectionsContainer = document.createElement('div');
		selectionsContainer.className = 'selections hidden';

		rightSelector = document.createElement('div');
		rightSelector.className = 'selctos right-selector';
		leftSelector = document.createElement('div');
		leftSelector.className = 'selctos left-selector';

		selectionsContainer.appendChild(rightSelector);
		selectionsContainer.appendChild(leftSelector);

		const editorScrollableNode = container.querySelector('.lines-content.monaco-editor-background');
		editorScrollableNode.insertAdjacentElement('afterbegin', selectionsContainer);

		selectorMenu = document.createElement('div');
		selectorMenu.className = 'menu-selector hidden';

		const outsetContainer = document.createElement('div');
		outsetContainer.className = 'outset-shit-select';

		const insetMenu = document.createElement('div');
		insetMenu.className = 'inset-menu';

		const menuItems = [
			{ className: 'copy', text: 'Copy', action: copy },
			{ className: 'cut', text: 'Cut', action: cut },
			{ className: 'paste', text: 'Paste', action: paste },
			{ className: 'select', text: 'Select all', action: selectAll },
			{ className: 'undo', text: 'Undo', action: undo },
			{ className: 'redo', text: 'Redo', action: redo },
			{ className: 'format', text: 'Format document', action: formatDocument }
		];

		menuItems.forEach((item) => {
			const div = document.createElement('div');
			div.className = `mnc ${item.className}`;
			div.innerHTML = `<span>${item.text}</span>`;
			div.ontouchstart = function () {
				this.classList.add('hovered');
			};
			div.ontouchmove = function () {
				this.classList.remove('hovered');
			};
			div.ontouchend = function () {
				this.classList.remove('hovered');
				item.action();
				selectorMenu.classList.add('hidden');
			};
			insetMenu.appendChild(div);
		});

		const leftArrow = document.createElement('div');
		leftArrow.className = 'right-arrow-mnc left';
		leftArrow.ontouchstart = function () {
			this.classList.add('hovered');
		};
		leftArrow.ontouchmove = function () {
			this.classList.remove('hovered');
		};

		leftArrow.ontouchend = function () {
			this.classList.remove('hovered');
			const containerWidth = outsetContainer.offsetWidth;
			let newScrollPosition = currentScrollPosition - containerWidth;
			if (newScrollPosition < 0) {
				newScrollPosition = 0;
			}
			outsetContainer.scrollTo({
				left: newScrollPosition,
				behavior: 'smooth'
			});
			currentScrollPosition = newScrollPosition;
			if (newScrollPosition < 5) {
				selectorMenu.classList.remove('scrolled');
			}
		};

		const rightArrow = document.createElement('div');
		rightArrow.className = 'right-arrow-mnc';
		rightArrow.ontouchstart = function () {
			this.classList.add('hovered');
		};
		rightArrow.ontouchmove = function () {
			this.classList.remove('hovered');
		};

		let currentScrollPosition = 0;
		rightArrow.ontouchend = function () {
			this.classList.remove('hovered');
			const containerWidth = outsetContainer.offsetWidth;
			const scrollWidth = outsetContainer.scrollWidth;
			let newScrollPosition = currentScrollPosition + containerWidth;
			if (newScrollPosition > scrollWidth) {
				newScrollPosition = scrollWidth;
			}
			outsetContainer.scrollTo({
				left: newScrollPosition,
				behavior: 'smooth'
			});
			currentScrollPosition = newScrollPosition;
			selectorMenu.classList.add('scrolled');
		};

		outsetContainer.appendChild(insetMenu);
		selectorMenu.appendChild(outsetContainer);
		selectorMenu.appendChild(rightArrow);
		selectorMenu.appendChild(leftArrow);

		selectorMenu.addEventListener('touchstart', (event) => {
			const touch = event.touches[0];
			event.preventDefault();
			disabledMove = true;
		});

		selectorMenu.addEventListener('touchmove', (event) => {
			const touch = event.touches[0];
			event.preventDefault();
			disabledMove = true;
		});

		selectorMenu.addEventListener('touchend', (event) => {
			const touch = event.touches[0];
			event.preventDefault();
			disabledMove = false;
		});

		editorScrollableNode.insertAdjacentElement('afterbegin', selectorMenu);

		function handleSelectorTouch(selector, isLeft) {
			let touchStartPos;
			let initialSelection;
			let touchMoved = false;
			let touchEndTimeout;

			selector.addEventListener('touchstart', (event) => {
				const touch = event.touches[0];
				touchStartPos = { x: touch.clientX, y: touch.clientY };
				initialSelection = editor.getSelection();
				touchMoved = false;
				if (touchEndTimeout) clearTimeout(touchEndTimeout);
				event.preventDefault();
				disabledMove = true;
			});

			selector.addEventListener('touchmove', (event) => {
				const touch = event.touches[0];
				const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);

				if (target && target.position) {
					const newSelection = isLeft
						? new Monaco.Selection(
								target.position.lineNumber,
								target.position.column,
								initialSelection.endLineNumber,
								initialSelection.endColumn
						  )
						: new Monaco.Selection(
								initialSelection.startLineNumber,
								initialSelection.startColumn,
								target.position.lineNumber,
								target.position.column
						  );
					editor.setSelection(newSelection);
					touchMoved = true;
				}
				event.preventDefault();
			});

			selector.addEventListener('touchend', (event) => {
				if (!touchMoved) {
					const touch = event.changedTouches[0];
					const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);

					if (target && target.position) {
						const newSelection = isLeft
							? new Monaco.Selection(
									target.position.lineNumber,
									target.position.column,
									initialSelection.endLineNumber,
									initialSelection.endColumn
							  )
							: new Monaco.Selection(
									initialSelection.startLineNumber,
									initialSelection.startColumn,
									target.position.lineNumber,
									target.position.column
							  );
						editor.setSelection(newSelection);
					}
				}
				touchStartPos = null;
				initialSelection = null;
				touchMoved = false;
			});
		}

		handleSelectorTouch(leftSelector, true);
		handleSelectorTouch(rightSelector, false);
	}

	function showContextMenu(x, y) {
		let top = globalPoseMenu == 0 ? y : globalPoseMenu;
		if (top < 50) {
			top = 60;
		}
		selectorMenu.style.transform = `translateY(${top}px)`;
		selectorMenu.classList.remove('hidden');
	}

	function undo() {
		editor.trigger('keyboard', 'undo', null);
	}

	function redo() {
		editor.trigger('keyboard', 'redo', null);
	}

	function selectAll() {
		editor.focus();
		const id = document.querySelector('.tap.selected').getAttribute('data-file-id');
		const model = editor.getModel();
		if (model) {
			const fullRange = model.getFullModelRange();
			editor.setSelection(fullRange);
		}
	}

	function copy() {
		const selection = editor.getSelection();
		const selectedText = editor.getModel().getValueInRange(selection);
		navigator.clipboard
			.writeText(selectedText)
			.then(() => {
				console.log('Copied to clipboard');
			})
			.catch((err) => {
				console.error('Error in copying', err);
			});
	}

	function cut() {
		const selection = editor.getSelection();
		const selectedText = editor.getModel().getValueInRange(selection);
		navigator.clipboard
			.writeText(selectedText)
			.then(() => {
				editor.executeEdits('', [{ range: selection, text: '' }]);
			})
			.catch((err) => {
				editor.executeEdits('', [{ range: selection, text: '' }]);
			});
	}

	function paste() {
		navigator.clipboard
			.readText()
			.then((text) => {
				const selection = editor.getSelection();
				editor.executeEdits('', [{ range: selection, text }]);
				console.log('Pasted from clipboard');
			})
			.catch((err) => {
				console.error('Failed to paste: ', err);
			});
	}

	function formatDocument() {
		editor.focus();
		editor.getAction('editor.action.formatDocument').run();
	}

	onDestroy(() => {
		editor && editor.dispose();
		model && model.dispose();
	});

	afterUpdate(async () => {
		await tick();
		let editorMatch;
		if ($editorStore === null && editor !== null) {
			editorStore.set([editor]);
		} else if ($editorStore?.length > 0 && editor !== null) {
			editorMatch = $editorStore.find(({ _id }) => {
				if (_id === editorId) {
					return true;
				}
			});

			if (!editorMatch && editor?._id !== 1) {
				editorStore.set([...$editorStore, editor]);
			}
		}

		if ($editorStore?.length === 1) {
			Monaco?.editor?.setModelLanguage(model || $editorStore[0]?.getModel(), IFTitle);
			$editorStore[0]?.setValue(value);
		}

		if (editorMatch) {
			Monaco?.editor?.setModelLanguage(model || editorMatch?.getModel(), IFTitle);
			editorMatch?.setValue(value);
		}
	});

	$: $editorStore,
		$themeKeyStore,
		(() => {
			if ($editorStore?.length > 1) {
				$editorStore.forEach((editor) => {
					if (editor?._id === editorId) {
						Monaco?.editor?.setTheme(`omni-${$themeKeyStore}`);
						editor?.setValue(value);
					}
				});
			} else {
				Monaco?.editor?.setTheme(`omni-${$themeKeyStore}`);
				$editorStore?.[0]?.setValue(value);
			}
		})();

	const dispatch = createEventDispatcher();
</script>

<div
	id={IFTitle}
	class="editor"
	bind:this={container}
	on:keyup={async () => {
		await tick();
		return dispatch('update', {
			value: editor.getValue()
		});
	}}
	style="height:100%;"
	role="textbox"
	tabindex="0"
/>

<style>
	:global(.view-lines.monaco-mouse-cursor-text, .active-line-number.line-numbers) {
		font-family: 'Fira Code', monospace !important;
	}
	* {
		scrollbar-width: 0;
	}

	*::-webkit-scrollbar {
		display: none;
	}

	:global(.hidden) {
		display: none !important;
	}
	/* :global(.editor) {
		height: 100%;
		width: 100%;
		position: absolute;
	} */

	:global(.selections) {
		position: absolute;
		top: 0;
		z-index: 9999;
	}

	:global(.selctos) {
		width: 25px;
		height: 25px;
		background: #7a77ff;
		position: absolute;
		border-radius: 50%;
		margin-top: 25px;
		box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
	}

	:global(.selctos.right-selector) {
		border-top-left-radius: 0;
		margin-left: -8px;
	}

	:global(.selctos.left-selector) {
		border-top-right-radius: 0;
		margin-left: -35px;
	}

	:global(.menu-selector) {
		position: absolute;
		display: flex;
		height: 45px;
		background: #fff;
		border-radius: 18px;
		max-width: 75vw;
		width: fit-content;
		z-index: 999;
	}

	:global(.inset-menu) {
		display: flex;
		width: fit-content;
		padding-left: 5px;
	}

	:global(.mnc) {
		position: relative;
		display: flex;
		padding: 0 16px;
		align-items: center;
		height: 100%;
		font-size: 14px;
		color: #000;
		white-space: nowrap;
		line-height: 20px;
		transition: 0.2s;
	}

	:global(.mnc:after) {
		content: '';
		position: absolute;
		right: 0;
		height: 20px;
		opacity: 0.1;
		border-right: 1px solid #000;
		visibility: hidden;
	}

	:global(.outset-shit-select) {
		display: flex;
		height: 100%;
		-webkit-mask-image: linear-gradient(to right, black 95%, transparent 100%);
		width: calc(100% - 50px);
		overflow-x: scroll;
		overflow-y: hidden;
	}

	:global(.right-arrow-mnc) {
		position: absolute;
		right: 0;
		width: 45px;
		height: 100%;
		display: flex;
		align-items: center;
		overflow: visible;
	}

	:global(.right-arrow-mnc:after) {
		content: '';
		display: flex;
		height: 40px;
		width: 100%;
		-webkit-mask-position: center;
		-webkit-mask-size: 24px;
		-webkit-mask-image: url(assets/arrow.svg?sad);
		background: #000;
		-webkit-mask-repeat: no-repeat;
		transform: rotate(-90deg);
	}

	:global(.right-arrow-mnc:before) {
		content: '';
		height: 25px;
	}

	:global(.hovered) {
		background: rgb(0 0 0 / 25%);
	}

	:global(.right-arrow-mnc.left) {
		left: 0;
		display: none;
	}

	:global(.right-arrow-mnc.left:after) {
		transform: rotate(90deg);
	}
	:global(.menu-selector.scrolled) {
		padding-left: 45px;
	}

	:global(.menu-selector.scrolled .right-arrow-mnc.left) {
		display: flex;
	}

	:global(.menu-selector.scrolled .inset-menu) {
		padding-left: 0;
	}
</style>
