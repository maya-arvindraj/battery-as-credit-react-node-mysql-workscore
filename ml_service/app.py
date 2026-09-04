from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("workscore_model.pkl")

# These are the exact 13 features used during training
FEATURES = [
    "months_on_zypp",
    "days_worked_per_month",
    "deliveries_per_month",
    "monthly_earnings_inr",
    "earnings_volatility",
    "work_consistency",
    "ev_usage_hours_per_month",
    "missed_payments",
    "on_time_payment_rate",
    "rental_months_completed",
    "loan_amount_inr",
    "loan_term_months",
    "monthly_emi_inr"
]


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "model": "Random Forest",
        "features": len(FEATURES)
    })


@app.post("/predict")
def predict():

    try:
        data = request.get_json()

        # Check that all required features were provided
        missing = [feature for feature in FEATURES if feature not in data]

        if missing:
            return jsonify({
                "error": "Missing required features",
                "missing": missing
            }), 400

        # Create dataframe in exactly the same feature order
        row = {}

        for feature in FEATURES:
            row[feature] = float(data[feature])

        X = pd.DataFrame([row], columns=FEATURES)

        # Prediction
        prediction = int(model.predict(X)[0])

        # Probability of successful repayment
        probability = float(model.predict_proba(X)[0][1])

        percentage = probability * 100

        # Demo risk classification
        if percentage >= 70:
            risk_level = "Low Risk"
            recommendation = "Strong repayment potential"
        elif percentage >= 50:
            risk_level = "Medium Risk"
            recommendation = "Moderate repayment potential"
        else:
            risk_level = "High Risk"
            recommendation = "Higher repayment risk"

        return jsonify({
            "prediction": prediction,
            "prediction_label": (
                "Likely to repay"
                if prediction == 1
                else "Higher repayment risk"
            ),
            "repayment_probability": round(probability, 4),
            "repayment_percentage": round(percentage, 1),
            "risk_level": risk_level,
            "recommendation": recommendation
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )