# Focus Trap

Simple focus trap for trapping focus within a given element.

![npm version](https://img.shields.io/npm/v/@rynpsc/focus-trap)
![npm bundle size (minified and gzipped)](https://img.shields.io/bundlephobia/minzip/@rynpsc/focus-trap?label=size)

## Install

```
$ npm install @rynpsc/focus-trap
```

## API

### FocusTrap(element: HTMLElement)

Creates a focusTrap instance.

```js
import { FocusTrap } from '@rynpsc/focus-trap';

let trap = FocusTrap(HTMLElement);
```

#### .activate(element: HTMLElement | undefined | null , scroll: boolean)

Active the trap and set focus to the given `element`. If `element` is `undefined` the first focuable element will be focused. Set to `null` to disable focusing any element.

Pass `true` as the second parameter to scroll element into view, by default this is set to false.

```js
trap.activate();
trap.activate(document.getElementById('my-id'), true);
```

#### .deactivate(element: HTMLElement | undefined | null, scroll: boolean)

Deactivate the trap and set focus to the given `element`. If `element` is `undefined` the element that had focus before calling `activate` will be focused. Set to `null` to disable focusing any element.

Pass `true` as the second parameter to scroll element into view, by default this is set to false.

```js
trap.deactive();
trap.deactivate(document.getElementById('my-id'), true);
```

#### activated: boolean

Returns a `boolean` indicating if the trap is activate.

### getFocusableElements(element: HTMLElement): HTMLElement[]

Gets the focusable child elements within a given element.

```js
import { getFocusableElements } from '@rynpsc/focus-trap';

let elements = getFocusableElements(HTMLElement);
```

## Example

```html
<button id="activate">Activate</button>

<div id="trap">
  <a href="#">Link</a>
  <label for="name">Name</label>
  <input type="text" id="name">
  <button id="deactivate">Deactivate</button>
</div>
```

```js
import { FocusTrap } from '@rynpsc/focus-trap';

const trap = FocusTrap(document.getElementById('trap'));

document.getElementById('activate').addEventListener('click', function() {
  trap.activate();
});

document.getElementById('deactivate').addEventListener('click', function() {
  trap.deactivate();
});
```

## Browser support

Requires the following APIs:

- Array.from
- Array.prototype.filter
- Array.prototype.some
- DOMTokenList.contains
- Element.matches
- Element.querySelectorAll
- HTMLElement.dataset

## License

MIT
