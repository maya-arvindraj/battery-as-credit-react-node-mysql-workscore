import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)
import joblib


# -------------------------
# 1. Load dataset
# -------------------------

df = pd.read_csv("data/zypp_synthetic_rider_dataset.csv")

print("Dataset shape:", df.shape)
print(df.head())


# -------------------------
# 2. Select features
# -------------------------

features = [
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

X = df[features]
y = df["loan_repaid"]


# -------------------------
# 3. Train/test split
# -------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# -------------------------
# 4. Train model
# -------------------------

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)


# -------------------------
# 5. Evaluate
# -------------------------

predictions = model.predict(X_test)
probabilities = model.predict_proba(X_test)[:, 1]

print("\nAccuracy:")
print(accuracy_score(y_test, predictions))

print("\nROC-AUC:")
print(roc_auc_score(y_test, probabilities))

print("\nClassification Report:")
print(classification_report(y_test, predictions))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))


# -------------------------
# 6. Feature importance
# -------------------------

importance = pd.DataFrame({
    "feature": features,
    "importance": model.feature_importances_
}).sort_values(
    "importance",
    ascending=False
)

print("\nFeature Importance:")
print(importance)


# -------------------------
# 7. Save model
# -------------------------

joblib.dump(model, "workscore_model.pkl")

print("\nModel saved as workscore_model.pkl")