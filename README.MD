python -m venv env
env\Scripts\activate
pip install django djangorestframework django-cors-headers
python -m pip install Pillow
pip install djangorestframework-simplejwt
cd backend
python manage.py runserver


cd frontend 
npm start