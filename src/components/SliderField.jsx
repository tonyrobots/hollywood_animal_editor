import { useEffect, useMemo, useState } from 'preact/hooks';
import { TagValueInput } from './TagValueInput';
const DEFAULT_FORMAT = (value) => (Number.isFinite(value) ? (value * 10).toFixed(1) : '—');
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1000 : false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1000);
        };
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return isMobile;
}
export function SliderField({ label, value, min = 0, max = 1, step = 0.01, disabled, formatValue = DEFAULT_FORMAT, onCommit, onChange, ticks, title }) {
    const isMobile = useIsMobile();
    const [draft, setDraft] = useState(value);
    useEffect(() => {
        setDraft(value);
    }, [value]);
    const listId = useMemo(() => {
        if (!ticks || ticks.length === 0)
            return undefined;
        return `slider-ticks-${Math.random().toString(36).slice(2)}`;
    }, [ticks ? ticks.length : 0]);
    const handleInput = (event) => {
        const next = Number(event.currentTarget.value);
        setDraft(next);
        onChange?.(next);
    };
    const handleChange = (event) => {
        const next = Number(event.currentTarget.value);
        setDraft(next);
        onCommit(next);
    };
    // On mobile, use TagValueInput component
    if (isMobile) {
        return (<div class="slider-field">
        {label && <div class="slider-field__label">{label}</div>}
        <TagValueInput value={value} title={title} min={min * 10} max={max * 10} step={step * 10} onCommit={onCommit}/>
      </div>);
    }
    // On desktop, use slider
    return (<div class="slider-field" title={title}>
      {label && <div class="slider-field__label">{label}</div>}
      <div class="slider-field__control">
        <input type="range" min={min} max={max} step={step} value={draft} list={listId} disabled={disabled} onInput={handleInput} onChange={handleChange}/>
        <span class="slider-field__value">{formatValue(draft)}</span>
      </div>
      {listId && ticks && ticks.length > 0 && (<datalist id={listId}>
          {ticks.map((tick) => (<option value={tick} key={tick}/>))}
        </datalist>)}
    </div>);
}
