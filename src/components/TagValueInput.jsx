import { useEffect, useState } from 'preact/hooks';
function formatToDisplay(unit) {
    return Number.isFinite(unit) ? (unit * 10).toFixed(1) : '0.0';
}
export function TagValueInput({ value, icon, title, min = 0, max = 10, step = 0.1, onCommit }) {
    const [draft, setDraft] = useState(formatToDisplay(value));
    useEffect(() => {
        setDraft(formatToDisplay(value));
    }, [value]);
    const commit = () => {
        const numeric = Number(draft);
        if (!Number.isFinite(numeric)) {
            setDraft(formatToDisplay(value));
            return;
        }
        const clampedDisplay = Math.min(Math.max(numeric, min), max);
        const normalized = Math.round((clampedDisplay / 10) * 1000) / 1000;
        if (Math.abs(normalized - value) < 0.0005) {
            setDraft(formatToDisplay(value));
            return;
        }
        setDraft(formatToDisplay(normalized));
        onCommit(normalized);
    };
    const draftNumber = Number(draft);
    const showIcon = Number.isFinite(draftNumber) ? draftNumber > 0 : value > 0;
    return (<div class="tag-input" title={title}>
      <input type="number" min={min} max={max} step={step} value={draft} onInput={(event) => setDraft(event.currentTarget.value)} onBlur={commit} onKeyDown={(event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                commit();
            }
            else if (event.key === 'Escape') {
                event.preventDefault();
                setDraft(formatToDisplay(value));
            }
        }}/>
      {icon && showIcon ? <span class="tag-input__icon">{icon}</span> : null}
    </div>);
}
