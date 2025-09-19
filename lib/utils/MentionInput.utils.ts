// utils/MentionInput.utils.ts
export function getCaretCoordinates(
  input: HTMLInputElement | HTMLTextAreaElement,
  position: number
): { x: number; y: number } {
  position = Math.max(0, Math.min(position ?? (input as any).value.length, (input as any).value.length));

  const style = window.getComputedStyle(input);
  const inputRect = input.getBoundingClientRect();

  const div = document.createElement('div');

  // Use CSS property names (hyphenated)
  const properties = [
    'direction',
    'box-sizing',
    'width',
    'height',
    'overflow-x',
    'overflow-y',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'font-style',
    'font-variant',
    'font-weight',
    'font-stretch',
    'font-size',
    'line-height',
    'font-family',
    'text-align',
    'text-transform',
    'letter-spacing',
    'text-indent',
    'white-space',
  ];

  properties.forEach((prop) => {
    const val = style.getPropertyValue(prop);
    if (val) div.style.setProperty(prop, val);
  });

  // Position the mirror exactly over the input in the page so getBoundingClientRect aligns with viewport coords
  div.style.position = 'absolute';
  div.style.top = `${inputRect.top + window.scrollY}px`;
  div.style.left = `${inputRect.left + window.scrollX}px`;
  div.style.visibility = 'hidden';
  div.style.pointerEvents = 'none';
  div.style.zIndex = '999999';

  const isInputElement = input.tagName.toLowerCase() === 'input';
  div.style.whiteSpace = isInputElement ? 'pre' : 'pre-wrap';
  div.style.width = `${inputRect.width}px`;
  div.style.boxSizing = style.getPropertyValue('box-sizing') || 'border-box';
  div.style.overflow = 'hidden';

  // Preserve spaces so width matches the input exactly
  const textBefore = (input as any).value.substring(0, position);
  div.textContent = textBefore.replace(/ /g, '\u00A0');

  const span = document.createElement('span');
  span.textContent = '\u200b'; // zero-width marker
  div.appendChild(span);

  document.body.appendChild(div);

  // Mirror horizontal scroll if available (important for single-line inputs)
  try {
    (div as any).scrollLeft = (input as any).scrollLeft || 0;
  } catch (e) {
    // ignore
  }

  const spanRect = span.getBoundingClientRect();

  // spanRect is in viewport coords; return it directly
  const coords = { x: spanRect.left, y: spanRect.top };

  document.body.removeChild(div);

  return coords;
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
  // inputRect is expected to be getBoundingClientRect() (viewport coordinates)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // initial pos in viewport coords: caretOffset is relative to inputRect.left
  let x = inputRect.left + caretOffset;
  let y = inputRect.bottom + 4;

  // clamp horizontally with 8px margin
  if (x + dropdownWidth > viewportWidth - 8) {
    x = Math.max(8, viewportWidth - dropdownWidth - 8);
  }
  if (x < 8) x = 8;

  // vertical adjustments: prefer below, but move above if not enough space
  if (y + dropdownHeight > viewportHeight - 8) {
    const spaceAbove = inputRect.top;
    const spaceBelow = viewportHeight - inputRect.bottom;

    if (spaceAbove > spaceBelow && spaceAbove > dropdownHeight + 8) {
      y = inputRect.top - dropdownHeight - 4;
    } else {
      // keep below but ensure it doesn't overflow viewport bottom
      y = Math.max(8, viewportHeight - dropdownHeight - 8);
    }
  }

  // Return viewport coordinates (suitable for `position: fixed`)
  return { x, y };
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
