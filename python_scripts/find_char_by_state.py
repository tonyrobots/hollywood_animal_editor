#!/usr/bin/env python3
"""Utility for listing characters by state bitmask.

This script inspects a Hollywood Animal save file and prints the characters whose
``state`` field matches a requested value. By default it requires an exact
match. When ``--bitmask`` is supplied the script treats the provided value as a
bitmask and returns every character whose state includes all of the specified
bits.

Example usage
-------------

Exact matches only::

    python find_char_by_state.py docs/sample_save.json 4

Treat 4 as a bitmask (so 4, 12, 20, 36, ... would match)::

    python find_char_by_state.py docs/sample_save.json 4 --bitmask

"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Dict, Iterable, Iterator, List, Optional, Sequence

DEFAULT_NAMES_PATH = Path("data/CHARACTER_NAMES.json")


class CharacterNames:
    """Helper to resolve character name IDs into display strings."""

    def __init__(self, path: Path | None = None) -> None:
        self._path = path or DEFAULT_NAMES_PATH
        self._names: Optional[List[str]] = None
        self._id_map: Optional[Dict[str, int]] = None

    def load(self) -> None:
        if self._names is not None:
            return

        try:
            with self._path.open("r", encoding="utf-8-sig") as fh:
                data = json.load(fh)
        except FileNotFoundError:
            print(f"Warning: could not find name map at {self._path}", file=sys.stderr)
            self._names = []
            self._id_map = {}
            return
        except json.JSONDecodeError as exc:
            print(
                f"Warning: could not parse name map at {self._path}: {exc}",
                file=sys.stderr,
            )
            self._names = []
            self._id_map = {}
            return

        names = data.get("locStrings")
        if isinstance(names, list):
            self._names = [str(name) for name in names]
        else:
            print(
                f"Warning: unexpected format in name map at {self._path}",
                file=sys.stderr,
            )
            self._names = []

        id_map = data.get("IdMap")
        if isinstance(id_map, dict):
            self._id_map = {}
            for key, value in id_map.items():
                try:
                    self._id_map[str(int(key))] = int(value)
                except (TypeError, ValueError):
                    continue
        else:
            self._id_map = {}

    def resolve(self, name_id: str | int | None) -> Optional[str]:
        if name_id is None:
            return None
        self.load()
        if not self._names:
            return None

        try:
            key = str(int(name_id))
        except (TypeError, ValueError):
            return None

        index: Optional[int] = None
        if self._id_map:
            index = self._id_map.get(key)
        if index is None:
            try:
                index = int(key)
            except ValueError:
                return None

        if 0 <= index < len(self._names):
            name = self._names[index]
            return name if name else None
        return None

    def full_name(self, first_id: str | int | None, last_id: str | int | None) -> str:
        first = self.resolve(first_id)
        last = self.resolve(last_id)
        if first and last:
            return f"{first} {last}"
        if first:
            return first
        if last:
            return last
        return "<unknown>"


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("save_file", type=Path, help="Path to the save file JSON")
    parser.add_argument(
        "state",
        type=int,
        help="Target state value. Treated as a bitmask when --bitmask is set.",
    )
    parser.add_argument(
        "-b",
        "-bitmask",
        "--bitmask",
        action="store_true",
        help="Treat the provided state value as a bitmask (matches if all bits are set).",
    )
    parser.add_argument(
        "--names",
        type=Path,
        default=DEFAULT_NAMES_PATH,
        help=(
            "Optional path to CHARACTER_NAMES.json. "
            "Defaults to data/CHARACTER_NAMES.json if available."
        ),
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help=(
            "Emit results as JSON (a list of character objects). "
            "Falls back to human-readable text when omitted."
        ),
    )
    return parser.parse_args(argv)


def load_save(path: Path) -> Dict:
    try:
        with path.open("r", encoding="utf-8-sig") as fh:
            return json.load(fh)
    except FileNotFoundError:
        print(f"Error: could not find save file at {path}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError as exc:
        print(f"Error: invalid JSON in save file {path}: {exc}", file=sys.stderr)
        sys.exit(1)


def _iter_possible_character_lists(container: object) -> Iterator[List[Dict]]:
    if isinstance(container, list):
        for item in container:
            yield from _iter_possible_character_lists(item)
    elif isinstance(container, dict):
        value = container.get("characters")
        if isinstance(value, list) and all(isinstance(v, dict) for v in value):
            if not value or any("state" in entry for entry in value):
                yield value
        for child in container.values():
            yield from _iter_possible_character_lists(child)


def extract_characters(save_data: Dict) -> Iterable[Dict]:
    """Return an iterable of character dictionaries from the save data."""

    direct_characters = save_data.get("characters")
    if isinstance(direct_characters, list):
        return direct_characters

    state_json = save_data.get("stateJson")
    if isinstance(state_json, str):
        try:
            state_json = json.loads(state_json)
        except json.JSONDecodeError as exc:
            print(
                f"Error: stateJson string could not be parsed as JSON: {exc}",
                file=sys.stderr,
            )
            sys.exit(1)

    for candidate in _iter_possible_character_lists(state_json):
        return candidate

    print("Error: characters array missing from save", file=sys.stderr)
    sys.exit(1)


def coerce_state(value: object) -> Optional[int]:
    """Convert a character's ``state`` entry to an integer when possible."""

    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None
        try:
            return int(value, 0)
        except ValueError:
            return None
    return None


def matches_state(value: int, target: int, treat_as_bitmask: bool) -> bool:
    if treat_as_bitmask:
        return (value & target) == target
    return value == target


def _character_payload(
    character: Dict, names: CharacterNames, state_value: int
) -> Dict[str, object]:
    return {
        "id": character.get("id"),
        "firstNameId": character.get("firstNameId"),
        "lastNameId": character.get("lastNameId"),
        "name": names.full_name(
            character.get("firstNameId"), character.get("lastNameId")
        ),
        "state": state_value,
        "type": character.get("type"),
    }


def format_character(character: Dict, names: CharacterNames, state_value: int) -> str:
    char_id = character.get("id", "<no id>")
    first_id = character.get("firstNameId")
    last_id = character.get("lastNameId")
    name = names.full_name(first_id, last_id)
    type_ = character.get("type", "?")
    return f"ID: {char_id} | Name: {name} | State: {state_value} | Type: {type_}"


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    save_data = load_save(args.save_file)
    characters = extract_characters(save_data)

    target_state = args.state
    treat_as_bitmask = args.bitmask

    names = CharacterNames(args.names)
    emit_json = args.json

    matched_characters: List[tuple[Dict, int]] = []
    for character in characters:
        state = coerce_state(character.get("state"))
        if state is None:
            continue
        if matches_state(state, target_state, treat_as_bitmask):
            matched_characters.append((character, state))

    if not matched_characters:
        qualifier = "bitmask" if treat_as_bitmask else "state"
        message = f"No characters matched {qualifier} value {target_state}."
        if emit_json:
            print("[]")
            print(message, file=sys.stderr)
        else:
            print(message)
        return 0

    def sort_key(item: tuple[Dict, int]) -> tuple[int, object]:
        character, _state = item
        char_id = character.get("id")
        try:
            return (0, int(char_id))
        except (TypeError, ValueError):
            return (1, str(char_id))

    if emit_json:
        payload = [
            _character_payload(character, names, state)
            for character, state in sorted(
                matched_characters,
                key=sort_key,
            )
        ]
        json.dump(payload, sys.stdout, ensure_ascii=False, indent=2)
        print()
        return 0

    if treat_as_bitmask:
        print(
            f"Characters with state values containing all bits from {target_state}:"
        )
    else:
        print(f"Characters with state value exactly {target_state}:")

    for character, state in sorted(matched_characters, key=sort_key):
        print(f"  {format_character(character, names, state)}")

    print(f"Total matches: {len(matched_characters)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
