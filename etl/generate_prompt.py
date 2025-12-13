import csv

input_file = '/home/aditya/workhub/f1pedia/F1/constructors.csv'
output_file = '/home/aditya/.gemini/antigravity/brain/e324d468-11b4-4a8d-94e0-8eb3142458fd/perplexity_prompt.txt'

unique_names = set()

# Read CSV
with open(input_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        unique_names.add(row['name'])

# Create Prompt
prompt = "Find the official logos for the following Formula 1 teams. Please provide the image URL for the highest quality logo available for each team. Return the data in a JSON format with keys: 'team_name' and 'logo_url'.\n\nTeams:\n"
for name in sorted(list(unique_names)):
    prompt += f"- {name}\n"

# Write to file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(prompt)

print(f"Prompt generated with {len(unique_names)} teams.")
