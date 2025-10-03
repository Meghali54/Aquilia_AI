@echo off
echo 🌊 AQUILA ML Environment Setup Script
echo =====================================

echo.
echo 📋 Step 1: Creating virtual environment...
python -m venv aquila_ml_env

echo.
echo 📋 Step 2: Activating virtual environment...
call aquila_ml_env\Scripts\activate.bat

echo.
echo 📋 Step 3: Upgrading pip...
python -m pip install --upgrade pip

echo.
echo 📋 Step 4: Installing ML dependencies...
pip install scikit-learn==1.3.0
pip install pandas==2.0.3
pip install numpy==1.24.3
pip install joblib==1.3.2
pip install scipy==1.11.1
pip install matplotlib==3.7.2
pip install seaborn==0.12.2

echo.
echo 📋 Step 5: Installing optional ML libraries...
pip install xgboost==1.7.6
pip install lightgbm==4.0.0

echo.
echo 📋 Step 6: Installing development tools...
pip install jupyter==1.0.0
pip install ipython==8.14.0

echo.
echo ✅ Virtual environment setup complete!
echo.
echo 🚀 To activate the environment in the future, run:
echo    aquila_ml_env\Scripts\activate
echo.
echo 📊 To train the ML models, run:
echo    python train_ml_models.py
echo.
echo 🎯 Ready to build impressive ML predictions for SIH!

pause