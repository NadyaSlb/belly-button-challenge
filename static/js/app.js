//Define variables
let object;
let menuNames;
//Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
    object = data;
    menuNames = object.names;
    console.log(object);
    dropdownMenu();
    init();
  });

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
//create a dropdown menu
function dropdownMenu(){
    let selector = d3.selectAll('#selDataset');
    menuNames.map((menuName) => {selector.append('option').text(menuName)});
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
function init() {
    let samples = object.samples;
    //top10 sample values
    let topTenSamples = samples.map(extractTopTenInfo);
    console.log(topTenSamples);
 

    let data = [{
      x: topTenSamples[0].ten_sample_values,
      y: topTenSamples[0].ten_otu_ids.map(id => `OTU ${id}`),
      text: topTenSamples[0].ten_first_otu_labels,
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
  
    Plotly.newPlot("bar", data, layout);
  }

// Update the restyled plot's values


  