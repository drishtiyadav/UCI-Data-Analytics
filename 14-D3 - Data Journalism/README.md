# Data Journalism and D3!

## Background 

Welcome to the newsroom! You've just accepted a data visualization position for a major metro paper. The objective is to analyze the current trends shaping people's lives, as well as to create charts, graphs, and interactive elements to help readers understand the findings.

The editor wants to run a series of feature stories about the health risks facing particular demographics. She's counting on you to sniff out the first story idea by sifting through information from the U.S. Census Bureau and the Behavioral Risk Factor Surveillance System.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml). The current data set incldes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."


## Task

Task is to create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.

Using the D3 techniques, create a scatter plot that represents each state with circle elements. 

Place additional labels in your scatter plot and give them click events so that your users can decide which data to display. Animate the transitions for your circles' locations as well as the range of your axes. Do this for two risk factors for each axis. Or, for an extreme challenge, create three for each axis.

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Add tooltips to your circles and display each tooltip with the data that the user has selected. Use the `d3-tip.js` plugin 
- - -


## Copyright

Data Boot Camp © 2018. All Rights Reserved.
