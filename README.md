# Focus Trap

Simple focus trap for trapping focus within a given element.

## Install

```
$ npm install @rynpsc/focus-trap
```

## API

### focusTrap(element)

Creates a focusTrap instance.

#### element

Type: `HTMLElement`

The element to trap focus within.

### .activate(element)

Active the trap and set focus to `element`;

#### element

Type `HTMLElement`

### .deactivate(element)

Deactivate the trap and set focus to `element`;

#### element

Type `HTMLElement`

### getFocusableElements(element)

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
  // Activate trap and move focus to name input.
  trap.activate(document.getElementById('name'));
});

document.getElementById('deactivate').addEventListener('click', function() {
  // Remove trap and refocus on the activate button.
  trap.deactivate(document.getElementById('activate'));
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
