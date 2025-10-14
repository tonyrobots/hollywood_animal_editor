import { useEffect, useState } from 'preact/hooks';
import type { TalentData } from '../types/save';

interface AgeFieldProps {
  entity: TalentData;
  age: number | '';
  gameYear: number | null;
  onCommit: (entity: TalentData, nextAge: number) => void;
}

export function AgeField({ entity, age, gameYear, onCommit }: AgeFieldProps) {
  const [draft, setDraft] = useState(age === '' ? '' : String(age));

  useEffect(() => {
    setDraft(age === '' ? '' : String(age));
  }, [age]);

  const commit = () => {
    if (!gameYear) return;
    if (draft === '') return;
    const numeric = Number(draft);
    if (!Number.isFinite(numeric)) {
      return;
    }
    const clamped = Math.min(Math.max(Math.round(numeric), 0), 200);
    if (age === clamped) return;
    onCommit(entity, clamped);
  };

  return (
    <input
      type="number"
      class="age-field"
      min={0}
      max={200}
      step={1}
      value={draft}
      placeholder={gameYear ? '—' : 'Set game year'}
      onInput={(event) => setDraft((event.currentTarget as HTMLInputElement).value)}
      onBlur={() => {
        commit();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          commit();
        } else if (event.key === 'Escape') {
          setDraft(age === '' ? '' : String(age));
        }
      }}
    />
  );
}
