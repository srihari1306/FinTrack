from flask import Blueprint, request, jsonify
from flask_login import login_required,current_user
from models import db,Transaction, BudgetLimit
from datetime import datetime

fin_bp = Blueprint('finance',__name__)

@fin_bp.route('/transactions',methods=['POST'])
@login_required
def add_transaction():
    data=request.json
    
    #validation
    if data['type'] not in ['income','expense']:
        return jsonify({'message': 'Invalid type. Must be "income" or "expense".'}), 400
    
    try:
        amount = float(data['amount'])
        if amount<=0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'message': 'Amount must be a positve number. '}), 400
    
    try:
        datetime.strptime(data['date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Date must be in YYYY-MM-DD format.'}),400
    
    #creation of new transaction
    new_transaction = Transaction(
        user_id = current_user.id,
        amount=data['amount'],
        type=data['type'],
        category=data['category'],
        date=data['date'],
        description=data['description']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added'})

@fin_bp.route('/transactions',methods=['GET'])
@login_required
def get_transaction():
    transactions=Transaction.query.filter_by(user_id=current_user.id).all()
    result = [
        {
            'id':t.id,
            'amount':t.amount,
            'type':t.type,
            'category':t.category,
            'date':t.date,
            'description':t.description
        } for t in transactions
    ]
    return jsonify(result)

@fin_bp.route('/transactions/<int:id>',methods=['PUT'])
@login_required
def update_transaction(id):
    transaction= Transaction.query.get_or_404(id)
    if transaction.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.json
    #validation
    if data['type'] not in ['income', 'expense']:
        return jsonify({'message': 'Invalid type. Must be "income" or "expense".'}), 400

    try:
        amount = float(data['amount'])
        if amount <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'message': 'Amount must be a positive number.'}), 400

    try:
        datetime.strptime(data['date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Date must be in YYYY-MM-DD format.'}), 400
    
    #updatation
    transaction.amount = data.get('amount',transaction.amount)
    transaction.type = data.get('type',transaction.type)
    transaction.category = data.get('category',transaction.category)
    transaction.date = data.get('date',transaction.date)
    transaction.description =data.get('description',transaction.description)
    
    db.session.commit()
    return jsonify({'message': 'Transaction updated'})

@fin_bp.route('/transactions/<int:id>',methods=['DELETE'])
@login_required
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    if transaction.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message':'Transaction deleted'})

@fin_bp.route('/dashboard',methods=["GET"])
@login_required
def dashboard():
    try:
        transactions = Transaction.query.filter_by(user_id=current_user.id).all()
        
        #summary
        income = sum(t.amount for t in transactions if t.type=="income")
        expense = sum(t.amount for t in transactions if t.type == "expense")
        balance = income - expense
        
        #warnings for expense going above budget-limit for each category
        warnings=[]
        for limit in BudgetLimit.query.filter_by(user_id=current_user.id).all():
            total = sum(t.amount for t in transactions if t.category==limit.category and t.type=="expense")
            if total > limit.limit:
                warnings.append(f"Budget exceeded in category: {limit.category}")
        
        data ={
            "username" : current_user.username,
            "summary" : {
                "income" : income,
                "expense" : expense,
                "balance" : balance,
            },
            "transactions": [
                {
                    'id':t.id,
                    'amount':t.amount,
                    'type':t.type,
                    'category':t.category,
                    'date':t.date,
                    'description':t.description
                } for t in transactions
            ],
            "warnings" : warnings
        }
        
        return jsonify(data),200
    
    except Exception as e:
        return jsonify({"message": "An error occured while fetching the dashboard data."}),500
    
    
@fin_bp.route('/budget-limit', methods=['POST'])
@login_required
def set_budget_limit():
    data=request.json
    category = data['category']
    limit=float(data['limit'])
    
    if not category or not isinstance(limit, (int,float)) or limit<=0:
        return jsonify({"message":"Invalid Input"}),400
    
    existing_limit = BudgetLimit.query.filter_by(user_id=current_user.id, category=category).first()
    
    if existing_limit:
        existing_limit.limit=limit
    else:
        new_limit = BudgetLimit(user_id=current_user.id, category=category, limit=limit)  
        db.session.add(new_limit)
        
    db.session.commit()
    return jsonify({"message":"Budget limit set successfully"})

@fin_bp.route('/budget-limit', methods=['GET'])
@login_required
def get_budget_limit():
    limits = BudgetLimit.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {"id": l.id, "category":l.category, "limit":l.limit}
        for l in limits
    ])


@fin_bp.route('/budget-limit/<int:id>', methods=['DELETE'])
@login_required
def delete_budget_limit(id):
    limit = BudgetLimit.query.get_or_404(id)
    if limit.user_id != current_user.id:
        return jsonify({"message": "Not authorized"}),403
    
    db.session.delete(limit)
    db.session.commit()
    return jsonify({"message":"Deleted limit"})

@fin_bp.route('/category-summary', methods=["GET"]) #for analytics chart
@login_required
def category_summary():
    #here we need to find the total amount (both income and expense separately) grouped by their category
    from sqlalchemy import func
    
    #group by category for income
    income_summary = (
        db.session.query(Transaction.category, func.sum(Transaction.amount))
        .filter_by(user_id=current_user.id, type="income")
        .group_by(Transaction.category)
        .all()
    )
    
    #The above query in MySql for ref
    ''' 
    Select category, sum(amount) as total
    from transactions
    where type = 'income' ans user_id = current_user.id
    group by category
    '''
    
    #group by category for expense
    expense_summary = (
        db.session.query(Transaction.category, func.sum(Transaction.amount))
        .filter_by(user_id=current_user.id, type="expense")
        .group_by(Transaction.category)
        .all()
    )
    
    income = [{'category':c, 'total':float(t)}for c,t in income_summary]
    expense = [{'category':c, 'total':float(t)}for c,t in expense_summary]
    
    return jsonify({
        'income':income,
        'expense':expense
    })