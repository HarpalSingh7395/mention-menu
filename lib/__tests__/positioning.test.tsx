import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MentionInput } from '../components/MentionInput';
import type { MentionOption } from '../types/MentionInput.types';

const mockOptions: MentionOption[] = [
  { value: '1', label: 'John Doe' },
  { value: '2', label: 'Jane Smith' },
  { value: '3', label: 'Bob Johnson' },
];

// Mock getBoundingClientRect for positioning tests
const mockInputRect = {
  x: 100,
  y: 50,
  width: 300,
  height: 40,
  top: 50,
  left: 100,
  right: 400,
  bottom: 90,
  toJSON: () => ({}),
};

describe('MentionInput Positioning', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = jest.fn(() => mockInputRect);
    
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

    // Mock scrolling
    Object.defineProperty(window, 'pageXOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
    
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('positions dropdown relative to @ symbol', async () => {
    const user = userEvent.setup();
    render(
      <MentionInput
        options={mockOptions}
        value={[]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Type @ to mention...');
    
    // Type text with @ in the middle
    await user.type(input, 'Hello @');

    const dropdown = screen.getByRole('combobox', { hidden: true });
    expect(dropdown).toBeInTheDocument();

    // The dropdown should be positioned based on the @ symbol position
    const dropdownStyle = window.getComputedStyle(dropdown);
    expect(dropdownStyle.position).toBe('fixed');
  });

  it('updates dropdown position when @ position changes', async () => {
    const user = userEvent.setup();
    render(
      <MentionInput
        options={mockOptions}
        value={[]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Type @ to mention...');
    
    // First @ position
    await user.type(input, '@john');
    
    let dropdown = screen.queryByRole('combobox', { hidden: true });
    expect(dropdown).toBeInTheDocument();
    
    // Clear and type @ in different position
    await user.clear(input);
    await user.type(input, 'Hello world @jane');
    
    dropdown = screen.queryByRole('combobox', { hidden: true });
    expect(dropdown).toBeInTheDocument();
    
    // Dropdown should still be visible with new positioning
    expect(screen.getByDisplayValue('jane')).toBeInTheDocument();
  });

  it('handles multiple @ symbols correctly', async () => {
    const user = userEvent.setup();
    render(
      <MentionInput
        options={mockOptions}
        value={[]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Type @ to mention...');
    
    // Type multiple @ symbols
    await user.type(input, 'Email me @ test@email.com or @john');
    
    // Should only show dropdown for the last @
    const dropdown = screen.queryByRole('combobox', { hidden: true });
    expect(dropdown).toBeInTheDocument();
    
    // Search input should only show query after last @
    const searchInput = screen.getByDisplayValue('john');
    expect(searchInput).toBeInTheDocument();
  });

  it('closes dropdown when @ is removed', async () => {
    const user = userEvent.setup();
    render(
      <MentionInput
        options={mockOptions}
        value={[]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Type @ to mention...');
    
    await user.type(input, '@john');
    
    let dropdown = screen.queryByRole('combobox', { hidden: true });
    expect(dropdown).toBeInTheDocument();
    
    // Remove the @ symbol
    await user.clear(input);
    await user.type(input, 'john');
    
    dropdown = screen.queryByRole('combobox', { hidden: true });
    expect(dropdown).not.toBeInTheDocument();
  });

  it('maintains dropdown position during scroll', async () => {
    const user = userEvent.setup();
    render(
      <MentionInput
        options={mockOptions}
        value={[]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@');
    
    const dropdown = screen.getByRole('combobox', { hidden: true });
    expect(dropdown).toBeInTheDocument();
    
    // Simulate scroll
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 100,
    });
    
    fireEvent.scroll(window);
    
    // Dropdown should still be visible
    expect(dropdown).toBeInTheDocument();
  });
});