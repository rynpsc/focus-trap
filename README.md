# Focus Trap

Simple focus trap for trapping focus within a given element.

## Install

```
$ npm install @rynpsc/focus-trap
```

## API

### `focusTrap(element: HTMLElement, options: Object)`

Creates a focusTrap instance.

```js
import { FocusTrap } from '@rynpsc/focus-trap';

let trap = FocusTrap(<HTMLElement>);
```

#### Options

- `autoFocus`: Restore focus to the element that had focus when calling `activate`.

#### `.activate(element: HTMLElement, scroll: boolean)`

Active the trap and set focus to `element`. If `element` is undefined the first focuable element will be focused.

```js
trap.activate();
```

Pass `true` as the second parameter to scroll element into view, by default this is set to false.

```js
trap.activate(undefined, true);
```

#### `.deactivate(element, element: HTMLElement, scroll: boolean)`

Deactivate the trap and set focus to `element`;

```js
trap.deactive();
```

If the `restoreFocus` option is set to true focus will be restored to the element that had focus when calling `activate`. An alternative element can be focused by passing in the element to focus as the first parameter.

Pass `true` as the second parameter to scroll element into view, by default this is set to false.

```js
trap.deactivate(document.getElementById('my-id'), true);
```

### getFocusableElements(element: HTMLElement)

Gets the focusable child elements within a given element.

```js
import { getFocusableElements } from '@rynpsc/focus-trap';

let elements = getFocusableElements(<HTMLElement>);
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
import { focusTrap } from '@rynpsc/focus-trap';

const trap = focusTrap(document.getElementById('trap'));

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
- Array.prototype.some
- Array.prototype.filter
- Element.prototype.contains
- Element.prototype.matches
- Element​.query​SelectorAll()
