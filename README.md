(base) PS C:\Users\dhany\newp 

<!-- cd backend -->
<!-- Government scheme -->
<!-- ==> for mongo db connection -->
cd gov_scheme_backend
this runs server for newsletter,government scheme,openai,email contact
nodemon server.js(running on port=8090)

<!--cd  backend/plant_disease_detection/api -->
<!-- plant disease detection -->
cd plant_disease_detection,api
.\myenv\Scripts\activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload


<!-- backend\ntpip_backend -->
cd ntpip_backend
.\venv\Scripts\activate
python app.py(running on port=5000)

<!-- to run react app -->
npm start(running on port=3000)





