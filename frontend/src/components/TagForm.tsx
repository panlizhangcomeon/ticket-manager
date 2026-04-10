import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../types/tag';

interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: CreateTagRequest | UpdateTagRequest) => void;
  onCancel: () => void;
  open: boolean;
}

const DEFAULT_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
];

export function TagForm({ tag, onSubmit, onCancel, open }: TagFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setColor(tag.color);
    } else {
      setName('');
      setColor('#3B82F6');
    }
  }, [tag, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      color: color,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <DialogHeader className="border-b-2 border-md-graphite bg-md-soft-blue px-6 py-5">
          <DialogTitle>{tag ? '编辑标签' : '创建标签'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-5">
            <div>
              <label htmlFor="tag-name" className="mb-2 block text-eyebrow font-bold uppercase tracking-wider text-md-slate">
                名称 *
              </label>
              <Input
                id="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入标签名称"
                required
                maxLength={50}
              />
            </div>
            <div>
              <span className="mb-2 block text-eyebrow font-bold uppercase tracking-wider text-md-slate">颜色</span>
              <div className="mb-3 flex flex-wrap gap-2">
                {DEFAULT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`h-9 w-9 rounded-struct border-2 border-md-graphite transition-[transform,box-shadow] duration-md ${
                      color === c ? 'shadow-md-lift -translate-x-0.5 -translate-y-0.5 ring-2 ring-md-sky-strong ring-offset-2 ring-offset-md-cloud' : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-md-lift'
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    aria-label={`选择颜色 ${c}`}
                  />
                ))}
              </div>
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3B82F6"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="font-mono"
                aria-label="十六进制颜色值"
              />
            </div>
          </div>
          <DialogFooter className="border-t-2 border-md-graphite bg-md-cream px-6 py-4">
            <Button type="button" variant="ghost" onClick={onCancel} className="normal-case">
              取消
            </Button>
            <Button type="submit">{tag ? '更新' : '创建'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
