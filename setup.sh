#!/bin/bash

echo "Setting up Intern Dashboard Project..."
echo

echo "Installing Python dependencies..."
cd intern_dashboard
pip install -r requirements.txt
echo

echo "Running Django migrations..."
python manage.py migrate
echo

echo "Installing Node.js dependencies..."
cd ../intern-dashboard-frontend
npm install
echo

echo "Setup complete!"
echo
echo "To start the project:"
echo "1. Backend: cd intern_dashboard && python manage.py runserver"
echo "2. Frontend: cd intern-dashboard-frontend && npm start"
echo