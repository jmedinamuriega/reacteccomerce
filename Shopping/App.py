from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'Gringochone0'
app.config['JWT_SECRET_KEY'] = 'Gringochone0'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    image = db.Column(db.String(200), nullable=True)
    category = db.relationship('Category', backref=db.backref('products', lazy=True))

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('carts', lazy=True))

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    cart = db.relationship('Cart', backref=db.backref('items', lazy=True))
    product = db.relationship('Product', backref=db.backref('cart_items', lazy=True))

class OrderHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    cart_id = db.Column(db.Integer, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    total_price = db.Column(db.Float, nullable=False)

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request_error(error):
    return jsonify({'message': 'Bad request', 'details': str(error)}), 400

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'message': 'Internal server error', 'details': str(error)}), 500

@app.route('/users', methods=['POST'])
def register():
    try:
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=new_user.id)
        return jsonify(access_token=access_token, user={'id': new_user.id, 'username': new_user.username, 'email': new_user.email})
    except Exception as e:
        app.logger.error(f"Error in register: {str(e)}")
        return jsonify({'message': 'An error occurred during registration'}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token, user={'id': user.id, 'username': user.username, 'email': user.email})
        return jsonify(message='Invalid credentials'), 401
    except Exception as e:
        app.logger.error(f"Error in login: {str(e)}")
        return jsonify({'message': 'An error occurred during login'}), 500

@app.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    if get_jwt_identity() != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'user': {'id': user.id, 'username': user.username, 'email': user.email}})
    except Exception as e:
        app.logger.error(f"Error in update_profile: {str(e)}")
        return jsonify({'message': 'An error occurred while updating the profile'}), 500

@app.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_account(user_id):
    if get_jwt_identity() != user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Account deleted successfully'})
    except Exception as e:
        app.logger.error(f"Error in delete_account: {str(e)}")
        return jsonify({'message': 'An error occurred while deleting the account'}), 500

@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        result = []
        for product in products:
            category_name = product.category.name if product.category else 'Unknown'
            result.append({
                'id': product.id,
                'title': product.title,
                'price': product.price,
                'category': category_name,
                'description': product.description,
                'image': product.image
            })
        return jsonify(result), 200
    except Exception as e:
        app.logger.error(f"Error in get_products: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching products'}), 500

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    try:
        product = Product.query.get_or_404(id)
        return jsonify({
            'id': product.id,
            'title': product.title,
            'price': product.price,
            'category': product.category.name,
            'description': product.description,
            'image': product.image
        })
    except Exception as e:
        app.logger.error(f"Error in get_product: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching the product'}), 500

@app.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        result = [{'id': category.id, 'name': category.name} for category in categories]
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in get_categories: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching categories'}), 500

@app.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        product_id = data['product_id']
        quantity = data['quantity']
        cart = Cart.query.filter_by(user_id=user_id).first()
        
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.commit()
        cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
        if cart_item:
            cart_item.quantity += quantity
            print('Product added to cart')
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            db.session.add(cart_item)
        db.session.commit()
        
    except Exception as e:
        app.logger.error(f"Error in add_to_cart: {str(e)}")
        return jsonify({'message': 'An error occurred while adding product to cart'}), 500

@app.route('/order', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            return jsonify({'message': 'No cart found for user'}), 404
        
        total_price = sum(item.product.price * item.quantity for item in cart.items)
        order = OrderHistory(user_id=user_id, cart_id=cart.id, total_price=total_price)
        db.session.add(order)
        db.session.delete(cart)  
        db.session.commit()

        return jsonify({'message': 'Order created successfully', 'order_id': order.id}), 201
    except Exception as e:
        app.logger.error(f"Error in create_order: {str(e)}")
        return jsonify({'message': 'An error occurred while creating order', 'error': str(e)}), 500

@app.route('/orders', methods=['GET'])
@jwt_required()
def get_order_history():
    try:
        user_id = get_jwt_identity()
        orders = OrderHistory.query.filter_by(user_id=user_id).all()
        result = [{
            'id': order.id,
            'date_created': order.date_created,
            'total_price': order.total_price
        } for order in orders]
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in get_order_history: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching order history'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
