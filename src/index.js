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

/**
 * Focus trap constructor.
 *
 * @param {HTMLElement} element
 * @returns {Object}
 */
export function FocusTrap(element, options = {}) {
	let initialFocus;
	let currentElement;
	let trapActivated = false;
	let { restoreFocus = true } = options;

	/**
	 * Activate trap and focus the provided element.
	 *
	 * @param {HTMLElement} focusTarget - Element to focus upon activation.
	 */
	function activate(focusTarget, scroll = false) {
		if (trapActivated) {
			return;
		}

		initialFocus = document.activeElement;

		if (focusTarget instanceof HTMLElement) {
			focus(focusTarget, scroll);
		} else {
			focusFirstElement(element, scroll);
		}

		document.addEventListener('focusin', onFocusIn, false);
		document.addEventListener('keydown', onKeydown, false);

		trapActivated = true;
	}

	/**
	 * Deactivate the trap and optionally redirect focus.
	 *
	 * @param {HTMLElement} element - Element to focus upon deactivation.
	 * @param {Object} options
	 */
	function deactivate(focusTarget = undefined, scroll = false) {
		if (!trapActivated) {
			return;
		}

		document.removeEventListener('focusin', onFocusIn, false);
		document.removeEventListener('keydown', onKeydown, false);

		let target = focusTarget || (restoreFocus ? initialFocus : false);

		if (target) {
			currentElement = focus(target, scroll);
		}

		trapActivated = false;
		currentElement = undefined;
	}

	/**
	 * @param {FocusEvent} event
	 */
	function onFocusIn(event) {
		let focusLost = !element.contains(event.target);

		if (!focusLost) {
			event.stopPropagation();
			currentElement = event.target;
			return;
		}

		event.preventDefault();

		if (currentElement) {
			focus(currentElement, true);
		} else {
			focusFirstElement(element, true);
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function onKeydown(event) {
		if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) {
			return;
		}

		trapTab(element, event);

		/**
		 * @param {HTMLElement} element
		 * @param {KeyboardEvent} event
		 */
		function trapTab(element, event) {
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

	return { activate, deactivate };
}

/**
 * Focus an element.
 *
 * @param {HTMLElement} element The element to focus.
 * @param {boolean} scroll Whether to scroll element into view.
 */
function focus(element, scroll = false) {
	if (!element || !element instanceof HTMLElement) {
		return false;
	}

	element.focus({ preventScroll: !scroll });
}

/**
 * Focus the focusable child element within a given element.
 *
 * @param {HTMLElement} element
 * @param {boolean} scroll Whether to scroll element into view.
 */
function focusFirstElement(element, scroll = false) {
	const nodes = getFocusableElements(element);

	if (!nodes.length) {
		return false;
	}

	focus(nodes[0], scroll);
}

/**
 * Gets the focusable child elements within a given element.
 *
 * @param {HTMLElement} element - Element to search in.
 * @returns {Array} The focusable elements.
 */
export function getFocusableElements(element) {
	return Array.from(element.querySelectorAll(selectors))
		.filter(element => isTabbable(element));
}

/**
 * Checks if an element appears in the tab order.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} Whether the element is tabbable.
 */
function isTabbable(element) {
	if (!element) {
		return false;
	}

	if (isRadio(element) && !isFocusableRadio(element)) {
		return false;
	}

	let tabindex = parseInt(element.getAttribute('tabindex'), 10);

	if (tabindex && tabindex < 0) {
		return false;
	}

	if (!element.matches(selectors)) {
		return false;
	}

	return (
		!element.hidden &&
		!element.disabled &&
		!(element.offsetParent === null || window.getComputedStyle(element).visibility === 'hidden')
	);
}

/**
 * Checks if an element is a radio button.
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isRadio(element) {
	return (element.tagName === 'INPUT' || element.type === 'radio');
}

/**
 * Checks if a radio button is focusable. A radio is focusable if either no
 * radio within the group is checked or the radio is the checked option in
 * a group.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} Whether the element is a radio button and is focusable.
 */
function isFocusableRadio(element) {
	if (!isRadio(element)) {
		return false;
	}

	let inputs = Array.from(document.getElementsByName(element.name));
	let hasCheckedOption = inputs.some(input => input.checked);

	if (!hasCheckedOption) {
		return true;
	}

	return element.checked;
}
