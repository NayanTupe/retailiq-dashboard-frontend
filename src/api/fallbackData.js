// Fallback mock data and local heuristic algorithms for RetailIQ Frontend
// Used when the live FastAPI backend is sleeping or loading.

export const FALLBACK_DETAILS = {
  summary: {
    total_customers: 100000,
    total_revenue: 32224102.09,
    average_spend: 322.24,
    churn_rate: 60.21,
    average_rating: 3.56
  },
  revenue_by_city: [
    { city: "New York", revenue: 8432500.50, churn_rate: 58.4, customers: 26000 },
    { city: "Los Angeles", revenue: 7654100.20, churn_rate: 62.1, customers: 24000 },
    { city: "Chicago", revenue: 6210300.80, churn_rate: 59.8, customers: 19500 },
    { city: "Houston", revenue: 5420100.40, churn_rate: 61.5, customers: 17000 },
    { city: "Miami", revenue: 4507100.19, churn_rate: 59.1, customers: 13500 }
  ],
  membership_mix: [
    { membership_type: "Gold", customers: 21323, revenue: 12450200.50, average_spend: 583.88, average_rating: 4.12, churn_rate: 34.5 },
    { membership_type: "Silver", customers: 47380, revenue: 14820300.20, average_spend: 312.79, average_rating: 3.65, churn_rate: 58.2 },
    { membership_type: "Bronze", customers: 31297, revenue: 4953601.39, average_spend: 158.28, average_rating: 3.14, churn_rate: 80.9 }
  ],
  age_distribution: [
    { age_group: "Under 25", customers: 15430 },
    { age_group: "25-34", customers: 34210 },
    { age_group: "35-44", customers: 26840 },
    { age_group: "45-54", customers: 14520 },
    { age_group: "55-64", customers: 6800 },
    { age_group: "65+", customers: 2200 }
  ],
  churn_distribution: {
    no_churn: 39790,
    churn_risk: 60210
  },
  rating_quality: [
    { rating_group: "Normal Rating (3-5)", customers: 78500, churn_rate: 51.4 },
    { rating_group: "Low Rating (1-2)", customers: 21500, churn_rate: 92.3 }
  ],
  segments: [
    { segment_name: "High Value Customers", customers: 21323, total_revenue: 12450200.50, average_spend: 583.88, average_rating: 4.12, churn_rate: 34.5 },
    { segment_name: "Satisfied Regular Customers", customers: 47380, total_revenue: 14820300.20, average_spend: 312.79, average_rating: 3.65, churn_rate: 58.2 },
    { segment_name: "At Risk Customers", customers: 20277, total_revenue: 3500000.00, average_spend: 172.60, average_rating: 2.10, churn_rate: 89.4 },
    { segment_name: "Low Engagement Customers", customers: 11020, total_revenue: 1453601.39, average_spend: 131.90, average_rating: 2.80, churn_rate: 76.5 }
  ]
};

// Local heuristic prediction replicating the ML RandomForest behavior
export function localChurnPredict({ age, total_spend, items_purchased, average_rating }) {
  // Heuristic logic based on model features:
  // Customers are high churn-risk if they have low rating, low purchase volumes, or low spending.
  let riskScore = 50.0; // base churn probability %

  // Check satisfaction rating (heavy weight)
  if (average_rating < 2.0) {
    riskScore += 25;
  } else if (average_rating < 3.0) {
    riskScore += 10;
  } else if (average_rating >= 4.5) {
    riskScore -= 15;
  }

  // Check spend to purchase volume ratio (avg spend per item)
  const avgSpendPerItem = items_purchased > 0 ? total_spend / items_purchased : 0;
  if (avgSpendPerItem < 25) {
    riskScore += 15;
  } else if (avgSpendPerItem > 150) {
    riskScore -= 10;
  }

  // Check age correlation
  if (age > 50) {
    riskScore += 5;
  } else if (age < 25) {
    riskScore += 10;
  }

  // Check engagement (total spend & items purchased)
  if (total_spend < 100 || items_purchased <= 2) {
    riskScore += 15;
  } else if (total_spend > 1000) {
    riskScore -= 20;
  }

  // Clamp riskScore between 5.0 and 98.0
  riskScore = Math.max(5.0, Math.min(98.0, riskScore));
  riskScore = Math.round(riskScore * 100) / 100;

  const churnPrediction = riskScore >= 50.0 ? "Yes" : "No";
  let riskLevel = "Low Risk";
  if (riskScore >= 75.0) {
    riskLevel = "High Risk";
  } else if (riskScore >= 45.0) {
    riskLevel = "Medium Risk";
  }

  return {
    churn_prediction: churnPrediction,
    churn_probability: riskScore,
    risk_level: riskLevel
  };
}
