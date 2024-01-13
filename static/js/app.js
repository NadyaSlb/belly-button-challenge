//Define variables
let object;
let menuNames;
let topTenSamples;
let initialDiv = d3.select('#sample-metadata');

//Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
    object = data;
    menuNames = object.names;
    console.log(object);
    dropdownMenu();
    initBarChart();
    initBubbleChart();
    initMetadata();
  });

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
//create a dropdown menu
function dropdownMenu(){
    let selector = d3.selectAll('#selDataset');
    menuNames.map((menuName) => {selector.append('option').attr('value', menuName).text(menuName)});
}

//function to extract top10 info
function extractTopTenInfo(sample) {
    return {
        id: sample.id,
        ten_sample_values: sample.sample_values.slice(0, 10),
        ten_otu_ids: sample.otu_ids.slice(0, 10),
        ten_otu_labels: sample.otu_labels.slice(0, 10)
    };
}

// Display the default plot
function initBarChart() {
    let samples = object.samples;
    //top10 sample values
    topTenSamples = samples.map(extractTopTenInfo);

    let data = [{
      x: topTenSamples[0].ten_sample_values,
      y: topTenSamples[0].ten_otu_ids.map(id => `OTU ${id}`),
      text: topTenSamples[0].ten_otu_labels,
      type: "bar",
      orientation: 'h'
    }];
    let layout = {
      height: 500,
      width: 600,
      yaxis: {
        autorange: 'reversed'
    }
    };
  
    Plotly.newPlot("bar", data, layout);
  }

// Update the values
function optionChanged(selectedValue) {
    let selectedSample = topTenSamples.find(sample => sample.id === selectedValue.toString());
    updateBarChart(selectedSample);
    let selectedSampleBubble = object.samples.find(sample => sample.id === selectedValue.toString());
    updateBubbleChart(selectedSampleBubble);
    let selectedSampleMeta = object.metadata.find(sample => sample.id === parseInt(selectedValue));
    updateMetadata(selectedSampleMeta);
};

function updateBarChart(selectedSample) {
    let updatedData = [{
        x: selectedSample.ten_sample_values,
        y: selectedSample.ten_otu_ids.map(id => `OTU ${id}`),
        text: selectedSample.ten_otu_labels,
        type: "bar",
        orientation: 'h'
    }];
    let layout = {
        height: 500,
        width: 600,
        yaxis: {
          autorange: 'reversed' // Reverse the order of OTUs for better visualization
      }
      };

    // Update the chart with the new data
    Plotly.react("bar", updatedData, layout);
}

//Create a bubble chart 
function initBubbleChart() {
    let samples = object.samples;
    let data = [{
        x: samples[0].otu_ids,
        y: samples[0].sample_values,
        mode: 'markers',
        marker: {
            size: samples[0].sample_values,
            color: samples[0].otu_ids,
            colorscale: 'Viridis'
        },
        text: samples[0].otu_labels
    }]

    let layout = {
        showlegend: false,
        height: 500,
        width: 1000,
        xaxis: {
            title: 'OTU ID'
        }
    };

    Plotly.newPlot("bubble", data, layout);
}

function updateBubbleChart(selectedSampleBubble) {
    let updatedData = [{
        x: selectedSampleBubble.otu_ids,
        y: selectedSampleBubble.sample_values,
        mode: 'markers',
        marker: {
            size: selectedSampleBubble.sample_values,
            color: selectedSampleBubble.otu_ids,
            colorscale: 'Viridis'
        },
        text: selectedSampleBubble.otu_labels
    }];
    let layout = {
        showlegend: false,
        height: 500,
        width: 1000,
        xaxis: {
            title: 'OTU ID'
        }
    };

    // Update the chart with the new data
    Plotly.react("bubble", updatedData, layout);
}
  
//Display each key-value pair from the metadata JSON object
function initMetadata(){
    initialDiv.append("p").text('id: ' + object.metadata[0].id);
    initialDiv.append("p").text('ethnicity: ' + object.metadata[0].ethnicity);
    initialDiv.append("p").text('gender: ' + object.metadata[0].gender);
    initialDiv.append("p").text('age: ' + object.metadata[0].age);
    initialDiv.append("p").text('location: ' + object.metadata[0].location);
    initialDiv.append("p").text('bbtype: ' + object.metadata[0].bbtype);
    initialDiv.append("p").text('wfreq: ' + object.metadata[0].wfreq);
};

function updateMetadata(selectedSampleMeta){
    initialDiv.html("");
    initialDiv.append("p").text('id: ' + selectedSampleMeta.id);
    initialDiv.append("p").text('ethnicity: ' + selectedSampleMeta.ethnicity);
    initialDiv.append("p").text('gender: ' + selectedSampleMeta.gender);
    initialDiv.append("p").text('age: ' + selectedSampleMeta.age);
    initialDiv.append("p").text('location: ' + selectedSampleMeta.location);
    initialDiv.append("p").text('bbtype: ' + selectedSampleMeta.bbtype);
    initialDiv.append("p").text('wfreq: ' + selectedSampleMeta.wfreq);
}