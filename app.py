from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"
app.config["JWT_SECRET_KEY"] = "supersecret"
app.config['JWT_VERIFY_SUB'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), nullable=False, default="student")

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    text = db.Column(db.String(500), nullable=False)
    option_a = db.Column(db.String(200), nullable=False)
    option_b = db.Column(db.String(200), nullable=False)
    option_c = db.Column(db.String(200), nullable=False)
    option_d = db.Column(db.String(200), nullable=False)
    correct_option = db.Column(db.String(1), nullable=False)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    score = db.Column(db.Integer, nullable=False)

# Routes
@app.route("/register", methods=["POST"])
@cross_origin()
def register():
    data = request.json
    existing_user = User.query.filter_by(username=data["username"]).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = User(username=data["username"], password=hashed_pw, role=data.get("role", "student"))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
@cross_origin()
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity={"username": user.username, "role": user.role})
    return jsonify({"access_token": token, "role": user.role})

@app.route("/quizzes", methods=["GET"])
@jwt_required()
@cross_origin()
def get_quizzes():
    identity = get_jwt_identity()
    print(f"🟡 Authenticated User: {identity}")  

    quizzes = Quiz.query.all()
    return jsonify([{ "id": q.id, "title": q.title } for q in quizzes])
@app.route("/quizzes", methods=["POST"])
@jwt_required()
@cross_origin()
def create_quiz():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if not data or "title" not in data or not isinstance(data["title"], str) or not data["title"].strip():
        return jsonify({"error": "Quiz title is required"}), 422

    new_quiz = Quiz(title=data["title"])
    db.session.add(new_quiz)
    db.session.commit()

    return jsonify({"message": "Quiz created successfully", "id": new_quiz.id})

@app.route("/quizzes/<int:quiz_id>", methods=["PUT"])
@jwt_required()
@cross_origin()
def update_quiz(quiz_id):
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    if "title" in data and isinstance(data["title"], str):
        quiz.title = data["title"].strip()
        db.session.commit()

    return jsonify({"message": "Quiz updated successfully"})

@app.route("/quizzes/<int:quiz_id>", methods=["GET"])
@jwt_required()
@cross_origin()
def get_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    questions_list = [{
        "id": q.id,
        "text": q.text,
        "option_a": q.option_a,
        "option_b": q.option_b,
        "option_c": q.option_c,
        "option_d": q.option_d,
        "correct_option": q.correct_option,
    } for q in questions]

    return jsonify({
        "id": quiz.id,
        "title": quiz.title,
        "questions": questions_list
    })


@app.route("/quizzes/<int:quiz_id>/questions", methods=["POST"])
@jwt_required()
@cross_origin()
def add_question(quiz_id):
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    required_fields = ["text", "option_a", "option_b", "option_c", "option_d", "correct_option"]

    if not all(field in data and isinstance(data[field], str) for field in required_fields):
        return jsonify({"error": "Invalid question format"}), 400

    new_question = Question(
        quiz_id=quiz_id,
        text=data["text"],
        option_a=data["option_a"],
        option_b=data["option_b"],
        option_c=data["option_c"],
        option_d=data["option_d"],
        correct_option=data["correct_option"],
    )

    db.session.add(new_question)
    db.session.commit()

    return jsonify({"message": "Question added successfully", "question": {
        "id": new_question.id,
        "text": new_question.text,
        "option_a": new_question.option_a,
        "option_b": new_question.option_b,
        "option_c": new_question.option_c,
        "option_d": new_question.option_d,
        "correct_option": new_question.correct_option,
    }}), 201


@app.route("/quizzes/<int:quiz_id>/attempt", methods=["GET"])
@jwt_required()
@cross_origin()
def attempt_quiz(quiz_id):
    identity = get_jwt_identity()
    if identity["role"] != "student":
        return jsonify({"error": "Unauthorized"}), 403

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    questions_list = [{
        "id": q.id,
        "text": q.text,
        "options": {
            "A": q.option_a,
            "B": q.option_b,
            "C": q.option_c,
            "D": q.option_d,
        }
    } for q in questions]

    return jsonify({
        "quiz_id": quiz.id,
        "quiz_title": quiz.title,
        "questions": questions_list
    })


@app.route("/quizzes/<int:quiz_id>/submit", methods=["POST"])
@jwt_required()
@cross_origin()
def submit_quiz(quiz_id):
    identity = get_jwt_identity()
    if identity["role"] != "student":
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.filter_by(username=identity["username"]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    
    existing_score = Score.query.filter_by(user_id=user.id, quiz_id=quiz_id).first()
    if existing_score:
        return jsonify({"error": "You have already attempted this quiz", "score": existing_score.score}), 403

    data = request.get_json()
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    correct_answers = {str(q.id): q.correct_option for q in questions}

    score = sum(1 for q in questions if str(q.id) in data["answers"] and data["answers"][str(q.id)] == correct_answers[str(q.id)])

    
    new_score = Score(user_id=user.id, quiz_id=quiz_id, score=score)
    db.session.add(new_score)
    db.session.commit()

    return jsonify({"message": "Quiz submitted successfully", "score": score})

@app.route("/student/scores", methods=["GET"])
@jwt_required()
@cross_origin()
def get_student_scores():
    identity = get_jwt_identity()
    if identity["role"] != "student":
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.filter_by(username=identity["username"]).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    scores = Score.query.filter_by(user_id=user.id).all()
    
    # Fetch the total number of questions for each quiz
    score_data = {}
    for score in scores:
        total_questions = Question.query.filter_by(quiz_id=score.quiz_id).count()
        score_data[score.quiz_id] = {
            "score": score.score,
            "total_questions": total_questions
        }

    return jsonify(score_data)

@app.route("/quizzes/scores", methods=["GET"])
@jwt_required()
@cross_origin()
def get_all_student_scores():
    identity = get_jwt_identity()
    if identity["role"] != "admin":
        return jsonify({"error": "Unauthorized"}), 403

    quizzes = Quiz.query.all()
    scores_data = {}

    for quiz in quizzes:
        # Fetch latest score for each student
        latest_scores = (
            db.session.query(Score.user_id, db.func.max(Score.score).label("latest_score"))
            .filter(Score.quiz_id == quiz.id)
            .group_by(Score.user_id)
            .all()
        )

        scores_data[quiz.id] = [
            {
                "student": User.query.get(score.user_id).username,
                "score": score.latest_score,
                "total_questions": Question.query.filter_by(quiz_id=quiz.id).count(),
            }
            for score in latest_scores
        ]

    return jsonify(scores_data)



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
