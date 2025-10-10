# Uses embedding similarity to rank grants

import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
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


class GrantMatcher:
    def __init__(self, grants_data):
        """
        Initialize the grant matcher with a list of grant dictionaries.
        
        Args:
            grants_data: List of grant dictionaries in the JSON format you provided
        """

        print(f"Type of grants_data: {type(grants_data)}")
        print(f"Length: {len(grants_data)}")
        if grants_data:
            print(f"Type of first item: {type(grants_data[0])}")
            print(f"First item preview: {grants_data[0]}")


        self.grants = grants_data
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
        # Create searchable text for each grant
        self.grant_texts = [self._create_grant_text(grant) for grant in self.grants]
        
        # Pre-compute grant vectors
        self.grant_vectors = self.vectorizer.fit_transform(self.grant_texts)
    
    def _create_grant_text(self, grant):
        """Combine all relevant grant fields into one searchable string."""
        
        print(f"Type of grant parameter: {type(grant)}")
        if isinstance(grant, list):
            print(f"ERROR: grant is a list! Contents: {grant[:2] if len(grant) > 0 else grant}")
        
        
        parts = [
            grant.get('fund_name', ''),
            grant.get('summary', ''),
            ' '.join(grant.get('eligible_applicants', [])),
            ' '.join(grant.get('activity_types', [])),
            grant.get('category', {}).get('main_category', ''),
            ' '.join(grant.get('category', {}).get('sub_categories', []))
        ]
        return ' '.join(parts)
    
    def find_matching_grants(self, company_description, top_n=5):
        """
        Find the best matching grants for a company.
        
        Args:
            company_description: String describing the company and funding needs
            top_n: Number of top matches to return
            
        Returns:
            List of tuples: (grant_dict, similarity_score)
        """
        # Convert company description to vector
        company_vector = self.vectorizer.transform([company_description])
        
        # Calculate similarity scores
        scores = cosine_similarity(company_vector, self.grant_vectors)[0]
        
        # Get top N indices
        top_indices = scores.argsort()[-top_n:][::-1]
        
        # Return grants with their scores
        results = [
            (self.grants[i], float(scores[i]))
            for i in top_indices
        ]
        
        return results


# Example usage
if __name__ == "__main__":
    # Sample grants (you'd load your full dataset here)
    sample_grants = grant_compiler('./funding_database')
    
    # Initialize matcher
    matcher = GrantMatcher(sample_grants)
    
    # Example company descriptions
    company_desc_1 = "We are an e-commerce startup selling handmade crafts online. We need funding for marketing campaigns and hiring our first employees."
    
    company_desc_2 = "Our company develops AI-powered software for healthcare diagnostics. We're looking for funding to support our research and product development."
    
    company_desc_3 = "We build self-watering plant pots for businesses and customers. It uses AI and IoT to cut maintence costs for gardeners. We are looking for funding for salaries, development, and scaling"

    # Find matches
    print("=" * 60)
    print("COMPANY 1: E-commerce startup")
    print("=" * 60)
    matches_1 = matcher.find_matching_grants(company_desc_1, top_n=3)
    for grant, score in matches_1:
        print(f"\nMatch Score: {score:.3f}")
        print(f"Grant: {grant['fund_name']}")
        print(f"Summary: {grant['summary'][:100]}...")
    
    print("\n" + "=" * 60)
    print("COMPANY 2: AI healthcare startup")
    print("=" * 60)
    matches_2 = matcher.find_matching_grants(company_desc_2, top_n=3)
    for grant, score in matches_2:
        print(f"\nMatch Score: {score:.3f}")
        print(f"Grant: {grant['fund_name']}")
        print(f"Summary: {grant['summary'][:100]}...")

    print("\n" + "=" * 60)
    print("COMPANY 3: Navera")
    print("=" * 60)
    matches_2 = matcher.find_matching_grants(company_desc_3, top_n=3)
    for grant, score in matches_2:
        print(f"\nMatch Score: {score:.3f}")
        print(f"Grant: {grant['fund_name']}")
        print(f"Summary: {grant['summary'][:100]}...")