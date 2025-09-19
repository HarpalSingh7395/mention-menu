// __tests__/MentionInput.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MentionInput } from '../components/MentionInput';
import { type MentionOption } from '../types/MentionInput.types';

const mockOptions: MentionOption[] = [
  { value: '1', label: 'John Doe', icon: <span>👤</span> },
  { value: '2', label: 'Jane Smith', icon: <span>👩</span> },
  { value: '3', label: 'Bob Johnson', icon: <span>👨</span> },
  { value: '4', label: 'Alice Brown', icon: <span>👱‍♀️</span> },
];

describe('MentionInput', () => {
  const defaultProps = {
    options: mockOptions,
    value: [],
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<MentionInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    expect(input).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <MentionInput 
        {...defaultProps} 
        placeholder="Start typing to mention someone..." 
      />
    );
    
    const input = screen.getByPlaceholderText('Start typing to mention someone...');
    expect(input).toBeInTheDocument();
  });

  it('displays selected values as badges', () => {
    render(<MentionInput {...defaultProps} value={['1', '2']} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows suggestions when showSuggestions is true', () => {
    render(
      <MentionInput 
        {...defaultProps} 
        showSuggestions={true}
        suggestionLimit={2}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
  });

  it('hides suggestions when showSuggestions is false', () => {
    render(
      <MentionInput 
        {...defaultProps} 
        showSuggestions={false}
      />
    );
    
    // Should not show suggestion buttons
    const suggestionButtons = screen.queryAllByText(/John Doe|Jane Smith/);
    const badgeButtons = suggestionButtons.filter(el => 
      el.closest('.mention-input-suggestion')
    );
    expect(badgeButtons).toHaveLength(0);
  });

  it('opens dropdown when typing @', async () => {
    const user = userEvent.setup();
    render(<MentionInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@');
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
  });

  it('filters options based on search query', async () => {
    const user = userEvent.setup();
    render(<MentionInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@john');
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('selects option when clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<MentionInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@');
    
    await waitFor(() => {
      const option = screen.getByText('John Doe');
      expect(option).toBeInTheDocument();
    });
    
    await user.click(screen.getByText('John Doe'));
    
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('removes selected option when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<MentionInput {...defaultProps} value={['1']} onChange={onChange} />);
    
    const removeButton = screen.getByLabelText('Remove John Doe');
    await user.click(removeButton);
    
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('handles keyboard navigation in dropdown', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<MentionInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@');
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Navigate down
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    
    // Select with Enter
    await user.keyboard('{Enter}');
    
    expect(onChange).toHaveBeenCalledWith(['3']); // Bob Johnson should be selected
  });

  it('handles backspace to remove last selected item', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<MentionInput {...defaultProps} value={['1', '2']} onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.click(input);
    await user.keyboard('{Backspace}');
    
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('closes dropdown on escape key', async () => {
    const user = userEvent.setup();
    render(<MentionInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@');
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
    
    await user.keyboard('{Escape}');
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });
  });

  it('applies custom class names', () => {
    const customClassNames = {
      container: 'custom-container',
      selectedContainer: 'custom-selected-container',
      input: 'custom-input',
    };
    
    render(
      <MentionInput 
        {...defaultProps} 
        classNames={customClassNames}
      />
    );
    
    const container = screen.getByPlaceholderText('Type @ to mention...').closest('.custom-container');
    expect(container).toBeInTheDocument();
  });

  it('uses custom badge component', () => {
    const CustomBadge = ({ option, onRemove }: any) => (
      <div data-testid="custom-badge">
        Custom: {option.label}
        <button onClick={onRemove}>X</button>
      </div>
    );
    
    render(
      <MentionInput 
        {...defaultProps} 
        value={['1']} 
        customBadge={CustomBadge}
      />
    );
    
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    expect(screen.getByText('Custom: John Doe')).toBeInTheDocument();
  });

  it('uses custom suggestion component', () => {
    const CustomSuggestion = ({ option, onSelect }: any) => (
      <button data-testid="custom-suggestion" onClick={onSelect}>
        Add: {option.label}
      </button>
    );
    
    render(
      <MentionInput 
        {...defaultProps} 
        showSuggestions={true}
        customSuggestion={CustomSuggestion}
      />
    );
    
    expect(screen.getByTestId('custom-suggestion')).toBeInTheDocument();
    expect(screen.getByText('Add: John Doe')).toBeInTheDocument();
  });

  it('uses custom dropdown item component', async () => {
    const user = userEvent.setup();
    const CustomDropdownItem = ({ option, onSelect }: any) => (
      <div data-testid="custom-dropdown-item" onClick={onSelect}>
        Option: {option.label}
      </div>
    );
    
    render(
      <MentionInput 
        {...defaultProps} 
        customDropdownItem={CustomDropdownItem}
      />
    );
    
    const input = screen.getByPlaceholderText('Type @ to mention...');
    await user.type(input, '@');
    
    await waitFor(() => {
      expect(screen.getByTestId('custom-dropdown-item')).toBeInTheDocument();
      expect(screen.getByText('Option: John Doe')).toBeInTheDocument();
    });
  });

  it('excludes already selected options from suggestions', () => {
    render(
      <MentionInput 
        {...defaultProps} 
        value={['1', '2']}
        showSuggestions={true}
      />
    );
    
    // Should only show unselected options as suggestions
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('Alice Brown')).toBeInTheDocument();
    
    // Should not show already selected options as suggestions
    const suggestionArea = screen.getByPlaceholderText('Type @ to mention...').closest('.mention-input-selected-container');
    const johnSuggestion = suggestionArea?.querySelector('.mention-input-suggestion');
    expect(johnSuggestion?.textContent).not.toContain('John Doe');
    expect(johnSuggestion?.textContent).not.toContain('Jane Smith');
  });

  it('limits suggestions based on suggestionLimit', () => {
    render(
      <MentionInput 
        {...defaultProps} 
        showSuggestions={true}
        suggestionLimit={2}
      />
    );
    
    const suggestions = screen.getAllByText(/^\+/); // Suggestions start with +
    expect(suggestions).toHaveLength(2);
  });
});