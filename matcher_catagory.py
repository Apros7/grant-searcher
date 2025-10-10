# extract main catagories
# extract sub catagories



import json
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
import os
from pathlib import Path

def grant_compiler(folder_path):
    grants = []
    
    folder = Path(folder_path)
    json_files = folder.glob('*.json')

    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                if not content.strip():
                    print(f"Warning: Skipping empty file: {json_file.name}")
                    continue
                
                data = json.loads(content)
                
                # Check if it's a list or a single object
                if isinstance(data, list):
                    print(f"Warning: {json_file.name} contains a list. Extracting items...")
                    grants.extend(data)  # Add all items from the list
                elif isinstance(data, dict):
                    grants.append(data)  # Add single grant
                else:
                    print(f"Warning: {json_file.name} has unexpected format (not dict or list)")
                
        except json.JSONDecodeError as e:
            print(f"Error: Could not parse {json_file.name}: {e}")
            continue
        except Exception as e:
            print(f"Error reading {json_file.name}: {e}")
            continue
    
    print(f"\nSuccessfully loaded {len(grants)} grants from {folder_path}")
    return grants



def analyze_categories(grants):
    """Analyze the distribution of categories across all grants."""
    from collections import Counter
    
    main_categories = []
    sub_categories = []
    
    # Collect all categories
    for grant in grants:
        category = grant.get('category', {})
        
        # Get main category
        main_cat = category.get('main_category', '')
        if main_cat:
            main_categories.append(main_cat)
        
        # Get sub categories
        sub_cats = category.get('sub_categories', [])
        sub_categories.extend(sub_cats)
    
    # Count occurrences
    main_counter = Counter(main_categories)
    sub_counter = Counter(sub_categories)
    
    # Print analysis
    print("=" * 70)
    print("CATEGORY ANALYSIS")
    print("=" * 70)
    
    print(f"\nTotal grants analyzed: {len(grants)}")
    
    print(f"\n--- MAIN CATEGORIES ---")
    print(f"Unique main categories: {len(main_counter)}")
    print(f"Total main category assignments: {len(main_categories)}")
    print(f"\nDistribution (sorted by frequency):")
    for category, count in main_counter.most_common():
        print(f"  {category}: {count} grants")
    
    print(f"\n--- SUB CATEGORIES ---")
    print(f"Unique sub categories: {len(sub_counter)}")
    print(f"Total sub category assignments: {len(sub_categories)}")
    print(f"\nTop 20 most common sub categories:")
    for category, count in sub_counter.most_common(20):
        print(f"  {category}: {count} grants")
    
    # Analysis summary
    print(f"\n--- SUMMARY ---")
    if len(main_counter) == len(grants):
        print("⚠️  WARNING: Each grant has a unique main category!")
        print("   This suggests over-categorization or poor grouping.")
    elif len(main_counter) < len(grants) / 2:
        print("✓  Main categories seem well-distributed.")
    else:
        print("⚠️  Main categories might be too fragmented.")
    
    print(f"\nAverage grants per main category: {len(grants) / len(main_counter):.1f}")
    print(f"Average sub-categories per grant: {len(sub_categories) / len(grants):.1f}")
    
    return {
        'main_categories': main_counter,
        'sub_categories': sub_counter
    }




# # Add this to your main code:
# if __name__ == "__main__":
#     # Load grants
#     sample_grants = grant_compiler('./funding_database')
    
#     if not sample_grants:
#         print("Error: No grants were loaded.")
#         exit(1)
    
#     print(f"Loaded {len(sample_grants)} grants successfully!\n")
    
#     # ANALYZE CATEGORIES FIRST
#     category_stats = analyze_categories(sample_grants)
    
#     # Then continue with matching if categories look good
#     # matcher = GrantMatcher(sample_grants)
#     # ...



case1 = ['Agnostic',['hllo']]
case2 = ['Manufacturing',['General Innovation', 'Sustainable Manufacturing', 'Artificial Intelligence']]


def score_match(grant_cats, case_cats):
    for grant in grants:
        category = grant.get('category', {})
        
        # Get main category
        main_cat = category.get('main_category', '')
        if main_cat:
            main_categories.append(main_cat)
        
        # Get sub categories
        sub_cats = category.get('sub_categories', [])
        sub_categories.extend(sub_cats)

    if case_cats[0] == 'Agnostic':
        return 1
    elif grant_cats == case_cats:
        sum = 0
        for i in grant_cats[1]:
            for j in case_cats[1]:
                if j == i:
                    sum += 1
        return sum
    else:
        return 0
    



# compare the grants with the cases and give each one a score on compatibility
def cat_match(grants_cats, case_cats):
    # make an array to store the scores of all the grants
    grant_scores = []

    # for each grant in grant scores, score it



def match_grants_by_category(grants, user_main, user_subs, top_n=15):
    """Match grants by category. Returns list of (grant, score) tuples."""
    scores = []
    for grant in grants:
        cat = grant.get('category', {})
        main, subs = cat.get('main_category', ''), cat.get('sub_categories', [])
        
        # Score main category
        if user_main.lower() == main.lower():
            n = sum(1 for us in user_subs if us.lower() in [s.lower() for s in subs])
            score = 1 + n
        elif main.lower() == 'agnostic':
            score = 1
        else:
            score = 0
        
        if score > 0:
            scores.append((grant, score))
    return sorted(scores, key=lambda x: x[1], reverse=True)[:top_n]



# Test cases for different categories

test_startups = [
    # Technology startups
    ("Technology", ["Artificial Intelligence", "Software Development"], 
     "AI-powered healthcare diagnostics platform"),
    
    ("Technology", ["Robotics", "Manufacturing"], 
     "Industrial automation robotics for factories"),
    
    ("Technology", ["Software Development", "Energy Management Software"], 
     "Smart building energy optimization software"),
    
    # Environment & Sustainability
    ("Environment & Sustainability", ["Renewable Energy", "Energy Efficiency"], 
     "Solar panel installation for residential buildings"),
    
    ("Environment & Sustainability", ["Green Building", "Sustainable Manufacturing"], 
     "Eco-friendly construction materials startup"),
    
    # Energy
    ("Energy", ["Renewable Energy", "Energy Efficiency"], 
     "Wind farm development company"),
    
    ("Energy", ["Energy Management Software", "Smart Cities"], 
     "Grid optimization AI platform"),
    
    # Healthcare
    ("Healthcare", ["Digital Health", "Medical Devices"], 
     "Wearable health monitoring devices"),
    
    ("Healthcare", ["Biotechnology", "Medical Devices"], 
     "Gene therapy research startup"),
    
    # Construction
    ("Construction", ["Green Building", "Smart Cities"], 
     "Sustainable urban housing developer"),
    
    # Manufacturing
    ("Manufacturing", ["Sustainable Manufacturing", "Robotics"], 
     "Automated recycling systems manufacturer"),
    
    # Transportation
    ("Transportation", ["Energy Efficiency", "Smart Cities"], 
     "Electric vehicle charging network"),
    
    # Education
    ("Education", ["Software Development", "Digital Health"], 
     "Online learning platform for medical students"),
    
    # Retail
    ("Retail", ["Software Development", "Artificial Intelligence"], 
     "E-commerce personalization AI"),
    
    # Arts & Culture
    ("Arts & Culture", ["Digital Health", "Software Development"], 
     "Digital art gallery platform"),
    
    # Agnostic/Multi-category (should match Agnostic grants)
    ("Technology", ["General Innovation", "Cross-Industry Collaboration"], 
     "Platform connecting innovators across industries"),
]

# Run tests
if __name__ == "__main__":
    grants = grant_compiler('./funding_database')
    
    for user_main, user_subs, description in test_startups:
        print("\n" + "=" * 70)
        print(f"STARTUP: {description}")
        print(f"Main: {user_main} | Subs: {user_subs}")
        print("-" * 70)
        
        matches = match_grants_by_category(grants, user_main, user_subs, top_n=3)
        
        if matches:
            for grant, score in matches:
                grant_cat = grant.get('category', {})
                print(f"\nScore: {score} | {grant['fund_name']}")
                print(f"  Grant categories: {grant_cat.get('main_category')} - {grant_cat.get('sub_categories', [])[:3]}")
        else:
            print("  No matches found!")




if __name__ == "__main__":

    grants = grant_compiler('./funding_database')
    # analyze_categories(grants)
    n = 3
    print()
    print(test_startups[n][2])
    matches = match_grants_by_category(grants, test_startups[n][0],test_startups[n][1], top_n=5)
    
    for grant, score in matches:
        print(f"\nScore: {score} | {grant['fund_name']} | {grant['summary']}")