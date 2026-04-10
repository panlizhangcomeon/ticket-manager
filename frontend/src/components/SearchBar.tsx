import { Input } from './ui/input';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = '搜索 Ticket...' }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setValue(keyword);
    onSearch(keyword);
  };

  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full h-12 bg-white/80 backdrop-blur-sm border-0 shadow-sm shadow-gray-200/50 rounded-2xl text-sm px-5 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 focus:shadow-lg focus:shadow-gray-200/60 transition-all duration-200"
      />
    </div>
  );
}
