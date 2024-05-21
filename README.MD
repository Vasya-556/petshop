python -m venv env
env\Scripts\activate
pip install django djangorestframework django-cors-headers
cd backend
python manage.py runserver


cd frontend 
npm start