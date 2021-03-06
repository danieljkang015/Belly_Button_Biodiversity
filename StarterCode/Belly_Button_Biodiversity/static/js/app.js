function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  var metaDataUrl = `/metadata/${sample}`
  d3.json(metaDataUrl).then((data) => {

  // Use d3 to select the panel with id of `#sample-metadata`
    var sampleMetaData = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    sampleMetaData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      var row = sampleMetaData.append("p");
      row.text(`${key}: ${value}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleData = `/samples/${sample}`
  d3.json(sampleData).then((data) => {

    // @TODO: Build a Bubble Chart using the sample data
    var otuIds = data.otu_ids;
    var otuValues = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids; 
    var t_values = data.otu_labels;

    var trace1 = {
      x: otuIds,
      y: otuValues,
      text: t_values,
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      }
    };
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU Bubble Chart"},
    };

    Plotly.newPlot('bubble', data, layout);



  });

    // @TODO: Build a Pie Chart
  d3.json(sampleData).then((data) => {

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieValues = data.sample_values.slice(0,10);
    var pieLabels = data.otu_ids.slice(0,10);
    var pieHover = data.otu_labels.slice(0,10);

    var trace2 = {
      values: pieValues,
      labels: pieLabels,
      hovertext: pieHover,
      type: "pie"
    }

    var data2 = [trace2];

    Plotly.newPlot('pie', data2);
  })

}

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
