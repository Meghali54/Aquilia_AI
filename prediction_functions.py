
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
