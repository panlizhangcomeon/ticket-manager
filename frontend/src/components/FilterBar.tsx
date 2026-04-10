import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import type { Tag } from '../types/tag';

interface FilterBarProps {
  tags: Tag[];
  selectedTagId?: number;
  includeCompleted: boolean;
  onTagChange: (tagId?: number) => void;
  onIncludeCompletedChange: (include: boolean) => void;
}

export function FilterBar({
  tags,
  selectedTagId,
  includeCompleted,
  onTagChange,
  onIncludeCompletedChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm shadow-gray-200/30">
      <div className="flex items-center gap-3">
        <Checkbox
          id="include-completed"
          checked={includeCompleted}
          onChange={(e) => onIncludeCompletedChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
        />
        <label
          htmlFor="include-completed"
          className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
        >
          包含已完成的
        </label>
      </div>
      <div className="w-px h-5 bg-gray-200 hidden sm:block" />
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedTagId === undefined ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTagChange(undefined)}
          className={`text-sm font-medium rounded-xl px-4 transition-all duration-200 ${
            selectedTagId === undefined
              ? 'bg-gray-900 text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/80'
          }`}
        >
          全部
        </Button>
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            style={{
              backgroundColor: selectedTagId === tag.id ? tag.color : undefined,
              color: selectedTagId === tag.id ? 'white' : undefined,
            }}
            variant={selectedTagId === tag.id ? 'default' : 'outline'}
            className="cursor-pointer hover:opacity-80 rounded-xl px-3 py-1 text-xs font-medium transition-all duration-200"
            onClick={() => onTagChange(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
