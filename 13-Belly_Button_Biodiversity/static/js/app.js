function buildMetadata(sample) {

  console.log(sample);
  // Use d3 to select the panel with id of `#sample-metadata`
  var meta = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  meta.html("");

  // Use `d3.json` to fetch the metadata for a sample
  var metadata_url = `/metadata/${sample}`;
    d3.json(metadata_url).then(function(response) {

      // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(response).forEach(([key, value]) => {
      meta.append("p").text(`${key}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
    buildGauge(response.WFREQ);    

  });
};


function buildCharts(sample) {

sample_url =  `/samples/${sample}`; 

d3.json(sample_url).then(function(data){

  var otu_ids = data.otu_ids;
  var sample_values = data.sample_values;
  var otu_labels = data.otu_labels;

  // @TODO: Build a Bubble Chart using the sample data

  var trace_bubble = {
    type: "scatter",
    mode: "markers",
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Earth'
    }
  };

  var layout_bubble = {
    xaxis: { title: "OTU ID" },
    margin: {
      t: 0,
    }  
  };
  data_bubble = [trace_bubble];
  BUBBLE = document.getElementById("bubble");
  Plotly.newPlot(BUBBLE, data_bubble, layout_bubble);

  // @TODO: Build a Pie Chart

  var dict = [];

  for (var j = 0; j < data.otu_ids.length; j++) {
    dict.push({
        "otu_id": data.otu_ids[j],
        "sample_value": data.sample_values[j],
        "otu_label": data.otu_labels[j]
    });
  }

  console.log(dict);

  dict.sort(function(a, b) {
     return parseFloat(b.sample_values) - parseFloat(a.sample_values);
  });

  // Slice the first 10 objects for plotting
  dict = dict.slice(0, 10);
  
  var trace_pie = {
    type: "pie",
    labels: dict.map(row => row.otu_id),
    values: dict.map(row => row.sample_value),
    hovertext: dict.map(row => row.otu_label)
  };

  var data_pie = [trace_pie];

  var layout_pie = {
    title: "Top ten samples",
    margin: {
      t: 25,
      b: -20
    }  
  };

  PIE = document.getElementById("pie");
  Plotly.newPlot(PIE, data_pie, layout_pie);
});
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => { 
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
