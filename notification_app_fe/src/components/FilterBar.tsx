import type { NotificationType } from '../types';

interface Props {
  selectedType: NotificationType | null;
  onSelect: (type: NotificationType | null) => void;
}

export default function FilterBar({ selectedType, onSelect }: Props) {
  const types: NotificationType[] = ['Event', 'Result', 'Placement'];

  return (
    <div className="flex flex-wrap gap-4 mb-8 justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`px-6 py-2 border-2 transition-all font-sans font-medium uppercase tracking-wider text-sm ${
          selectedType === null
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
        }`}
      >
        All
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`px-6 py-2 border-2 transition-all font-sans font-medium uppercase tracking-wider text-sm ${
            selectedType === type
              ? 'bg-primary border-primary text-primary-foreground'
              : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
