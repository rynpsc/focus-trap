# Changelog

## 2.0.0 - 2020-07-22

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

## 1.0.0 - 2019-06-12

Initial release.
