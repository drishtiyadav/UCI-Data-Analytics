// from data.js
var tableData = data;
console.log(tableData);

//------------------------------------------------------
// Display Table
var tbody = d3.select("tbody");
tableData.forEach((UFOSighting) => {
  var row = tbody.append("tr");
  Object.entries(UFOSighting).forEach(([key, value]) => {
    var cell = tbody.append("td");
    cell.text(value);
  });
});

//-------------------------------------------------------
// Select Drop-down for City
var cityList = d3.select("#city");
cityList.append("option").text("-Select City-");
var cityGroup = [];
tableData.forEach((UFOSighting) => {
	if(cityGroup.includes(UFOSighting.city) === false) {
		cityGroup.push(UFOSighting.city);
		cityList.append("option").text(UFOSighting.city);
	}
  });

// Select Drop-down for State
var stateList = d3.select("#state");
stateList.append("option").text("-Select State-");
var stateGroup = [];
tableData.forEach((UFOSighting) => {
	if(stateGroup.includes(UFOSighting.state) === false) {
		stateGroup.push(UFOSighting.state);
		stateList.append("option").text(UFOSighting.state);
	}
  });

// Select Drop-down for Country
var countryList = d3.select("#country");
countryList.append("option").text("-Select Country-");
var countryGroup = [];
tableData.forEach((UFOSighting) => {
	if(countryGroup.includes(UFOSighting.country) === false) {
		countryGroup.push(UFOSighting.country);
		countryList.append("option").text(UFOSighting.country);
	}
  });

// Select Drop-down for Shape
var shapeList = d3.select("#shape");
shapeList.append("option").text("-Select Shape-");
var shapeGroup = [];
tableData.forEach((UFOSighting) => {
	if(shapeGroup.includes(UFOSighting.shape) === false) {
		shapeGroup.push(UFOSighting.shape);
		shapeList.append("option").text(UFOSighting.shape);
	}
  });

//-------------------------------------------------------
// filter based on date entered
var filterButton = d3.select("#filter-btn");

// Filter Click function
filterButton.on("click", function() {

	// Prevent the page from refreshing
	d3.event.preventDefault();
	// Clear the table
	tbody.html("");

	// Date input 
	var inputElementDate = d3.select("#datetime");
	var inputValueDate = inputElementDate.property("value");
	console.log(inputValueDate);

	// City input 
	var inputElementCity = d3.select("#city");
	var inputValueCity = inputElementCity.property("value");

	// State input 
	var inputElementState = d3.select("#state");
	var inputValueState = inputElementState.property("value");

	// Country input 
	var inputElementCountry = d3.select("#country");
	var inputValueCountry = inputElementCountry.property("value");

	// Shape input 
	var inputElementShape = d3.select("#shape");
	var inputValueShape = inputElementShape.property("value");

	// Filter the date 

	if (inputValueDate) {
	var filteredDate = tableData.filter(UFOSighting => UFOSighting.datetime === inputValueDate);
	}
	else {
		filteredDate = tableData;
	}
	//---------------
	// Filter City
	if (inputValueCity != "-Select City-") {
	var filteredLocation = filteredDate.filter(UFOSighting => UFOSighting.city === inputValueCity);
	}
	else if (inputValueState != "-Select State-") {
		var filteredLocation= filteredDate.filter(UFOSighting => UFOSighting.state === inputValueState);
	}
	else if (inputValueCountry != "-Select Country-") {
		var filteredLocation = filteredDate.filter(UFOSighting => UFOSighting.country === inputValueCountry);
	}
	else {
		filteredLocation = filteredDate;
	}

	//---------------
	//Filter Shape
	if (inputValueShape != "-Select Shape-") {
		var filteredData = filteredLocation.filter(UFOSighting => UFOSighting.shape === inputValueShape);
	}
	else {
		filteredData = filteredLocation;
	}

	//---------------
	// Display filtered results
	filteredData.forEach((UFOSighting) => {
		var row = tbody.append("tr");
		Object.entries(UFOSighting).forEach(([key, value]) => {
		var cell = tbody.append("td");
		cell.text(value);
	});
});
});
//--------End ----------
