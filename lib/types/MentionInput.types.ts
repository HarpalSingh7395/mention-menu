export interface MentionOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MentionInputClassNames {
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

export interface MentionInputProps {
  options: MentionOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  trigger?: string;
  showSuggestions?: boolean;
  suggestionLimit?: number;
  classNames?: MentionInputClassNames;
  customBadge?: React.ComponentType<{
    option: MentionOption;
    onRemove: () => void;
    className?: string;
  }>;
  customSuggestion?: React.ComponentType<{
    option: MentionOption;
    onSelect: () => void;
    className?: string;
  }>;
  customDropdownItem?: React.ComponentType<{
    option: MentionOption;
    isActive: boolean;
    onSelect: () => void;
    className?: string;
  }>;
}

export interface VirtualElement {
  getBoundingClientRect: () => DOMRect;
  getClientRects: () => DOMRectList;
}