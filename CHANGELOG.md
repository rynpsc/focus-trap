# Changelog

## 3.0.0

- Removed `restoreFocus` option
- Added ability to pass `null` to `activate` and `deactivate` methods
- Converted to Typescript

## 2.0.0

### Added

- Added the `activated` property to `FocusTrap`.
- Added the public `getFocusableElements` function.
- Added 'summary', 'embed' and 'object' to selector list.
- Added option to control scrolling to the focused element when calling `activate` or `deactivate`.
- Added `autoRestore` option to return focus to the element that was focused when trap was activated.

### Changed

- Renamed `focusTrap` to `FocusTrap`.
- The focused element is no longer scrolled into view by default when calling `activate` or `deactivate`.
- Focus is now restored to the last focused element when focus moves back into the trap.

### Fixed

- Fixed conflict when tabbing with a meta key pressed.

## 1.0.0

Initial release.
