import os
import json
from pathlib import Path

# Get all JSON files
folder = Path('./funding_database')
json_files = [f.name for f in folder.glob('*.json')]

# Save list to a file
with open('file_list.json', 'w') as f:
    json.dump(json_files, f, indent=2)

print(f"Generated list of {len(json_files)} files")