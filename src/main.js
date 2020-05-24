import { getKeyMap } from './keycodes'

function bindEvent (el, { value, modifiers }, alias) {
  el._keymap = getKeyMap(value, alias)
  el._keyHandler = e => {
    if (modifiers.stop) {
      const { nodeName, isContentEditable } = document.activeElement
      if (isContentEditable) return

      switch (nodeName) {
        case 'INPUT':
        case 'TEXTAREA':
        case 'SELECT':
          return
      }
    }

    for (const hotkey of el._keymap) {
      const callback = hotkey.keyCode === e.keyCode &&
        !!hotkey.ctrl === e.ctrlKey &&
        !!hotkey.alt === e.altKey &&
        !!hotkey.shift === e.shiftKey &&
        !!hotkey.meta === e.metaKey &&
        hotkey.callback[e.type]
	if (callback) {
	  callback(e);
	  modifiers.prevent && e.preventDefault();
	}
    }
  }
  document.addEventListener('keydown', el._keyHandler)
  document.addEventListener('keyup', el._keyHandler)
}

function unbindEvent (el) {
  document.removeEventListener('keydown', el._keyHandler)
  document.removeEventListener('keyup', el._keyHandler)
}

export {
  bindEvent,
  unbindEvent
}
