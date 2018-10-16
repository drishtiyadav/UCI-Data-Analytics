import numpy as np
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///hawaii.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Measurement = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation"
        f"/api/v1.0/stations"
        f"/api/v1.0/tobs"
        f"/api/v1.0/<start> "
        f"/api/v1.0/<start>/<end>"
    )

@app.route("/api/v1.0/precipitation/dates_temp_last_year")
def dates_temp_last_year():
#Query for the dates and temperature observations from the last year.

    sel = [Measurement.date,
    func.sum(Measurement.tobs)]
    date_temp_12mths = session.query(*sel).\
    filter(Measurement.date.between ('2016-08-23', '2017-08-23')).\
    group_by(Measurement.date).\
    order_by(Measurement.date).all()

   #Convert the query results to a Dictionary using date as the key and tobs as the value.
    all_dates_temp = []
    for row in  date_temp_12mths:
        date_dict = {}
        date_dict["Date"] = row[0]
        date_dict["Temprature"] = row[1]
        all_dates_temp.append(date_dict)

    #Return the JSON representation of your dictionary.
    return jsonify(all_dates_temp)


@app.route("/api/v1.0/stations")
def stations():
    """Return a JSON list of stations from the dataset."""
    # Query all stations

    stations = session.query(Station.station).all()
    all_stations = list(np.ravel(stations))

    return jsonify(all_stations)

@app.route("/api/v1.0/tobs")
def tobs():
    """Return a JSON list of Temperature Observations (tobs) for the previous year."""
    # Query all stations
    sel3 = [Measurement.tobs]
    tob = session.query(*sel3).\
    filter(Measurement.date.between ('2016-08-23', '2017-08-23')).\
    group_by(Measurement.date).\
    order_by(Measurement.date).all()

    # Create a list of all_tobs

    all_tobs= list(np.ravel(stations))

    return jsonify(all_tobs)

@app.route('f"/api/v1.0/<start>/<end>')
@app.route('f"/api/v1.0/<start>/', defaults={'end': None})
def dates(start, end):
    """Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range."""
    
    sel4 = [
    func.min(Measurement.tobs),
    func.max(Measurement.tobs),
    func.avg(Measurement.tobs),]

    if end is None: 
        start_date = dt.datetime.strptime(start , '%Y-%m-%d')
        temp_analysis = session.query(*sel4).filter(Measurement.date >= start_date).all() 
    else
        end_date = dt.datetime.strptime(end , '%Y-%m-%d')
        temp_analysis = session.query(*sel4).filter(Measurement.date.between (start_date, end_date)).all() 

# Create a dictionary from the row data and append to a list of all_dates
    all_dates = []
    for Measurement.tobs in  temp_analysis:
        date_dict = {}
        date_dict['TMIN'] = func.min(Measurement.tobs)
        date_dict['TMAX'] = func.max(Measurement.tobs)
        date_dict['TAVG'] = func.avg(Measurement.tobs)
        all_dates.append(date_dict)

    return jsonify(date_dict)


if __name__ == '__main__':
    app.run(debug=True)
