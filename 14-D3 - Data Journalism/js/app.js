
// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(censusData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);  

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
// function to update the text in circles (state abbr)
function updateCircleTextX(chosenXAxis, newXScale, textGroup) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

   return textGroup; 
}

function updateCircleTextY(chosenYAxis, newYScale, textGroup) {

  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])+5);

   return textGroup; 
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, textGroup) {

  if (chosenXAxis === "poverty") {
    var labelX = "Poverty: ";
  }
  else if (chosenXAxis === "age") {
    var labelX = "Age: ";
  }
  else {
    var labelX = "House hold income: "
  }
  if (chosenYAxis === "healthcare") {
    var labelY = "Lacks Healthcare: ";
  }
  else if (chosenYAxis === "smokes") {
    var labelY = "Smokes: ";
  }
  else {
    var labelY = "Obesity: "
  }
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
    });

  textGroup.call(toolTip);

  textGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return textGroup;
}

// Step 3:
// Import data from the donuts.csv file
// =================================

d3.csv("data/data.csv", function(error, censusData) {
  if (error) throw error;

  // Step 4: Parse the data
  // =================================
  // Format the data
	censusData.forEach(function(data) {
	    data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
	    data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
	 });

  // Step 5: Create Scales
  //= ============================================

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);


  var yLinearScale = yScale(censusData, chosenYAxis);

  // Step 6: Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis

  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    //.attr("transform", `translate(${width}, 0)`)
    .call(leftAxis);

  var node = chartGroup.selectAll(".node")
    .data(censusData)
    .enter()
    .append("g")
    .classed("node", true);
  // append initial circles
  var circlesGroup = node
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "lightblue")
    .attr("opacity", "1")
    ;

  var textGroup = node
    .append("text")
    .classed("stateText",true)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+5)
    .text(d => d.abbr);


  // Create group for  3 x- axis labels
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In poverty (%)");

  var ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median");

  var incomeLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for  3 y- axis labels

    var labelsGroupY = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = labelsGroupY.append("text")
      .attr("x", -160)
      .attr("y", -40)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");

  var smokesLabel = labelsGroupY.append("text")
      .attr("x", -160)
      .attr("y", -60)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

  var obesityLabel = labelsGroupY.append("text")
      .attr("x", -160)
      .attr("y", -80)
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");

  // updateToolTip function above csv import
  var textGroup = updateToolTip(chosenXAxis, chosenYAxis , textGroup);

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log(value); 
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

        //updates text with new info
        textGroup = updateCircleTextX(chosenXAxis, xLinearScale, textGroup);

        // updates tooltips with new info
        textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);  
        }
      }
    });

  labelsGroupY.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      console.log(value);
      if (value !== chosenYAxis) {
        chosenYAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(censusData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

        //updates text with new info
        textGroup = updateCircleTextY(chosenYAxis, yLinearScale, textGroup);

        //updates tooltips with new info
        textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);  
        }
      }
    });
});
