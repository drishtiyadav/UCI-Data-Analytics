from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import pymongo
import scrape_mars

app = Flask(__name__)

# flask_pymongo to set up mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")

@app.route("/")
def index():
    mars_data = mongo.db.mars_data.find()
    return render_template("index.html", mars_data = mars_data)

@app.route("/scrape")
def scraper():
	#create a mars collection
    mars_data = mongo.db.mars_data   
    #call the scrape function in our scrape_mars file.  This will scrape and save to Mongo
    mars = scrape_mars.scrape()
    #update database with the data that has been scraped
    mars_data.update({}, mars, upsert=True)
    return redirect("/", code=302)

if __name__ == "__main__":
    app.run(debug=True)


