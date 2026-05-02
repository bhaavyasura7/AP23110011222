import type { NotificationType } from '../types';

interface Props {
  selectedType: NotificationType | null;
  onSelect: (type: NotificationType | null) => void;
}

export default function FilterBar({ selectedType, onSelect }: Props) {
  const types: NotificationType[] = ['Event', 'Result', 'Placement'];

  return (
    <div className="filter-bar">
      <button
        onClick={() => onSelect(null)}
        className={`filter-btn${selectedType === null ? ' active' : ''}`}
      >
        All
      </button>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`filter-btn${selectedType === type ? ' active' : ''}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
