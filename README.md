# MentionInput Component

[![npm version](https://img.shields.io/npm/v/@your-org/mention-input.svg)](https://www.npmjs.com/package/@your-org/mention-input)
[![npm downloads](https://img.shields.io/npm/dm/@your-org/mention-input.svg)](https://www.npmjs.com/package/@your-org/mention-input)
[![GitHub stars](https://img.shields.io/github/stars/your-org/mention-input?style=social)](https://github.com/your-org/mention-input)
[![License](https://img.shields.io/github/license/your-org/mention-input.svg)](./LICENSE)

> A highly customizable **React mention/autocomplete input** with inline suggestions, keyboard navigation, and full styling control.

---

## ✨ Features

- 🎯 **Flexible Options** – Works with any data structure, supports icons
- 🎨 **Fully Customizable** – Replace default components or style with custom CSS
- ⌨️ **Keyboard Navigation** – Arrow keys, Enter/Tab to select, Escape to close
- 💡 **Inline Suggestions** – Clickable quick-suggestions
- 🔍 **Real-time Filtering** – Filter options as you type
- ♿ **Accessible** – ARIA labels + keyboard support
- 📱 **Position Aware** – Dropdown stays in viewport
- 🧪 **Well Tested** – Comprehensive test suite included

---

## 📸 Demo

![Mention Input Demo](https://via.placeholder.com/800x400?text=MentionInput+Demo)

👉 Try it live on **[CodeSandbox](https://codesandbox.io/)** (link to your demo).

---

## 📦 Installation

```bash
npm install @your-org/mention-input
# or
yarn add @your-org/mention-input
```

---

## 🚀 Basic Usage

```tsx
import React, { useState } from 'react';
import { MentionInput, MentionOption } from '@your-org/mention-input';

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

---

## ⚡ Quick Customization Example

```tsx
<MentionInput
  options={users}
  placeholder="Type @ to mention..."
  suggestionLimit={3}
  classNames={{ dropdown: "bg-white shadow-lg" }}
/>
```

---

## 📚 Components & API

### `MentionInput`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `MentionOption[]` | **Required** | Array of mentionable options. |
| `value` | `string[]` | **Required** | Selected option values. |
| `onChange` | `(values: string[]) => void` | **Required** | Callback on selection change. |
| `placeholder` | `string` | `"Type @ to mention..."` | Input placeholder. |
| `showSuggestions` | `boolean` | `true` | Show inline quick-suggestions. |
| `suggestionLimit` | `number` | `5` | Max suggestions shown. |
| `classNames` | `MentionInputClassNames` | `{}` | Override CSS classes. |
| `customBadge` | `React.ComponentType` | `DefaultBadge` | Custom badge renderer. |
| `customSuggestion` | `React.ComponentType` | `DefaultSuggestion` | Custom suggestion renderer. |
| `customDropdownItem` | `React.ComponentType` | `DefaultDropdownItem` | Custom dropdown item renderer. |

---

### `MentionMenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputRef` | `React.RefObject<HTMLInputElement>` | **Required** | Input ref for positioning. |
| `options` | `MentionOption[]` | **Required** | Options to display. |
| `activeIndex` | `number` | **Required** | Currently active index. |
| `mentionQuery` | `string` | **Required** | Current search query. |
| `show` | `boolean` | **Required** | Show/hide menu. |
| `onSelect` | `(opt: MentionOption) => void` | **Required** | Callback on select. |
| `onSearchChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | **Required** | Search input handler. |
| `setActiveIndex` | `(i: number) => void` | **Required** | Set active index. |
| `customClassNames` | `Record<string, string>` | `{}` | Custom CSS classes. |
| `DropdownItemComponent` | `React.FC<any>` | **Required** | Dropdown item component. |
| `dropdownWidth` | `number` | `280` | Width in px. |
| `dropdownHeight` | `number` | `300` | Max height in px. |

---

## 🛠️ Default Components

- **`DefaultBadge`** – Renders a selected mention
- **`DefaultSuggestion`** – Inline suggestion button
- **`DefaultDropdownItem`** – Dropdown list item

Replace via props for full customization.

---

## 🎨 Customization Examples

### Custom Badge
```tsx
const CustomBadge = ({ option, onRemove }) => (
  <div className="my-badge">
    {option.icon} {option.label}
    <button onClick={onRemove}>✕</button>
  </div>
);

<MentionInput options={options} value={value} onChange={onChange} customBadge={CustomBadge} />
```

### Custom Suggestion
```tsx
const CustomSuggestion = ({ option, onSelect }) => (
  <button onClick={onSelect}>+ {option.label}</button>
);

<MentionInput options={options} value={value} onChange={onChange} customSuggestion={CustomSuggestion} />
```

### Custom Dropdown Item
```tsx
const CustomDropdownItem = ({ option, isActive, onSelect }) => (
  <div className={`item ${isActive ? 'active' : ''}`} onClick={onSelect}>
    {option.icon} {option.label}
  </div>
);

<MentionInput options={options} value={value} onChange={onChange} customDropdownItem={CustomDropdownItem} />
```

---

## ⌨️ Keyboard Navigation

- `@` – open menu  
- `↑/↓` – navigate options  
- `Enter`/`Tab` – select option  
- `Esc` – close menu  
- `Backspace` – remove last selected item (if input empty)  

---

## 🎭 Styling

Default CSS classes provided:

```css
@import '@your-org/mention-input/styles/MentionInput.css';

.mention-input-container { /* your overrides */ }
.mention-input-selected-badge { /* custom styles */ }
.mention-input-dropdown { /* dropdown overrides */ }
```

---

## 🔬 Advanced Usage: Hook

```tsx
import { useMentionInput } from '@your-org/mention-input';

function CustomInput({ options, value, onChange }) {
  const { input, mentionQuery, showMenu, activeIndex, filteredOptions, handleSelect } =
    useMentionInput(options, value, onChange);

  return <div>{/* Build your own UI */}</div>;
}
```

---

## ✅ Testing

```bash
npm test
# or
yarn test
```

Covers rendering, keyboard navigation, hooks, and utilities.

---

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Commit your changes  
4. Push and open a PR 🚀  

---

## 💬 Community

- [Issues](https://github.com/your-org/mention-input/issues) – bug reports & feature requests  
- [Discussions](https://github.com/your-org/mention-input/discussions) – Q&A and ideas  

---

## 📄 License

MIT License – see [LICENSE](./LICENSE)

---

### 🔍 Keywords
React mention input, React autocomplete, React mentions component, React dropdown, React text input with mentions, React UI component