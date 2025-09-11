export function getCaretOffsetInInput(input: HTMLInputElement, position: number): number {
  const div = document.createElement('div');
  const style = window.getComputedStyle(input);
  
  // Copy all computed styles
  for (const prop of style) {
    try {
      (div.style as any)[prop] = style.getPropertyValue(prop);
    } catch (e) {
      // Some properties might not be settable
    }
  }
  
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre';
  div.style.overflow = 'hidden';
  div.style.width = 'auto';
  div.style.height = 'auto';
  
  div.textContent = input.value.substring(0, position);
  
  const span = document.createElement('span');
  span.textContent = '\u200b'; // Zero-width space
  div.appendChild(span);
  
  document.body.appendChild(div);
  const rect = span.getBoundingClientRect();
  const inputRect = input.getBoundingClientRect();
  document.body.removeChild(div);
  
  return rect.left - inputRect.left;
}

export function createVirtualElement(x: number, y: number, width = 1, height = 20) {
  const rect: DOMRect = {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({}),
  };
  
  return {
    getBoundingClientRect: () => rect,
    getClientRects: () => [rect] as any,
  };
}

export function calculateDropdownPosition(
  inputRect: DOMRect,
  caretOffset: number,
  dropdownWidth = 224,
  dropdownHeight = 300
) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let x = inputRect.left + caretOffset;
  let y = inputRect.bottom + 4;
  
  // Adjust if dropdown would go off-screen horizontally
  if (x + dropdownWidth > viewportWidth) {
    x = viewportWidth - dropdownWidth - 8;
  }
  
  // Adjust if dropdown would go off-screen vertically
  if (y + dropdownHeight > viewportHeight) {
    y = inputRect.top - dropdownHeight - 4;
  }
  
  return { x, y };
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}