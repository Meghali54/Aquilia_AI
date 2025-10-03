#!/usr/bin/env python3
"""
Oceanographic Trend Prediction ML Model Training Script
Creates Random Forest and Gradient Boosting models for fish abundance prediction
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

def load_and_prepare_data(csv_path):
    """Load and prepare the oceanographic data"""
    print("📊 Loading oceanographic dataset...")
    df = pd.read_csv(csv_path)
    
    print(f"Dataset shape: {df.shape}")
    print(f"Features: {list(df.columns)}")
    
    # Features (environmental parameters)
    feature_columns = ['Temperature', 'Salinity', 'pH', 'Oxygen', 'Depth', 'Turbidity', 'Nutrient_Level']
    X = df[feature_columns]
    
    # Targets (multiple prediction targets)
    y_fish_count = df['Fish_Count']
    y_species_diversity = df['Species_Diversity']
    y_biomass = df['Biomass']
    
    return X, y_fish_count, y_species_diversity, y_biomass, df

def train_models(X, y, target_name):
    """Train and evaluate multiple regression models"""
    print(f"\n🤖 Training models for {target_name}...")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Models to train
    models = {
        'Random Forest': RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        ),
        'Gradient Boosting': GradientBoostingRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\n🔄 Training {name}...")
        
        # Train model
        if name == 'Random Forest':
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
        else:
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
        
        # Evaluate
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # Cross-validation
        if name == 'Random Forest':
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='neg_mean_squared_error')
        else:
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='neg_mean_squared_error')
        
        results[name] = {
            'model': model,
            'scaler': scaler if name == 'Gradient Boosting' else None,
            'mse': mse,
            'rmse': rmse,
            'mae': mae,
            'r2': r2,
            'cv_rmse': np.sqrt(-cv_scores.mean()),
            'cv_std': np.sqrt(cv_scores.std()),
            'predictions': y_pred,
            'actual': y_test
        }
        
        print(f"  ✅ RMSE: {rmse:.2f}")
        print(f"  ✅ MAE: {mae:.2f}")
        print(f"  ✅ R² Score: {r2:.3f}")
        print(f"  ✅ CV RMSE: {results[name]['cv_rmse']:.2f} ± {results[name]['cv_std']:.2f}")
    
    return results

def analyze_feature_importance(models, feature_names, target_name):
    """Analyze and visualize feature importance"""
    print(f"\n📈 Analyzing feature importance for {target_name}...")
    
    for name, result in models.items():
        if hasattr(result['model'], 'feature_importances_'):
            importance = result['model'].feature_importances_
            feature_importance = pd.DataFrame({
                'feature': feature_names,
                'importance': importance
            }).sort_values('importance', ascending=False)
            
            print(f"\n{name} - Top Features for {target_name}:")
            for _, row in feature_importance.head(5).iterrows():
                print(f"  {row['feature']}: {row['importance']:.3f}")

def save_best_model(models, target_name):
    """Save the best performing model"""
    best_model_name = min(models.keys(), key=lambda k: models[k]['rmse'])
    best_result = models[best_model_name]
    
    model_filename = f'oceanographic_model_{target_name.lower().replace(" ", "_")}.pkl'
    
    # Save model and scaler if needed
    model_data = {
        'model': best_result['model'],
        'scaler': best_result['scaler'],
        'model_type': best_model_name,
        'target': target_name,
        'performance': {
            'rmse': best_result['rmse'],
            'mae': best_result['mae'],
            'r2': best_result['r2']
        }
    }
    
    joblib.dump(model_data, model_filename)
    print(f"\n💾 Best model ({best_model_name}) saved as {model_filename}")
    print(f"   Performance: RMSE={best_result['rmse']:.2f}, R²={best_result['r2']:.3f}")
    
    return model_filename, best_result

def create_prediction_function():
    """Create a sample prediction function for testing"""
    prediction_code = '''
import joblib
import numpy as np

def predict_marine_abundance(temperature, salinity, ph, oxygen, depth, turbidity, nutrient_level):
    """
    Predict fish abundance based on environmental parameters
    
    Args:
        temperature: Water temperature (20-32°C)
        salinity: Salinity (30-37 PSU)
        ph: pH level (7.5-8.5)
        oxygen: Dissolved oxygen (4-8 mg/L)
        depth: Water depth (10-60m)
        turbidity: Water turbidity (1-7 NTU)
        nutrient_level: Nutrient concentration (20-60 μg/L)
    
    Returns:
        dict: Predictions for fish count, species diversity, and biomass
    """
    
    # Load models
    fish_model = joblib.load('oceanographic_model_fish_count.pkl')
    diversity_model = joblib.load('oceanographic_model_species_diversity.pkl')
    biomass_model = joblib.load('oceanographic_model_biomass.pkl')
    
    # Prepare input
    features = np.array([[temperature, salinity, ph, oxygen, depth, turbidity, nutrient_level]])
    
    # Make predictions
    predictions = {}
    
    for model_name, model_data in [
        ('fish_count', fish_model),
        ('species_diversity', diversity_model),
        ('biomass', biomass_model)
    ]:
        model = model_data['model']
        scaler = model_data['scaler']
        
        if scaler:
            features_scaled = scaler.transform(features)
            pred = model.predict(features_scaled)[0]
        else:
            pred = model.predict(features)[0]
        
        predictions[model_name] = max(0, pred)  # Ensure non-negative
    
    return predictions

# Example usage:
if __name__ == "__main__":
    result = predict_marine_abundance(26.5, 34.2, 8.1, 6.3, 25, 3.0, 40)
    print(f"Predicted Fish Count: {result['fish_count']:.0f}")
    print(f"Predicted Species Diversity: {result['species_diversity']:.1f}")
    print(f"Predicted Biomass: {result['biomass']:.0f} kg")
'''
    
    with open('prediction_functions.py', 'w', encoding='utf-8') as f:
        f.write(prediction_code)
    
    print("\n📝 Created prediction_functions.py for easy model usage")

def main():
    """Main training pipeline"""
    print("🌊 AQUILA Oceanographic ML Model Training Pipeline")
    print("=" * 60)
    
    # Load data
    X, y_fish, y_div, y_bio, df = load_and_prepare_data('oceanographic_data.csv')
    feature_names = X.columns.tolist()
    
    # Train models for each target
    targets = [
        (y_fish, 'Fish Count'),
        (y_div, 'Species Diversity'),
        (y_bio, 'Biomass')
    ]
    
    saved_models = []
    
    for y_target, target_name in targets:
        print(f"\n{'='*60}")
        print(f"Training models for: {target_name}")
        print(f"{'='*60}")
        
        # Train models
        models = train_models(X, y_target, target_name)
        
        # Analyze feature importance
        analyze_feature_importance(models, feature_names, target_name)
        
        # Save best model
        model_file, best_result = save_best_model(models, target_name)
        saved_models.append((model_file, target_name, best_result))
    
    # Create prediction functions
    create_prediction_function()
    
    # Summary
    print(f"\n🎉 Training Complete!")
    print("=" * 60)
    print("📋 Model Summary:")
    for model_file, target_name, result in saved_models:
        print(f"  📁 {model_file}")
        print(f"     Target: {target_name}")
        print(f"     RMSE: {result['rmse']:.2f}")
        print(f"     R² Score: {result['r2']:.3f}")
        print()
    
    print("🚀 Models ready for deployment!")
    print("💡 Use prediction_functions.py for easy predictions")

if __name__ == "__main__":
    main()