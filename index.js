// Funding data with more entries for shuffling
const fundingData = [
    { id: 1, title: "Innovation Fund Denmark", description: "Best aligned grant based on answers", amount: "€500K - €2M" },
    { id: 2, title: "EU Horizon Europe", description: "Strong fit; slightly narrower scope", amount: "€1M - €5M" },
    { id: 3, title: "Nordic Innovation", description: "Requires extra eligibility check", amount: "€200K - €1M" },
    { id: 4, title: "Danish Growth Fund", description: "Good fit with specific requirements", amount: "€300K - €1.5M" },
    { id: 5, title: "Vækstfonden", description: "Possible match with modifications", amount: "€100K - €800K" },
    { id: 6, title: "Realdania Foundation", description: "Sustainable development focus", amount: "€400K - €1.2M" },
    { id: 7, title: "Carlsberg Foundation", description: "Research and innovation grants", amount: "€250K - €1M" },
    { id: 8, title: "AP Møller Foundation", description: "Technology and entrepreneurship", amount: "€600K - €2.5M" },
    { id: 9, title: "Ny Carlsberg Foundation", description: "Arts and culture funding", amount: "€150K - €500K" },
    { id: 10, title: "Lolland Development Fund", description: "Regional development initiatives", amount: "€200K - €800K" }
];

// Sub-industry options based on main industry
const subIndustries = {
    technology: [
        "Software Development",
        "Artificial Intelligence",
        "Cybersecurity",
        "Fintech",
        "E-commerce",
        "Mobile Apps",
        "Cloud Computing",
        "IoT",
        "Blockchain"
    ],
    healthcare: [
        "Medical Devices",
        "Pharmaceuticals",
        "Digital Health",
        "Biotechnology",
        "Telemedicine",
        "Mental Health",
        "Preventive Care",
        "Medical Research"
    ],
    finance: [
        "Banking",
        "Insurance",
        "Investment",
        "Payment Solutions",
        "Cryptocurrency",
        "Financial Planning",
        "Trading",
        "Lending"
    ],
    manufacturing: [
        "Automotive",
        "Electronics",
        "Textiles",
        "Food & Beverage",
        "Chemicals",
        "Machinery",
        "Aerospace",
        "Pharmaceuticals"
    ],
    energy: [
        "Renewable Energy",
        "Solar Power",
        "Wind Energy",
        "Battery Storage",
        "Nuclear",
        "Oil & Gas",
        "Energy Efficiency",
        "Smart Grid"
    ],
    agriculture: [
        "Crop Production",
        "Livestock",
        "Agricultural Technology",
        "Organic Farming",
        "Food Processing",
        "Aquaculture",
        "Precision Agriculture",
        "Agricultural Equipment"
    ],
    education: [
        "Online Learning",
        "Educational Technology",
        "Vocational Training",
        "Language Learning",
        "Corporate Training",
        "Early Childhood",
        "Higher Education",
        "Special Education"
    ],
    retail: [
        "Fashion",
        "Electronics",
        "Grocery",
        "E-commerce",
        "Luxury Goods",
        "Home & Garden",
        "Beauty & Personal Care",
        "Sports & Recreation"
    ],
    transportation: [
        "Automotive",
        "Public Transit",
        "Logistics",
        "Shipping",
        "Aviation",
        "Railway",
        "Ride Sharing",
        "Freight"
    ],
    construction: [
        "Residential",
        "Commercial",
        "Infrastructure",
        "Renovation",
        "Green Building",
        "Construction Technology",
        "Architecture",
        "Engineering"
    ]
};

function initializeForm() {
    const industrySelect = document.getElementById('answer-industry');
    const subIndustrySelect = document.getElementById('answer-subindustry');
    
    industrySelect.addEventListener('change', function() {
        const selectedIndustry = this.value;
        
        subIndustrySelect.innerHTML = '<option value="">Select sub-industry...</option>';
        
        if (selectedIndustry && subIndustries[selectedIndustry]) {
            subIndustrySelect.disabled = false;
            
            subIndustries[selectedIndustry].forEach(subIndustry => {
                const option = document.createElement('option');
                option.value = subIndustry.toLowerCase().replace(/\s+/g, '-');
                option.textContent = subIndustry;
                subIndustrySelect.appendChild(option);
            });
        } else {
            subIndustrySelect.disabled = true;
        }
    });
}

tdocument.addEventListener('DOMContentLoaded', initializeForm);