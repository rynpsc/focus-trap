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
export function focusTrap(element, options = {}) {
	let initialFocus;
	let trapActivated = false;
	let { restoreFocus = true } = options;

	/**
	 * Activate trap and focus the provided element.
	 *
	 * @param {HTMLElement} focusTarget - Element to focus upon activation.
	 */
	function activate(focusTarget) {
		if (trapActivated) {
			return;
		}

		initialFocus = document.activeElement;

		focus(focusTarget) || focusFirstElement(element) || focus(element);

		document.addEventListener('focusin', onFocusIn, true);
		document.addEventListener('keydown', onKeydown, true);

		trapActivated = true;
	}

	/**
	 * Deactivate the trap and optionally redirect focus.
	 *
	 * @param {HTMLElement} element - Element to focus upon deactivation.
	 */
	function deactivate(focusTarget) {
		if (!trapActivated) {
			return;
		}

		document.removeEventListener('focusin', onFocusIn, true);
		document.removeEventListener('keydown', onKeydown, true);

		let target = focusTarget || (restoreFocus ? initialFocus : false);

		if (target) {
			focus(target);
		}

		trapActivated = false;
	}

	/**
	 * @param {FocusEvent} event
	 */
	function onFocusIn(event) {
		const focusLost = !element.contains(document.activeElement);

		event.preventDefault();
		event.stopImmediatePropagation();

		if (focusLost && trapActivated) {
			focusFirstElement(element);
		}
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	function onKeydown(event) {
		if (event.key === 'Tab') {
			trapTab(element, event);
		}

		/**
		 * @param {HTMLElement} element
		 * @param {KeyboardEvent} event
		 */
		function trapTab(element, event) {
			const activeElement = document.activeElement;

			const elements = getFocusableElements(element);
			const firstTabStop = elements[0];
			const lastTabStop = elements[elements.length - 1];

			if (event.shiftKey && (activeElement == firstTabStop)) {
				focus(lastTabStop);
				event.preventDefault();
			}

			if (!event.shiftKey && (activeElement == lastTabStop)) {
				focus(firstTabStop);
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
 * @returns {boolean} Indicates if the element was focused.
 */
function focus(element) {
	if (!element || !element instanceof HTMLElement || !element.focus) {
		return false;
	}

	element.focus();

	return (document.activeElement == element);
}

/**
 * Focus the focusable child element within a given element.
 *
 * @param {HTMLElement} element
 */
function focusFirstElement(element) {
	const nodes = getFocusableElements(element);

	if (!nodes.length) {
		return false;
	}

	return focus(nodes[0]);
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
 * Gets the focusable child elements within a given element.
 *
 * @param {HTMLElement} element
 * @returns {Array}
 */
function getFocusableElements(element) {
	return Array.from(element.querySelectorAll(selectors))
		.filter(elem => isTabbable(elem));
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
