import React, { useState } from 'react';
import { MentionInput } from '../components/MentionInput';
import type { MentionOption, MentionInputClassNames } from '../types/MentionInput.types';

// Sample data
const users: MentionOption[] = [
  { value: '1', label: 'John Doe', icon: <span>👤</span> },
  { value: '2', label: 'Jane Smith', icon: <span>👩</span> },
  { value: '3', label: 'Bob Johnson', icon: <span>👨</span> },
  { value: '4', label: 'Alice Brown', icon: <span>👱‍♀️</span> },
  { value: '5', label: 'Charlie Davis', icon: <span>👨‍💼</span> },
];

const teams: MentionOption[] = [
  { value: 'dev', label: 'Development Team', icon: <span>💻</span> },
  { value: 'design', label: 'Design Team', icon: <span>🎨</span> },
  { value: 'marketing', label: 'Marketing Team', icon: <span>📈</span> },
  { value: 'sales', label: 'Sales Team', icon: <span>💼</span> },
];

// Custom components
const CustomBadge = ({ option, onRemove, className }: any) => (
  <div className={`custom-badge ${className || ''}`}>
    {option.icon}
    <strong>{option.label}</strong>
    <button onClick={onRemove} className="custom-remove-btn">
      ✕
    </button>
  </div>
);

const CustomSuggestion = ({ option, onSelect, className }: any) => (
  <button 
    className={`custom-suggestion ${className || ''}`}
    onClick={onSelect}
  >
    <span className="suggestion-plus">➕</span>
    {option.icon}
    <span>{option.label}</span>
  </button>
);

const CustomDropdownItem = ({ option, isActive, onSelect, className }: any) => (
  <div 
    className={`custom-dropdown-item ${isActive ? 'active' : ''} ${className || ''}`}
    onClick={onSelect}
  >
    <div className="item-icon">{option.icon}</div>
    <div className="item-content">
      <div className="item-label">{option.label}</div>
      <div className="item-value">@{option.value}</div>
    </div>
  </div>
);

export const MentionInputExample: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  // Custom class names
  const customClassNames: MentionInputClassNames = {
    container: 'my-mention-container',
    selectedContainer: 'my-selected-container',
    input: 'my-input',
    dropdown: 'my-dropdown',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MentionInput Examples</h1>
      
      {/* Basic Example */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Basic Usage</h2>
        <MentionInput
          options={users}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Type @ to mention users..."
        />
        <p>Selected: {selectedUsers.join(', ')}</p>
      </section>

      {/* Custom Components Example */}
      <section style={{ marginBottom: '40px' }}>
        <h2>With Custom Components</h2>
        <MentionInput
          options={teams}
          value={selectedTeams}
          onChange={setSelectedTeams}
          placeholder="Type @ to mention teams..."
          customBadge={CustomBadge}
          customSuggestion={CustomSuggestion}
          customDropdownItem={CustomDropdownItem}
        />
        <p>Selected teams: {selectedTeams.join(', ')}</p>
      </section>

      {/* Without Suggestions */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Without Inline Suggestions</h2>
        <MentionInput
          options={users}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Type @ to mention (no suggestions)..."
          showSuggestions={false}
        />
      </section>

      {/* Limited Suggestions */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Limited Suggestions (2 items)</h2>
        <MentionInput
          options={users}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Type @ to mention (limited suggestions)..."
          showSuggestions={true}
          suggestionLimit={2}
        />
      </section>

      {/* Custom Class Names */}
      <section style={{ marginBottom: '40px' }}>
        <h2>With Custom Styling</h2>
        <MentionInput
          options={users}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Styled mention input..."
          classNames={customClassNames}
        />
      </section>

      <style>{`
        .custom-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .custom-remove-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .custom-remove-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .custom-suggestion {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 15px;
          color: #6c757d;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .custom-suggestion:hover {
          background: #e9ecef;
          border-color: #adb5bd;
          color: #495057;
        }

        .suggestion-plus {
          font-size: 12px;
        }

        .custom-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f1f3f4;
        }

        .custom-dropdown-item:last-child {
          border-bottom: none;
        }

        .custom-dropdown-item:hover,
        .custom-dropdown-item.active {
          background: #f8f9fa;
        }

        .item-icon {
          font-size: 18px;
        }

        .item-content {
          flex: 1;
        }

        .item-label {
          font-weight: 500;
          color: #212529;
        }

        .item-value {
          font-size: 12px;
          color: #6c757d;
        }

        .my-mention-container {
          border: 2px solid #e3f2fd;
          border-radius: 12px;
          background: #fafafa;
          padding: 4px;
        }

        .my-selected-container {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          min-height: 48px;
          padding: 12px;
        }

        .my-input {
          font-size: 16px;
          color: #2c3e50;
        }

        .my-dropdown {
          border: 2px solid #e3f2fd;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default MentionInputExample;