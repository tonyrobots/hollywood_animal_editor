import { useEffect, useMemo, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export interface SliderFieldProps {
  label?: ComponentChildren;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  onCommit: (value: number) => void;
  onChange?: (value: number) => void;
  ticks?: number[];
  title?: string;
}

const DEFAULT_FORMAT = (value: number) => (Number.isFinite(value) ? (value * 10).toFixed(1) : '—');

export function SliderField({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  disabled,
  formatValue = DEFAULT_FORMAT,
  onCommit,
  onChange,
  ticks,
  title
}: SliderFieldProps) {
  const [draft, setDraft] = useState<number>(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const listId = useMemo(() => {
    if (!ticks || ticks.length === 0) return undefined;
    return `slider-ticks-${Math.random().toString(36).slice(2)}`;
  }, [ticks ? ticks.length : 0]);

  const handleInput = (event: Event) => {
    const next = Number((event.currentTarget as HTMLInputElement).value);
    setDraft(next);
    onChange?.(next);
  };

  const handleChange = (event: Event) => {
    const next = Number((event.currentTarget as HTMLInputElement).value);
    setDraft(next);
    onCommit(next);
  };

  return (
    <div class="slider-field" title={title}>
      {label && <div class="slider-field__label">{label}</div>}
      <div class="slider-field__control">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={draft}
          list={listId}
          disabled={disabled}
          onInput={handleInput}
          onChange={handleChange}
        />
        <span class="slider-field__value">{formatValue(draft)}</span>
      </div>
      {listId && ticks && ticks.length > 0 && (
        <datalist id={listId}>
          {ticks.map((tick) => (
            <option value={tick} key={tick} />
          ))}
        </datalist>
      )}
    </div>
  );
}
