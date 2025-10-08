import { useAppStore } from '../state';
import { formatUnitToTen, fullName } from '../domain';

export function ActorsView() {
  const store = useAppStore();
  const actors = store.derived.filteredActors.value;
  const filters = store.signals.filters.actors.value;
  const names = store.signals.names.value ?? [];
  const baseCount = store.signals.actors.value.length;
  const filteredCount = actors.length;
  const subtitle =
    filteredCount === baseCount ? `${baseCount} actors loaded` : `${filteredCount} of ${baseCount} actors shown`;

  const handleSearch = (event: Event) => {
    const value = (event.currentTarget as HTMLInputElement).value;
    store.actions.updateActorFilters({ search: value });
  };

  const handleStudioToggle = (event: Event) => {
    const { checked } = event.currentTarget as HTMLInputElement;
    store.actions.updateActorFilters({ playerStudioOnly: checked });
  };

  return (
    <section class="panel">
      <header class="panel__header">
        <h2>2. Actors Preview</h2>
        <p class="panel__subtitle">{subtitle}</p>
      </header>
      <div class="panel__controls">
        <label class="panel__field">
          <span>Search</span>
          <input type="search" value={filters.search} onInput={handleSearch} placeholder="Find actors…" />
        </label>
        <label class="panel__toggle">
          <input type="checkbox" checked={filters.playerStudioOnly} onChange={handleStudioToggle} />
          <span>Player Studio only</span>
        </label>
      </div>
      {actors.length === 0 ? (
        <p class="panel__empty">Load a save to preview actors.</p>
      ) : (
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Skill</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              {actors.slice(0, 20).map((actor, index) => {
                const skill = actor.professions?.Actor ?? '';
                const limit = actor.limit ?? actor.Limit ?? '';
                const fallbackKey = `${actor.firstNameId ?? 'f'}-${actor.lastNameId ?? 'l'}-${index}`;
                const key = actor.id != null ? `actor-${actor.id}` : fallbackKey;
                const displayName = fullName(names, {
                  firstId: actor.firstNameId,
                  lastId: actor.lastNameId,
                  customName: actor.customName
                });
                return (
                  <tr key={key}>
                    <td>{displayName}</td>
                    <td>{actor.id ?? '—'}</td>
                    <td>{formatUnitToTen(skill)}</td>
                    <td>{formatUnitToTen(limit)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {actors.length > 20 && <p class="panel__note">Showing first 20 actors.</p>}
        </div>
      )}
    </section>
  );
}
