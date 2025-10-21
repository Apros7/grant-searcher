let allGrants = [];
let categoryData = null;

async function initializeApp() {
    // Load grants
    allGrants = await window.grantMatcher.loadGrants();
    console.log(`Loaded ${allGrants.length} grants`);
    
    // Extract categories from grants
    const categoryMap = await window.grantMatcher.extractCategories(allGrants);
    categoryData = window.grantMatcher.getCategoryLists(categoryMap);
    
    console.log('Available categories:', categoryData);
    
    // Populate the dropdowns with real data
    populateMainCategories();
    
    // Set up form listeners
    initializeForm();
    
    // Add event listeners for live updates
    document.getElementById('answer-industry').addEventListener('change', updateRankings);
    document.getElementById('answer-subindustry').addEventListener('change', updateRankings);
}

function populateMainCategories() {
    const industrySelect = document.getElementById('answer-industry');
    
    // Clear existing options except the first one
    industrySelect.innerHTML = '<option value="">Select industry...</option>';
    
    // Add all main categories from grants
    categoryData.mainCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        industrySelect.appendChild(option);
    });
}

function initializeForm() {
    const industrySelect = document.getElementById('answer-industry');
    const subIndustrySelect = document.getElementById('answer-subindustry');
    
    industrySelect.addEventListener('change', function() {
        const selectedIndustry = this.value;
        
        // Clear sub-industry dropdown
        subIndustrySelect.innerHTML = '<option value="">Select sub-industry...</option>';
        
        if (selectedIndustry) {
            // Find the main category (case-insensitive match)
            const mainCategory = categoryData.mainCategories.find(
                cat => cat.toLowerCase() === selectedIndustry
            );
            
            if (mainCategory && categoryData.subCategoriesByMain[mainCategory]) {
                subIndustrySelect.disabled = false;
                
                // Populate with actual sub-categories from grants
                categoryData.subCategoriesByMain[mainCategory].forEach(subCat => {
                    const option = document.createElement('option');
                    option.value = subCat.toLowerCase();
                    option.textContent = subCat;
                    subIndustrySelect.appendChild(option);
                });
            } else {
                subIndustrySelect.disabled = true;
            }
        } else {
            subIndustrySelect.disabled = true;
        }
    });
}

async function updateRankings() {
    const industry = document.getElementById('answer-industry').value;
    const subIndustry = document.getElementById('answer-subindustry').value;
    
    if (!industry) return;
    
    // Find the actual main category name (preserve original casing)
    const mainCategory = categoryData.mainCategories.find(
        cat => cat.toLowerCase() === industry
    ) || industry;
    
    // Find actual sub-category names
    const subCategories = [];
    if (subIndustry && categoryData.subCategoriesByMain[mainCategory]) {
        const subCat = categoryData.subCategoriesByMain[mainCategory].find(
            cat => cat.toLowerCase() === subIndustry
        );
        if (subCat) {
            subCategories.push(subCat);
        }
    }
    
    const query = {
        category: {
            main_category: mainCategory,
            sub_categories: subCategories
        }
    };
    
    console.log('Searching for:', query);
    
    // Get ranked results
    const rankedGrants = await window.grantMatcher.rankMatch(allGrants, query);
    
    console.log('Top matches:', rankedGrants.slice(0, 5));
    
    // Update the UI
    updateRankingDisplay(rankedGrants);
    updatePicksDisplay(rankedGrants);
}

function updateRankingDisplay(rankedGrants) {
    const ranking = document.querySelector('.ranking');
    
    // Keep the header
    let html = '<div class="ranking-header">Live Ranking</div>';
    
    // Add top 5 grants
    for (let i = 0; i < Math.min(5, rankedGrants.length); i++) {
        const result = rankedGrants[i];
        const grant = result.grant;
        
        html += `
            <div class="rank-box">
                <div class="rank-number">#${i + 1}</div>
                <div class="rank-content">
                    <div class="rank-title">${grant.fund_name}</div>
                    <div class="rank-desc">Score: ${result.score} - ${grant.summary.substring(0, 60)}...</div>
                </div>
            </div>
        `;
    }
    
    ranking.innerHTML = html;
}

function updatePicksDisplay(rankedGrants) {
    const topTier = document.querySelector('.top-tier');
    const otherPicks = document.querySelector('.other-picks');
    
    // Update top 3 (gold, silver, bronze)
    if (rankedGrants.length >= 3) {
        topTier.innerHTML = `
            <div class="pick-card silver">
                <div class="pick-number">#2</div>
                <div class="pick-content">
                    <div class="pick-title">${rankedGrants[1].grant.fund_name}</div>
                    <div class="pick-desc">Score: ${rankedGrants[1].score}</div>
                </div>
            </div>
            <div class="pick-card gold">
                <div class="pick-number">#1</div>
                <div class="pick-content">
                    <div class="pick-title">${rankedGrants[0].grant.fund_name}</div>
                    <div class="pick-desc">Score: ${rankedGrants[0].score}</div>
                </div>
            </div>
            <div class="pick-card bronze">
                <div class="pick-number">#3</div>
                <div class="pick-content">
                    <div class="pick-title">${rankedGrants[2].grant.fund_name}</div>
                    <div class="pick-desc">Score: ${rankedGrants[2].score}</div>
                </div>
            </div>
        `;
    }
    
    // Update ranks 4-10
    let otherHtml = '';
    for (let i = 3; i < Math.min(10, rankedGrants.length); i++) {
        const result = rankedGrants[i];
        otherHtml += `
            <div class="pick-card">
                <div class="pick-number">#${i + 1}</div>
                <div class="pick-content">
                    <div class="pick-title">${result.grant.fund_name}</div>
                    <div class="pick-desc">Score: ${result.score}</div>
                </div>
            </div>
        `;
    }
    otherPicks.innerHTML = otherHtml;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeApp);