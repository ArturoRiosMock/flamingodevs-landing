'use client';

interface TagCloudProps {
  tags: string[];
  selected: string;
  onSelect: (tag: string) => void;
  maxTags?: number;
}

export function TagCloud({ tags, selected, onSelect, maxTags = 10 }: TagCloudProps) {
  const visibleTags = tags.slice(0, maxTags);

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => {
        const isSelected = tag.toLowerCase() === selected.toLowerCase();

        return (
          <button
            key={tag}
            onClick={() => onSelect(isSelected ? '' : tag)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              isSelected
                ? 'bg-[#212121] text-white'
                : 'bg-muted text-muted-foreground hover:bg-[#212121]/10 hover:text-[#212121]'
            }`}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}
