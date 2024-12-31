# entry_point.py

if __name__ == '__main__':
    from backend.app import app
    app.run(debug=True)