class Config: #used to create the app
    SECRET_KEY = "SriHari"
    SQLALCHEMY_DATABASE_URI = "sqlite:///site.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE ='filesystem'