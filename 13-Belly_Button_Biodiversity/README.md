# Belly Button Biodiversity – Plotly.js, Flask and Heroku

![Bacteria by filterforge.com](Images/bacteria_by_filterforgedotcom.jpg)

## Task

To build an interactive dashboard to explore the [Belly Button Biodiversity DataSet](http://robdunnlab.com/projects/belly-button-biodiversity/) using Plotly.js

* Create a PIE chart that uses data from your samples route (`/samples/<sample>`) to display the top 10 samples.

  ![PIE Chart](Images/pie_chart.png)

* Create a Bubble Chart that uses data from your samples route (`/samples/<sample>`) to display each sample.

![Bubble Chart](Images/bubble_chart.png)

* Display the sample metadata from the route `/metadata/<sample>`

  * Display each key/value pair from the metadata JSON object somewhere on the page

* Update all of the plots any time that a new sample is selected.

![Example Dashboard Page](Images/dashboard_part1.png)
![Example Dashboard Page](Images/dashboard_part2.png)

* Adapt the Gauge Chart from <https://plot.ly/javascript/gauge-charts/> to plot the Weekly Washing Frequency obtained from the route `/wfreq/<sample>`

![Weekly Washing Frequency Gauge](Images/gauge.png)

Deploy the Flask app to Heroku.

- - -

### Copyright

Data Boot Camp © 2018. All Rights Reserved.

