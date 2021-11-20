const selectors = [
	'input',
	'select',
	'textarea',
	'button',
	'summary',
	'a[href]',
	'area[href]',
	'embed',
	'iframe',
	'object',
	'audio[controls]',
	'video[controls]',
	'[contenteditable]:not([contenteditable="false"])',
];

type FocusTarget = HTMLElement | null | undefined;

interface HTMLRadioInput extends HTMLInputElement {}

export interface FocusTrap {
	activated: boolean;
	activate(element?: FocusTarget, scroll?: boolean): void;
	deactivate(element?: FocusTarget, scroll?: boolean): void;
}

export function FocusTrap(element: HTMLElement): FocusTrap {
	let activated = false;
	let currentElement: Element | null = null;
	let initialElement: Element | null = null;

	/**
	 * @param focusTarget - Element to focus upon activation.
	 * @param scroll - Scroll focused element into view
	 */
	function activate(focusTarget: FocusTarget = undefined, scroll = false) {
		if (activated) {
			return;
		}

		initialElement = document.activeElement;

		if (focusTarget) {
			focus(focusTarget, scroll);
		} else if (focusTarget !== null) {
			focusFirstElement(element, scroll);
		}

		document.addEventListener('focusin', onFocusIn, false);
		document.addEventListener('keydown', onKeydown, false);

		activated = true;
	}

	/**
	 * @param focusTarget - Element to focus upon deactivation.
	 * @param scroll - Scroll focused element into view.
	 */
	function deactivate(focusTarget: FocusTarget, scroll = false) {
		if (!activated) {
			return;
		}

		document.removeEventListener('focusin', onFocusIn, false);
		document.removeEventListener('keydown', onKeydown, false);

		let target = focusTarget || (focusTarget !== null ? initialElement : null);

		if (target) {
			focus(target, scroll);
		}

		activated = false;
		currentElement = null;
	}

	function onFocusIn(event: FocusEvent) {
		let target = event.target as Element;
		let focusLost = !element.contains(target);

		if (!focusLost) {
			event.stopPropagation();
			currentElement = target;
			return;
		}

		event.preventDefault();

		if (currentElement) {
			focus(currentElement, true);
		} else {
			focusFirstElement(element, true);
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}

		trapTab(element, event);

		function trapTab(element: HTMLElement, event: KeyboardEvent) {
			let activeElement = document.activeElement;

			let elements = getFocusableElements(element);
			let firstTabStop = elements[0];
			let lastTabStop = elements[elements.length - 1];

			if (event.shiftKey && (activeElement == firstTabStop)) {
				focus(lastTabStop, true);
				event.preventDefault();
			} else if (!event.shiftKey && (activeElement == lastTabStop)) {
				focus(firstTabStop, true);
				event.preventDefault();
			}
		}
	}

	return {
		activated,
		activate,
		deactivate,
	};
}

/**
 * Focus an element.
 *
 * @param element The element to focus.
 * @param scroll Scroll element into view.
 */
function focus(element: Element, scroll = false) {
	if (typeof (element as HTMLElement).focus !== 'function') {
		return;
	}

	(element as HTMLElement).focus({ preventScroll: !scroll });
}

/**
 * Focus the first focusable child element within a given element.
 *
 * @param element - HTMLElement to focus within.
 * @param scroll - Scroll element into view.
 */
export function focusFirstElement(element: HTMLElement, scroll = false) {
	const nodes = getFocusableElements(element);

	if (!nodes.length) {
		return false;
	}

	focus(nodes[0], scroll);
}

export function getFocusableElements(element: HTMLElement) {
	return (Array.from(
		element.querySelectorAll(selectors.join(','))) as HTMLElement[]
	).filter(element => isTabbable(element));
}

function isTabbable(element: HTMLElement) {
	let tabindex = parseInt(element.getAttribute('tabindex') || '', 10);

	if (
		element.hidden ||
		(tabindex && tabindex < 0) ||
		element.matches(':disabled') ||
		!element.matches(selectors.join(',')) ||
		(isRadio(element) && !isFocusableRadio(element)) ||
		!isVisible(element)
	) {
		return false;
	}

	return true;
}

function isVisible(element: HTMLElement) {
	if (element.getClientRects().length === 0) {
		return false;
	}

	return window.getComputedStyle(element).visibility === 'visible'
}

function isRadio(element: Element): element is HTMLRadioInput {
	return (element instanceof HTMLInputElement && element.type === 'radio');
}

function isFocusableRadio(element: HTMLElement): boolean {
	if (!isRadio(element)) {
		return false;
	}

	let context = element.form || document;
	let inputs = Array.from(context.getElementsByName(element.name)) as HTMLRadioInput[];
	let hasCheckedOption = inputs.some(input => input.checked);

	if (!hasCheckedOption) {
		return true;
	}

	return element.checked;
}
