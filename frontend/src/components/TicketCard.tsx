import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TagBadge } from './TagBadge';
import type { Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onToggleComplete: (id: number, is_completed: boolean) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: number) => void;
}

export const TicketCard = memo(function TicketCard({
  ticket,
  selected,
  onSelect,
  onToggleComplete,
  onEdit,
  onDelete,
}: TicketCardProps) {
  const navigate = useNavigate();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(ticket.id, !ticket.is_completed);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(ticket.id);
  };

  const handleClick = () => {
    navigate(`/ticket/${ticket.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(ticket);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(ticket.id);
  };

  return (
    <Card
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="link"
      tabIndex={0}
      className={`group cursor-pointer transition-[transform,box-shadow,opacity] duration-md ease-in-out hover:-translate-x-[7px] hover:-translate-y-[7px] hover:shadow-md-lift focus-visible:outline-none focus-visible:ring-0 focus-visible:border-md-sky-strong ${
        ticket.is_completed ? 'opacity-70' : ''
      } ${selected ? 'border-md-sky-strong shadow-md-lift -translate-x-1 -translate-y-1' : ''}`}
    >
      <CardHeader className="px-4 pb-3 pt-4">
        <div className="flex items-start gap-3">
          <div
            role="checkbox"
            aria-checked={selected}
            tabIndex={0}
            onClick={handleSelect}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.(ticket.id);
              }
            }}
            className={`mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-struct border-2 border-md-graphite transition-colors duration-md ${
              selected ? 'bg-md-graphite' : 'bg-md-cloud hover:bg-md-fog'
            }`}
          >
            {selected && (
              <svg className="h-3.5 w-3.5 text-md-sunbeam" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <div
            role="checkbox"
            aria-checked={ticket.is_completed}
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleComplete(ticket.id, !ticket.is_completed);
              }
            }}
            className={`mt-0.5 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-struct border-2 border-md-graphite transition-colors duration-md ${
              ticket.is_completed ? 'bg-md-sky border-md-graphite' : 'bg-md-cloud hover:bg-md-fog'
            }`}
          >
            {ticket.is_completed && (
              <svg className="h-3.5 w-3.5 text-md-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <CardTitle
            className={`flex-1 text-[15px] leading-snug ${
              ticket.is_completed ? 'text-md-slate line-through' : 'text-md-ink'
            }`}
          >
            {ticket.title}
          </CardTitle>
        </div>
      </CardHeader>
      {ticket.description && (
        <CardContent className="px-4 pb-0">
          <p className="line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-md-slate">
            {ticket.description}
          </p>
        </CardContent>
      )}
      <CardContent className="px-4 pb-3 pt-3">
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {ticket.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between px-4 pb-4 pt-0">
        <time
          className="font-mono text-xs text-md-slate"
          dateTime={ticket.created_at}
        >
          {new Date(ticket.created_at).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
        <div className="flex gap-1 opacity-0 transition-opacity duration-md group-hover:opacity-100 group-focus-within:opacity-100">
          <Button variant="ghost" size="sm" onClick={handleEdit} className="normal-case">
            编辑
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="normal-case text-md-slate hover:text-red-700">
            删除
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});
