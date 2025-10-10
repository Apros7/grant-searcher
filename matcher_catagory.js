
// load grants
async function loadGrants(){
    const fileListResponse = await fetch('file_list.json');
    const filenames = await fileListResponse.json();

    const grants = []

    for(const filename of filenames){
        try{
            const response = await fetch(`funding_database/${filename}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                console.log(`Warning: ${filename} contains an array, extracting items...`);
                grants.push(...data);  // Spread the array items
            } else if (typeof data === 'object' && data !== null) {
                grants.push(data);  // Single grant object
            } else {
                console.log(`Warning: ${filename} has unexpected format`);
            }
        
        }catch(err){
            console.error(`failed to load ${filename}:`, err);
        }
    }

    console.log(`loaded ${grants.length} grants`);
    return grants;
}

// filter grant categories
async function extractCategories(grants){
    const categoryMap = {}
    for(const grant of grants){
        const mainCat = grant.category?.main_category || 'Unknown';
        const subCats = grant.category?.sub_categories || [];

        if(!categoryMap[mainCat]){ // if the main category doesn't exist already, add it
            categoryMap[mainCat] = new Set()
        }

        for(const subCat of subCats){
            categoryMap[mainCat].add(subCat);
        }

    }
    
    // // print results
    // console.log("=== CATEGORY ANALYSIS ===");
    // for (const mainCat in categoryMap) {
    //     const subCats = Array.from(categoryMap[mainCat]);  // Convert Set to Array
    //     console.log(`\n${mainCat}:`);
    //     for (const subCat of subCats) {
    //         console.log(`  - ${subCat}`);
    //     }
    // }

    return categoryMap;
}

// returns an array of rankings for grants compared to query
async function rankMatch(grants,query){
    q_main = query.category.main_category || 'Unknown';
    q_subs = query.category?.sub_categories || [];
    results = []
    for(const grant of grants){ 
        score = 0
        grant_main = grant.category.main_category || 'Unknown';
        grant_subs = grant.category?.sub_categories || [];
        if(grant_main == q_main){ // main matches

            console.log(`main category ${q_main} matches`);
            score += 2;

            const common_subs = grant_subs.filter(item => q_subs.includes(item));
            score += common_subs.length; // count the number of matching sub catagories, and increase the score for each
    
        }else if(grant_main == 'Agnostic'){ // agnostic (match all)
            score += 1;
            console.log(`main category ${q_main} matches Agnostic`);
        }

        results.push({grant: grant, score: score});
        console.log(`grant ${grant.fund_name} scored with score ${score}`);

    }
    results.sort((a,b) => b.score - a.score);
    // console.log(results)
    return results;
}

// main

async function main() {
    const grants = await loadGrants();
    console.log(grants);
    
    const categories = extractCategories(grants);
    console.log(categories);


    const query = {
        category: {
            main_category: "Technology",
            sub_categories: ["AI", "Software Development"]
        }
    };

        
    // Get ranked results
    const rankedGrants = await rankMatch(grants, query);
    
    // Print top 5
    console.log("=== TOP 5 MATCHES ===");
    for (let i = 0; i < Math.min(5, rankedGrants.length); i++) {
        const result = rankedGrants[i];
        console.log(`\nRank ${i + 1} - Score: ${result.score}`);
        console.log(`Grant: ${result.grant.fund_name}`);
        console.log(`Category: ${result.grant.category?.main_category}`);
    }

    return rankedGrants;

}

// Call it
main();