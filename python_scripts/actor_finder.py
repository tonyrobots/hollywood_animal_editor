#!/usr/bin/env python3
"""
Hollywood Animal Save File Actor Finder

This script helps find actor records in save files by searching for their names.
Names are stored as IDs that reference the CHARACTER_NAMES.json file.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple


class ActorFinder:
    def __init__(self, character_names_path: str = "../data/CHARACTER_NAMES.json"):
        """Initialize the ActorFinder with character names data."""
        self.character_names = self._load_character_names(character_names_path)
        
    def _load_character_names(self, path: str) -> Dict[str, List[str]]:
        """Load the CHARACTER_NAMES.json file."""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {
                    'id_map': data.get('IdMap', {}),
                    'names': data.get('locStrings', [])
                }
        except FileNotFoundError:
            print(f"Error: Could not find {path}")
            sys.exit(1)
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in {path}")
            sys.exit(1)
    
    def get_name_by_id(self, name_id: str) -> Optional[str]:
        """Get a name by its ID."""
        try:
            id_num = int(name_id)
            if 0 <= id_num < len(self.character_names['names']):
                return self.character_names['names'][id_num]
        except (ValueError, IndexError):
            pass
        return None
    
    def get_id_by_name(self, name: str) -> Optional[str]:
        """Get an ID by name (case-insensitive search)."""
        name_lower = name.lower()
        for i, stored_name in enumerate(self.character_names['names']):
            if stored_name.lower() == name_lower:
                return str(i)
        return None
    
    def find_actor_by_names_in_large_file(self, save_file_path: str, first_name: str, last_name: str) -> Optional[Dict]:
        """
        Find an actor record in a large save file by searching for name ID pattern.
        This avoids loading the entire file into memory.
        
        Args:
            save_file_path: Path to the save file
            first_name: First name to search for
            last_name: Last name to search for
            
        Returns:
            The actor record if found, None otherwise
        """
        # First, try to get IDs by name
        first_name_id = self.get_id_by_name(first_name)
        last_name_id = self.get_id_by_name(last_name)
        
        if not first_name_id or not last_name_id:
            print(f"Could not find name IDs for '{first_name}' or '{last_name}'")
            return None
        
        print(f"Searching for actor: {first_name} {last_name}")
        print(f"Name IDs: {first_name_id} (first), {last_name_id} (last)")
        
        # Create the search patterns (handle both single-line and multi-line JSON)
        pattern1 = f'"firstNameId": "{first_name_id}", "lastNameId": "{last_name_id}"'
        pattern2 = f'"firstNameId": "{first_name_id}"'
        print(f"Searching for patterns:")
        print(f"  Single-line: {pattern1}")
        print(f"  Multi-line: {pattern2} followed by lastNameId: {last_name_id}")
        
        try:
            # Handle UTF-8 BOM
            try:
                with open(save_file_path, 'r', encoding='utf-8-sig') as f:
                    content = f.read()
            except UnicodeDecodeError:
                with open(save_file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
            # First try the single-line pattern (for unformatted JSON)
            pattern_index = content.find(pattern1)
            
            # If not found, try multi-line pattern (for formatted JSON)
            if pattern_index == -1:
                print("Single-line pattern not found, trying multi-line search...")
                
                # Find firstNameId pattern
                first_name_pattern = f'"firstNameId": "{first_name_id}"'
                first_index = content.find(first_name_pattern)
                
                if first_index != -1:
                    # Look for lastNameId pattern within the next 1000 characters
                    search_end = min(first_index + 1000, len(content))
                    substring = content[first_index:search_end]
                    last_name_pattern = f'"lastNameId": "{last_name_id}"'
                    
                    if last_name_pattern in substring:
                        pattern_index = first_index
                        print(f"Found multi-line pattern starting at position {pattern_index}")
                    else:
                        print(f"Found firstNameId but not matching lastNameId nearby")
            
            if pattern_index == -1:
                print(f"Actor '{first_name} {last_name}' not found in save file")
                return None
            
            print(f"Found pattern at position {pattern_index}")
            
            # Find the start of the actor record (look backwards for opening brace)
            record_start = content.rfind('{', 0, pattern_index)
            if record_start == -1:
                print("Could not find start of actor record")
                return None
            
            # Find the end of the actor record (count braces)
            brace_count = 0
            record_end = record_start
            
            for i in range(record_start, len(content)):
                char = content[i]
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        record_end = i + 1
                        break
            
            if brace_count != 0:
                print("Could not find complete actor record")
                return None
            
            # Extract and parse the actor record
            actor_json = content[record_start:record_end]
            print(f"Extracted actor record ({len(actor_json)} characters)")
            
            try:
                actor_data = json.loads(actor_json)
                return actor_data
            except json.JSONDecodeError as e:
                print(f"Failed to parse extracted actor record: {e}")
                return None
                
        except Exception as e:
            print(f"Error reading save file: {e}")
            return None


    def find_actor_by_names(self, save_data: Dict, first_name: str, last_name: str) -> Optional[Dict]:
        """
        Find an actor record in the save data by first and last name.
        
        Args:
            save_data: The parsed save file data
            first_name: First name to search for
            last_name: Last name to search for
            
        Returns:
            The actor record if found, None otherwise
        """
        # First, try to get IDs by name
        first_name_id = self.get_id_by_name(first_name)
        last_name_id = self.get_id_by_name(last_name)
        
        if not first_name_id or not last_name_id:
            print(f"Could not find name IDs for '{first_name}' or '{last_name}'")
            return None
        
        print(f"Searching for actor: {first_name} {last_name}")
        print(f"Name IDs: {first_name_id} (first), {last_name_id} (last)")
        
        # Search through the save data for matching actors
        # The structure seems to be an array of TalentData objects
        if isinstance(save_data, list):
            actors = save_data
        elif isinstance(save_data, dict):
            # If it's a dict, look for common keys that might contain actor data
            actors = []
            for key, value in save_data.items():
                if isinstance(value, list) and value and isinstance(value[0], dict):
                    # Check if this looks like actor data
                    if '$type' in value[0] and 'TalentData' in value[0].get('$type', ''):
                        actors.extend(value)
                        break
        else:
            print("Unexpected save data format")
            return None
        
        # Search for matching actor
        for actor in actors:
            if (actor.get('firstNameId') == first_name_id and 
                actor.get('lastNameId') == last_name_id):
                return actor
        
        return None
    
    def format_save_file(self, input_path: str, output_path: str = None) -> str:
        """
        Format a save file with proper JSON indentation for easier reading and debugging.
        
        Args:
            input_path: Path to the input save file
            output_path: Path for the formatted output file (optional)
            
        Returns:
            Path to the formatted file
        """
        if output_path is None:
            # Generate output path by adding '_formatted' before the extension
            path_parts = input_path.rsplit('.', 1)
            if len(path_parts) == 2:
                output_path = f"{path_parts[0]}_formatted.{path_parts[1]}"
            else:
                output_path = f"{input_path}_formatted"
        
        try:
            print(f"Formatting save file: {input_path}")
            
            # Read the save file (handle UTF-8 BOM)
            try:
                with open(input_path, 'r', encoding='utf-8-sig') as f:
                    data = json.load(f)
            except UnicodeDecodeError:
                # Fallback to regular utf-8 if utf-8-sig fails
                with open(input_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            
            # Write it back with proper formatting
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            formatted_size = Path(output_path).stat().st_size
            print(f"Formatted file saved as: {output_path}")
            print(f"Formatted file size: {formatted_size:,} bytes ({formatted_size / (1024*1024):.1f} MB)")
            
            return output_path
            
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in save file {input_path}")
            print(f"JSON Error details: {e}")
            raise
        except Exception as e:
            print(f"Error formatting save file: {e}")
            raise

    def load_save_file(self, save_file_path: str) -> Dict:
        """Load and parse a save file."""
        try:
            print(f"Loading save file: {save_file_path}")
            file_size = Path(save_file_path).stat().st_size
            print(f"File size: {file_size:,} bytes ({file_size / (1024*1024):.1f} MB)")
            
            if file_size > 100 * 1024 * 1024:  # 100MB threshold
                print("Warning: Large file detected. This may take some time...")
            
            with open(save_file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Error: Could not find save file {save_file_path}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON in save file {save_file_path}")
            print(f"JSON Error details: {e}")
            print("This might be due to:")
            print("- Incomplete/truncated file")
            print("- Non-standard JSON format")
            print("- File corruption")
            sys.exit(1)
        except MemoryError:
            print(f"Error: File too large to load into memory")
            print("Consider using a smaller sample or implementing streaming JSON parsing")
            sys.exit(1)


def main():
    """Main function to demonstrate the actor finder."""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Search for actor: python actor_finder.py <save_file> <first_name> <last_name>")
        print("  Format save file: python actor_finder.py format <save_file> [output_file]")
        print("  Get name IDs: python actor_finder.py getid <first_name> <last_name>")
        print()
        print("Examples:")
        print("  python actor_finder.py docs/sample_save_actor_data.json Mary Ramos")
        print("  python actor_finder.py format docs/full_sample_savefile.json")
        print("  python actor_finder.py getid Bessie Patterson")
        sys.exit(1)
    
    # Check if this is a format command
    if sys.argv[1] == "format":
        if len(sys.argv) < 3:
            print("Error: Format command requires an input file")
            print("Usage: python actor_finder.py format <input_file> [output_file]")
            sys.exit(1)
        
        input_file = sys.argv[2]
        output_file = sys.argv[3] if len(sys.argv) > 3 else None
        
        finder = ActorFinder()
        try:
            formatted_path = finder.format_save_file(input_file, output_file)
            print(f"\nSuccess! Formatted save file created at: {formatted_path}")
            print("You can now use this formatted file for easier searching and debugging.")
        except Exception as e:
            print(f"Failed to format file: {e}")
            sys.exit(1)
        return
    
    # Check if this is a getid command
    if sys.argv[1] == "getid":
        if len(sys.argv) != 4:
            print("Error: GetID command requires first and last name")
            print("Usage: python actor_finder.py getid <first_name> <last_name>")
            sys.exit(1)
        
        first_name = sys.argv[2]
        last_name = sys.argv[3]
        
        finder = ActorFinder()
        
        # Get all IDs for the first name
        first_name_ids = []
        last_name_ids = []
        names = finder.character_names['names']
        
        for i, name in enumerate(names):
            if name == first_name:
                first_name_ids.append(i)
            if name == last_name:
                last_name_ids.append(i)
        
        print(f"Name ID lookup for: {first_name} {last_name}")
        print(f"First name '{first_name}' found at IDs: {first_name_ids}")
        print(f"Last name '{last_name}' found at IDs: {last_name_ids}")
        
        if first_name_ids and last_name_ids:
            print(f"\nPossible combinations:")
            for f_id in first_name_ids:
                for l_id in last_name_ids:
                    print(f"  firstNameId: \"{f_id}\", lastNameId: \"{l_id}\"")
        else:
            if not first_name_ids:
                print(f"Warning: '{first_name}' not found in character names")
            if not last_name_ids:
                print(f"Warning: '{last_name}' not found in character names")
        
        return
    
    # Regular actor search
    if len(sys.argv) != 4:
        print("Error: Actor search requires exactly 3 arguments")
        print("Usage: python actor_finder.py <save_file> <first_name> <last_name>")
        sys.exit(1)
    
    save_file = sys.argv[1]
    first_name = sys.argv[2]
    last_name = sys.argv[3]
    
    # Initialize the finder
    finder = ActorFinder()
    
    # Check file size to determine which method to use
    file_size = Path(save_file).stat().st_size
    print(f"File size: {file_size:,} bytes ({file_size / (1024*1024):.1f} MB)")
    
    if file_size > 5 * 1024 * 1024:  # 5MB threshold
        print("Large file detected, using targeted search method...")
        actor = finder.find_actor_by_names_in_large_file(save_file, first_name, last_name)
    else:
        print("Small file, loading entire file...")
        save_data = finder.load_save_file(save_file)
        actor = finder.find_actor_by_names(save_data, first_name, last_name)
    
    if actor:
        print(f"\n=== Found actor: {first_name} {last_name} ===")
        print(f"Actor ID: {actor.get('id')}")
        print(f"Portrait ID: {actor.get('portraitBaseId')}")
        print(f"Gender: {'Female' if actor.get('gender') == 1 else 'Male' if actor.get('gender') == 0 else 'Unknown'}")
        print(f"Birth Date: {actor.get('birthDate')}")
        print(f"Death Date: {actor.get('deathDate') if actor.get('deathDate') != '01-01-0001' else 'Alive'}")
        print(f"Studio: {actor.get('studioId') or 'None (unemployed)'}")
        print(f"Nationality: {actor.get('nationality', 'Unknown')}")
        
        # Show professional info
        professions = actor.get('professions', {})
        if professions:
            print(f"Acting Skill: {professions.get('Actor', 'N/A')}")
        
        print(f"Mood: {actor.get('mood', 'N/A')}")
        print(f"Attitude: {actor.get('attitude', 'N/A')}")
        print(f"Self Esteem: {actor.get('selfEsteem', 'N/A')}")
        print(f"XP: {actor.get('xp', 'N/A')}")
        
        # Show contract info
        contract = actor.get('contract')
        if contract:
            print(f"Current Contract: {contract.get('contractType')} movies, ${contract.get('initialFee', 'N/A')} fee")
        else:
            print("Current Contract: None")
        
        # Show movie history
        movies = actor.get('movies', {}).get('Actor', [])
        if movies:
            print(f"Movies ({len(movies)}): {movies}")
        else:
            print("Movies: None")
        
        # Show labels/traits
        labels = actor.get('labels', [])
        if labels:
            print(f"Labels: {labels}")
        
        # Show recent tags
        recent_tags = actor.get('recentTagsNEW', [])
        if recent_tags:
            print("Recent Roles:")
            for tag in recent_tags[:5]:  # Show first 5
                print(f"  - {tag.get('id', 'Unknown')} (value: {tag.get('value', 'N/A')})")
            
    else:
        print(f"\nActor '{first_name} {last_name}' not found in the save file.")


if __name__ == "__main__":
    main()
