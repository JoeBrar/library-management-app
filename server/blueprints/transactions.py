from flask import Blueprint,current_app,request
import json

transactions=Blueprint('transactions',__name__)

@transactions.route('/getTransactions')
def getTransactions():
  print("Get transactions")
  return "<h3>Get transactions</h3>"

@transactions.route('/test1')
def test1():
  mysql=current_app.config['mysql']
  cur=mysql.connection.cursor()
  cur.execute("""
    CREATE TABLE transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      member_id INT,
      book_id INT,
      issue_date DATE,
      rent_per_day INT,
      is_returned VARCHAR(10),
      return_date DATE,
      total_rent INT,
      amount_paid INT,
      new_outstanding_debt INT,
      FOREIGN KEY (member_id) REFERENCES members(id),
      FOREIGN KEY (book_id) REFERENCES books(id)    
    )
  """)
  mysql.connection.commit()
  cur.close()
  return json.dumps("okok")

@transactions.route('/bookIssue',methods=['POST'])
def bookIssue():
  data=json.loads(request.data)
  print(data)
  mysql=current_app.config['mysql']
  cur=mysql.connection.cursor()
  
  cur.execute("""
    INSERT INTO transactions (member_id,book_id,issue_date,rent_per_day,is_returned)
    VALUES (%s,%s,%s,%s,'no')
  """,( int(data['selectedMember']),int(data['selectedBook']), data['issueDate'], int(data['rentPerDay']) ))
  
  cur.execute("""
    UPDATE books
    SET available_stock=available_stock-1
    WHERE id=%s
  """,( int(data['selectedBook']), ))

  mysql.connection.commit()
  cur.close()
  return json.dumps("ok")