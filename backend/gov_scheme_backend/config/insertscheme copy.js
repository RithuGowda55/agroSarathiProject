const connectDB = require("./dbscheme");
const Scheme = require("../models/Scheme");

const schemes = [
  {
    schemeName: "Fertilizer Subsidy Scheme",
    description:
      "A subsidy scheme for farmers to reduce the cost of fertilizers.",
    state: "Bihar",
    cropType: "Paddy",
    incomeLevel: "Low",
    eligibility: "Farmers who purchase fertilizers for crop production.",
    amount: 3000,
    applicationDeadline: new Date("2024-11-15T00:00:00Z"),
    contact: "+91 9209876543",
    website: "https://fertilizersubsidy.gov.in",
  },
  {
    schemeName: "Rural Agricultural Work Experience (RAWE)",
    description:
      "An initiative for providing agricultural work experience to students.",
    state: "Maharashtra",
    cropType: "Groundnut",
    incomeLevel: "Medium",
    eligibility: "Agricultural students seeking practical exposure.",
    amount: 1500,
    applicationDeadline: new Date("2024-12-01T00:00:00Z"),
    contact: "+91 9134567895",
    website: "https://rawe.gov.in",
  },
  {
    schemeName: "National Bee Board Scheme",
    description:
      "A scheme to promote beekeeping as a sustainable livelihood option.",
    state: "Uttarakhand",
    cropType: "Honey",
    incomeLevel: "Medium",
    eligibility: "Farmers and individuals interested in beekeeping.",
    amount: 12000,
    applicationDeadline: new Date("2024-12-10T00:00:00Z"),
    contact: "+91 9198765432",
    website: "https://nbb.gov.in",
  },
  {
    schemeName: "Bamboo Development Scheme",
    description: "A scheme for promoting bamboo cultivation and processing.",
    state: "Nagaland",
    cropType: "Bamboo",
    incomeLevel: "Medium",
    eligibility: "Farmers interested in bamboo cultivation.",
    amount: 20000,
    applicationDeadline: new Date("2024-10-30T00:00:00Z"),
    contact: "+91 9123456787",
    website: "https://bamboo.gov.in",
  },
  {
    schemeName: "Solar Pumping Scheme",
    description: "A subsidy for farmers to install solar pumps for irrigation.",
    state: "Madhya Pradesh",
    cropType: "Cotton",
    incomeLevel: "Low",
    eligibility: "Farmers with limited access to electricity.",
    amount: 50000,
    applicationDeadline: new Date("2024-11-25T00:00:00Z"),
    contact: "+91 9301234567",
    website: "https://solarpumpscheme.gov.in",
  },
  {
    schemeName: "Pradhan Mantri Annadata Aay SanraksHan Abhiyan",
    description: "A scheme to ensure a fair minimum price for farm produce.",
    state: "Uttar Pradesh",
    cropType: "Sugarcane",
    incomeLevel: "Medium",
    eligibility: "Farmers engaged in sugarcane farming.",
    amount: 10000,
    applicationDeadline: new Date("2024-12-12T00:00:00Z"),
    contact: "+91 9112345678",
    website: "https://pmkisan.gov.in",
  },
  {
    schemeName: "Swachh Bharat Mission (Gramin)",
    description:
      "A mission to improve sanitation and promote cleanliness in rural areas.",
    state: "Tamil Nadu",
    cropType: "Vegetables",
    incomeLevel: "Low",
    eligibility: "Rural communities and farmers focused on cleanliness.",
    amount: 3000,
    applicationDeadline: new Date("2024-11-20T00:00:00Z"),
    contact: "+91 9178901234",
    website: "https://swachhbharatmission.gov.in",
  },
  {
    schemeName:
      "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
    description:
      "A rural employment guarantee scheme to provide job opportunities.",
    state: "West Bengal",
    cropType: "Rice",
    incomeLevel: "Low",
    eligibility: "Rural unemployed individuals looking for work.",
    amount: 2000,
    applicationDeadline: new Date("2024-12-01T00:00:00Z"),
    contact: "+91 9283456789",
    website: "https://mgnrega.nic.in",
  },
  {
    schemeName: "Pradhan Mantri Kisan Samman Nidhi Yojana (PM-KISAN)",
    description:
      "A scheme to provide financial assistance to small and marginal farmers.",
    state: "Kerala",
    cropType: "Coconut",
    incomeLevel: "Low",
    eligibility: "Small farmers owning less than 2 hectares of land.",
    amount: 6000,
    applicationDeadline: new Date("2024-12-31T00:00:00Z"),
    contact: "+91 9887654321",
    website: "https://pmkisan.gov.in",
  },
  {
    schemeName: "Mission Organic Value Chain Development in North East Region",
    description:
      "A scheme to promote organic farming in the North East region.",
    state: "Assam",
    cropType: "Organic Tea",
    incomeLevel: "Medium",
    eligibility: "Farmers interested in organic tea farming.",
    amount: 25000,
    applicationDeadline: new Date("2024-11-30T00:00:00Z"),
    contact: "+91 9223456781",
    website: "https://movcdner.gov.in",
  },
  {
    schemeName: "National Mission for Sustainable Agriculture",
    description:
      "A scheme aimed at promoting sustainable agricultural practices.",
    state: "Odisha",
    cropType: "Groundnut",
    incomeLevel: "Low",
    eligibility: "Farmers engaged in groundnut cultivation.",
    amount: 5000,
    applicationDeadline: new Date("2024-11-05T00:00:00Z"),
    contact: "+91 9345678901",
    website: "https://nmsa.nic.in",
  },
  {
    schemeName: "Integrated Watershed Management Programme (IWMP)",
    description:
      "A program to restore watersheds for better water conservation.",
    state: "Rajasthan",
    cropType: "Pulses",
    incomeLevel: "Low",
    eligibility: "Farmers working in watershed areas.",
    amount: 12000,
    applicationDeadline: new Date("2024-12-10T00:00:00Z"),
    contact: "+91 9287654321",
    website: "https://iwmp.gov.in",
  },
  {
    schemeName: "Horticulture Mission for North East and Himalayan States",
    description:
      "A scheme for the development of horticulture in the North East and Himalayan regions.",
    state: "Sikkim",
    cropType: "Oranges",
    incomeLevel: "Medium",
    eligibility: "Farmers in North East and Himalayan regions.",
    amount: 15000,
    applicationDeadline: new Date("2024-12-15T00:00:00Z"),
    contact: "+91 9198765433",
    website: "https://midh.gov.in",
  },
  {
    schemeName: "National Livestock Mission",
    description: "A scheme to support the development of livestock farming.",
    state: "Haryana",
    cropType: "Dairy",
    incomeLevel: "Medium",
    eligibility: "Farmers engaged in dairy farming.",
    amount: 20000,
    applicationDeadline: new Date("2024-11-22T00:00:00Z"),
    contact: "+91 9345678905",
    website: "https://dahd.nic.in",
  },
];

const insertSchemes = async () => {
  await connectDB(); // Connect to MongoDB Atlas
  try {
    const result = await Scheme.insertMany(schemes); // Insert data
    console.log("Data inserted:", result);
  } catch (err) {
    console.error("Error inserting data:", err.message);
  }
};

insertSchemes(); // Execute the insert function
