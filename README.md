# Focus Trap

Simple focus trap for trapping focus within a given element.

## Usage

`npm install @rynpsc/focus-trap`

```html
<div id="trap">
  <button>Escape</button>
</div>
```

```js
import { focusTrap } from '@rynpsc/focus-trap';

const trap = focusTrap(document.getElementById('trap'));

trap.activate();

trap.deactivate();
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

## Browser support

Requires the following APIs:

- Array.from
- Array.prototype.some
- Array.prototype.filter
- Element.prototype.contains
- Element.prototype.matches
- Element​.query​SelectorAll()
