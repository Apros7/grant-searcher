# grant-searcher

Game rules:
- No AI :O

Objective:
- Simplest way to find the right danish grant option for a project/company/startup


# Usage:
Step 1. Compile your grants by runnigng compile_grants.py 
This will generate a file called `file_list.json` which will store the names of all the grants.

Step 2. The js matching code `matcher_category.js` will take this list of names and use it to load all the files into a js list. 

Step 3. Running the webpage will first find all the grant catagories and subcatagories to display for the user to choose from.
        The user can choose their catagories and will be matched with relevant grants based on catagory similarity. 