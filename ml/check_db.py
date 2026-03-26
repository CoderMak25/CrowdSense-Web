import sqlite3

conn = sqlite3.connect("crowdsense.db")
cursor = conn.cursor()

rows = cursor.execute("SELECT * FROM crowd_log").fetchall()

for row in rows:
    print(row)

conn.close()