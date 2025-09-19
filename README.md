# MentionInput Component

A highly customizable and accessible React mention input component built with TypeScript. Features inline suggestions, keyboard navigation, and complete styling control.

## Features

- 🎯 **Flexible Options**: Support for any data structure with icons
- 🎨 **Fully Customizable**: Custom components and CSS classes for every part
- ⌨️ **Keyboard Navigation**: Arrow keys, Enter/Tab to select, Escape to close
- 💡 **Inline Suggestions**: Optional clickable suggestions for quick selection
- 🔍 **Real-time Filtering**: Search and filter options as you type
- ♿ **Accessible**: ARIA labels and keyboard support
- 📱 **Position Aware**: Smart dropdown positioning to stay in viewport
- 🧪 **Well Tested**: Comprehensive test suite included

## Installation

```bash
npm install mention-input
# or
yarn add mention-input
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { MentionInput, MentionOption } from 'mention-menu';
import "mention-menu/css"

const users: MentionOption[] = [
  { value: '1', label: 'John Doe', icon: <span>👤</span> },
  { value: '2', label: 'Jane Smith', icon: <span>👩</span> },
  { value: '3', label: 'Bob Johnson', icon: <span>👨</span> },
];

function App() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  return (
    <MentionInput
      options={users}
      value={selectedUsers}
      onChange={setSelectedUsers}
      placeholder="Type @ to mention someone..."
    />
  );
}
```

## Components

### `MentionInput`

The main component that wraps the mention functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `MentionOption[]` | **Required** | Array of available options to mention. |
| `value` | `string[]` | **Required** | Array of selected option values. |
| `onChange` | `(values: string[]) => void` | **Required** | Callback when the selection changes. |
| `placeholder` | `string` | `"Type @ to mention..."` | Input placeholder text. |
| `showSuggestions` | `boolean` | `true` | Whether to show inline suggestion buttons. |
| `suggestionLimit` | `number` | `5` | Maximum number of suggestions to show. |
| `classNames` | `MentionInputClassNames` | `{}` | Custom CSS classes for styling various parts of the component. |
| `customBadge` | `React.ComponentType` | `DefaultBadge` | Custom component for rendering selected badges. |
| `customSuggestion` | `React.ComponentType` | `DefaultSuggestion` | Custom component for rendering inline suggestions. |
| `customDropdownItem` | `React.ComponentType` | `DefaultDropdownItem` | Custom component for rendering items in the dropdown menu. |

---

### `MentionMenu`

A position-aware dropdown menu for displaying mention suggestions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputRef` | `React.RefObject<HTMLInputElement>` | **Required** | Ref to the main input element for positioning. |
| `options` | `MentionOption[]` | **Required** | Array of options to display. |
| `activeIndex` | `number` | **Required** | The index of the currently active/highlighted option. |
| `mentionQuery` | `string` | **Required** | The current search query. |
| `show` | `boolean` | **Required** | Whether the menu should be visible. |
| `onSelect` | `(opt: MentionOption) => void` | **Required** | Callback when an option is selected. |
| `onSearchChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | **Required** | Callback for the search input. |
| `setActiveIndex` | `(i: number) => void` | **Required** | Function to set the active index. |
| `customClassNames` | `Record<string, string>` | `{}` | Custom CSS classes. |
| `DropdownItemComponent` | `React.FC<any>` | **Required** | The component to render for each item. |
| `dropdownWidth` | `number` | `280` | The width of the dropdown. |
| `dropdownHeight` | `number` | `300` | The maximum height of the dropdown. |

---

### Default Components

These are the default components used for rendering parts of the UI. You can replace them by passing your own custom components to `MentionInput`.

- **`DefaultBadge`**: Renders a selected mention item.
- **`DefaultSuggestion`**: Renders an inline suggestion button.
- **`DefaultDropdownItem`**: Renders an item in the mention dropdown.

## API Reference

### Types

```tsx
interface MentionOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface MentionInputClassNames {
  container?: string;
  selectedContainer?: string;
  selectedBadge?: string;
  selectedBadgeIcon?: string;
  selectedBadgeLabel?: string;
  selectedBadgeRemove?: string;
  suggestion?: string;
  suggestionIcon?: string;
  suggestionLabel?: string;
  input?: string;
  dropdown?: string;
  dropdownSearch?: string;
  dropdownList?: string;
  dropdownEmpty?: string;
  dropdownItem?: string;
  dropdownItemActive?: string;
  dropdownItemIcon?: string;
  dropdownItemLabel?: string;
}
```

## Customization Examples

### Custom Badge Component

```tsx
const CustomBadge = ({ option, onRemove, className }) => (
  <div className={`my-badge ${className}`}>
    {option.icon}
    <span>{option.label}</span>
    <button onClick={onRemove} aria-label={`Remove ${option.label}`}>
      ✕
    </button>
  </div>
);

<MentionInput
  options={options}
  value={value}
  onChange={onChange}
  customBadge={CustomBadge}
/>
```

### Custom Suggestion Component

```tsx
const CustomSuggestion = ({ option, onSelect, className }) => (
  <button className={`my-suggestion ${className}`} onClick={onSelect}>
    <span>+</span>
    {option.icon}
    <span>{option.label}</span>
  </button>
);

<MentionInput
  options={options}
  value={value}
  onChange={onChange}
  customSuggestion={CustomSuggestion}
/>
```

### Custom Dropdown Item Component

```tsx
const CustomDropdownItem = ({ option, isActive, onSelect, className }) => (
  <div 
    className={`my-dropdown-item ${isActive ? 'active' : ''} ${className}`}
    onClick={onSelect}
  >
    <div className="icon">{option.icon}</div>
    <div className="content">
      <div className="label">{option.label}</div>
      <div className="value">@{option.value}</div>
    </div>
  </div>
);

<MentionInput
  options={options}
  value={value}
  onChange={onChange}
  customDropdownItem={CustomDropdownItem}
/>
```

### Custom Styling

```tsx
const customClassNames = {
  container: 'my-mention-container',
  selectedContainer: 'my-selected-container',
  selectedBadge: 'my-badge',
  input: 'my-input',
  dropdown: 'my-dropdown',
  dropdownItem: 'my-dropdown-item',
  dropdownItemActive: 'my-dropdown-item-active',
};

<MentionInput
  options={options}
  value={value}
  onChange={onChange}
  classNames={customClassNames}
/>
```

## Keyboard Navigation

- **@** - Open the mention dropdown
- **Arrow Up/Down** - Navigate through options
- **Enter/Tab** - Select highlighted option
- **Escape** - Close dropdown
- **Backspace** - Remove last selected item (when input is empty)

## Styling

The component comes with default CSS classes that you can override:

```css
/* Import the default styles */
@import '@import "mention-menu/css"';

/* Override default styles */
.mention-input-container {
  /* Your custom styles */
}

.mention-input-selected-badge {
  /* Your custom badge styles */
}

.mention-input-dropdown {
  /* Your custom dropdown styles */
}
```

## Advanced Usage

### Using the Hook Directly

```tsx
import { useMentionInput } from 'mention-menu';

function CustomMentionInput({ options, value, onChange }) {
  const {
    input,
    mentionQuery,
    showMenu,
    activeIndex,
    filteredOptions,
    inputRef,
    dropdownRef,
    handleSelect,
    handleRemove,
    handleInputChange,
    handleKeyDown,
    // ... other hook returns
  } = useMentionInput(options, value, onChange);

  // Build your own UI using the hook
  return (
    <div>
      {/* Your custom implementation */}
    </div>
  );
}
```

### Server-Side Rendering

The component is SSR-friendly and doesn't use any browser-only APIs during initial render.

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

The component includes comprehensive tests for:
- Component rendering and interactions
- Keyboard navigation
- Custom components
- Hook behavior
- Utility functions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.