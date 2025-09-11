import { getCaretOffsetInInput, createVirtualElement, calculateDropdownPosition, classNames } from '../utils/MentionInput.utils';

describe('MentionInput Utils', () => {
  describe('classNames', () => {
    it('combines multiple class names', () => {
      expect(classNames('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('filters out falsy values', () => {
      expect(classNames('class1', null, undefined, false, 'class2')).toBe('class1 class2');
    });

    it('returns empty string for no valid classes', () => {
      expect(classNames(null, undefined, false)).toBe('');
    });

    it('handles empty input', () => {
      expect(classNames()).toBe('');
    });
  });

  describe('createVirtualElement', () => {
    it('creates virtual element with correct properties', () => {
      const virtualElement = createVirtualElement(100, 200, 50, 30);
      const rect = virtualElement.getBoundingClientRect();

      expect(rect.x).toBe(100);
      expect(rect.y).toBe(200);
      expect(rect.width).toBe(50);
      expect(rect.height).toBe(30);
      expect(rect.left).toBe(100);
      expect(rect.top).toBe(200);
      expect(rect.right).toBe(150);
      expect(rect.bottom).toBe(230);
    });

    it('uses default width and height when not provided', () => {
      const virtualElement = createVirtualElement(100, 200);
      const rect = virtualElement.getBoundingClientRect();

      expect(rect.width).toBe(1);
      expect(rect.height).toBe(20);
    });
  });

  describe('calculateDropdownPosition', () => {
    const mockInputRect: DOMRect = {
      x: 100,
      y: 100,
      width: 200,
      height: 30,
      top: 100,
      left: 100,
      right: 300,
      bottom: 130,
      toJSON: () => ({}),
    };

    beforeEach(() => {
      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });
    });

    it('calculates basic position correctly', () => {
      const position = calculateDropdownPosition(mockInputRect, 50);
      
      expect(position.x).toBe(150); // inputRect.left + caretOffset
      expect(position.y).toBe(134); // inputRect.bottom + 4
    });

    it('adjusts position when dropdown would overflow horizontally', () => {
      const position = calculateDropdownPosition(mockInputRect, 850); // Would go beyond viewport
      
      expect(position.x).toBe(792); // viewportWidth - dropdownWidth - 8
      expect(position.y).toBe(134);
    });

    it('adjusts position when dropdown would overflow vertically', () => {
      const highInputRect = {
        ...mockInputRect,
        y: 700,
        top: 700,
        bottom: 730,
      };
      
      const position = calculateDropdownPosition(highInputRect, 50);
      
      expect(position.x).toBe(150);
      expect(position.y).toBe(396); // inputRect.top - dropdownHeight - 4
    });
  });

  describe('getCaretOffsetInInput', () => {
    let mockInput: HTMLInputElement;

    beforeEach(() => {
      // Create a mock input element
      mockInput = document.createElement('input');
      mockInput.value = 'Hello world';
      document.body.appendChild(mockInput);
      
      // Mock getComputedStyle
      Object.defineProperty(window, 'getComputedStyle', {
        value: () => ({
          fontFamily: 'Arial',
          fontSize: '14px',
          fontWeight: 'normal',
          letterSpacing: 'normal',
          textTransform: 'none',
          wordSpacing: 'normal',
          textIndent: '0px',
          paddingLeft: '8px',
          paddingRight: '8px',
          borderLeftWidth: '1px',
          borderRightWidth: '1px',
          *[Symbol.iterator]() {
            const props = ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 
                          'textTransform', 'wordSpacing', 'textIndent', 'paddingLeft', 
                          'paddingRight', 'borderLeftWidth', 'borderRightWidth'];
            for (const prop of props) {
              yield prop;
            }
          },
          getPropertyValue: function(prop: string) {
            return (this as any)[prop] || '';
          },
        }),
      });
    });

    afterEach(() => {
      if (mockInput.parentNode) {
        document.body.removeChild(mockInput);
      }
    });

    it('calculates caret offset for position 0', () => {
      const offset = getCaretOffsetInInput(mockInput, 0);
      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThanOrEqual(0);
    });

    it('calculates caret offset for middle position', () => {
      const offset = getCaretOffsetInInput(mockInput, 5);
      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThan(0);
    });

    it('calculates caret offset for end position', () => {
      const offset = getCaretOffsetInInput(mockInput, mockInput.value.length);
      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThan(0);
    });

    it('handles empty input', () => {
      mockInput.value = '';
      const offset = getCaretOffsetInInput(mockInput, 0);
      expect(typeof offset).toBe('number');
      expect(offset).toBeGreaterThanOrEqual(0);
    });
  });
});