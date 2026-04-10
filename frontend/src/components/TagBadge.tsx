import { Badge } from './ui/badge';
import type { Tag } from '../types/tag';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: (id: number) => void;
}

export function TagBadge({ tag, onRemove }: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      style={{ backgroundColor: tag.color, borderColor: '#000000' }}
      className="cursor-pointer border-2 border-md-graphite text-white normal-case tracking-normal shadow-none hover:-translate-y-px hover:shadow-md-lift"
      onClick={() => onRemove?.(tag.id)}
    >
      {tag.name}
    </Badge>
  );
}
