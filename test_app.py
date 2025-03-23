import pytest
from app import app, db, User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_register(client):
    response = client.post('/register', json={
        "username": "pytestuser",
        "password": "testpass",
        "role": "student"
    })
    assert response.status_code in [201, 400]  # 400 if username exists

def test_login(client):
    # First register the user
    client.post('/register', json={
        "username": "pytestuser2",
        "password": "testpass",
        "role": "student"
    })
    # Then login
    response = client.post('/login', json={
        "username": "pytestuser2",
        "password": "testpass"
    })
    assert response.status_code == 200
    assert "access_token" in response.get_json()
