// BONUS: Build the Gauge Chart
function buildGauge(value) {

  // Modify value between 0 and 180
  var level = 2 * 10 * parseFloat(value);

  // Trig to calc meter point
var degrees = 180 - level,
     radius = 0.5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 10, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6',
            '4-5', '3-4','2-3','1-2','0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 124, 0, .5)', 'rgba(50, 124, 15, .5)','rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(200, 202, 95, .5)', 'rgba(210, 209, 95, .5)',
                         'rgba(210, 226, 145, .5)', 'rgba(232, 226, 202, .5)', 
                         'rgba(250, 240, 240, 0)', 'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4','2-3','1-2','0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency <br> Scrubs per week',
  height: 600,
  width: 600,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

var GAUGE = document.getElementById("gauge")
Plotly.newPlot(GAUGE, data, layout);

}



