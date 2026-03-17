import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import joblib
import os

# ── 1. Load Data ─────────────────────────────────────────
print("Loading data...")
train_df = pd.read_csv("ml/data/train_df.csv")
test_df  = pd.read_csv("ml/data/test_df.csv")
df = pd.concat([train_df, test_df], ignore_index=True)

# ── 2. Clean Data ─────────────────────────────────────────
print("Cleaning data...")
df = df.dropna(subset=["readmitted"]).copy()
df["readmitted"] = df["readmitted"].astype(int)
numeric_cols = ["age", "num_procedures", "days_in_hospital", "comorbidity_score"]
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())

# ── 3. Feature Engineering ────────────────────────────────
print("Engineering features...")
df["age_group"] = pd.cut(
    df["age"], bins=[0, 30, 50, 65, 80, 120], labels=[0, 1, 2, 3, 4]
).astype(int)

df["high_risk"] = (
    (df["days_in_hospital"] > 7) & (df["comorbidity_score"] >= 2)
).astype(int)

df["procedure_intensity"] = df["num_procedures"] / (df["days_in_hospital"] + 1)

# New features
df["age_x_comorbidity"]    = df["age"] * df["comorbidity_score"]
df["days_x_comorbidity"]   = df["days_in_hospital"] * df["comorbidity_score"]
df["elderly_high_risk"]    = ((df["age"] > 65) & (df["comorbidity_score"] >= 3)).astype(int)
df["long_stay"]            = (df["days_in_hospital"] > 10).astype(int)
df["many_procedures"]      = (df["num_procedures"] > 8).astype(int)

# ── 4. Encode Categorical Columns ─────────────────────────
print("Encoding features...")
encoders = {}
categorical_cols = ["gender", "primary_diagnosis", "discharge_to"]
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# ── 5. Split Features & Target ────────────────────────────
X = df.drop("readmitted", axis=1)
y = df["readmitted"]

print(f"Features ({len(X.columns)}): {list(X.columns)}")
print(f"Class distribution: {y.value_counts().to_dict()}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── 6. SMOTE ──────────────────────────────────────────────
print("Applying SMOTE...")
smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
print(f"After SMOTE: {pd.Series(y_train_res).value_counts().to_dict()}")

# ── 7. Hyperparameter Tuning ──────────────────────────────
print("\nRunning hyperparameter search (this may take a minute)...")

param_grid = {
    "n_estimators":      [200, 300, 500],
    "max_depth":         [3, 4, 5, 6],
    "learning_rate":     [0.01, 0.05, 0.1],
    "subsample":         [0.7, 0.8, 0.9],
    "colsample_bytree":  [0.7, 0.8, 0.9],
    "min_child_weight":  [1, 3, 5],
    "gamma":             [0, 0.1, 0.2, 0.3],
    "reg_alpha":         [0, 0.1, 0.5, 1.0],
    "reg_lambda":        [1.0, 2.0, 3.0],
}

base_model = XGBClassifier(
    eval_metric="auc",
    random_state=42,
    verbosity=0
)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

search = RandomizedSearchCV(
    base_model,
    param_distributions=param_grid,
    n_iter=40,
    scoring="roc_auc",
    cv=cv,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

search.fit(X_train_res, y_train_res)

print(f"\nBest ROC-AUC (CV): {search.best_score_:.4f}")
print(f"Best params: {search.best_params_}")

model = search.best_estimator_

# ── 8. Evaluate ───────────────────────────────────────────
print("\n── Hold-out Test Set Evaluation ──")
y_pred      = model.predict(X_test)
y_pred_prob = model.predict_proba(X_test)[:, 1]

print(classification_report(
    y_test, y_pred,
    target_names=["Not Readmitted", "Readmitted"],
    zero_division=0
))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_pred_prob):.4f}")

# ── 9. Feature Importance ─────────────────────────────────
print("\n── Feature Importance ──")
importance = pd.Series(
    model.feature_importances_, index=X.columns
).sort_values(ascending=False)
print(importance.round(4))

# ── 10. Save Artifacts ────────────────────────────────────
os.makedirs("ml/model", exist_ok=True)
joblib.dump(model,           "ml/model/model.pkl")
joblib.dump(encoders,        "ml/model/encoders.pkl")
joblib.dump(list(X.columns), "ml/model/feature_names.pkl")

print("\n✅ Model saved to ml/model/model.pkl")
print("✅ Encoders saved to ml/model/encoders.pkl")
print("✅ Feature names saved to ml/model/feature_names.pkl")