// Set to false to disable all chart functionality
var ENABLE_CHART = false;

if (!ENABLE_CHART) {
  // Provide no-op stubs so other scripts don't break
  function fetchAndDrawPyfunc() {}
  function drawGraph() {}
  function resetChart() {}
  function playChart() {}
  function pauseChart() {}
} else {

// Chart.js defaults
Chart.defaults.font.family = 'Tenorite';
Chart.defaults.font.size = 15;
Chart.defaults.font.weight = 'bold';
Chart.defaults.color = 'black';

Chart.defaults.scale.grid.color = 'black';
Chart.defaults.scale.grid.lineWidth = 1;
Chart.defaults.scale.grid.drawOnChartArea = true;
Chart.defaults.scale.grid.drawTicks = true;

Chart.defaults.scale.ticks.beginAtZero = true;

var sliderLabelText = 'gate:';
var sliderLabelText2 = 'Drain:';

const deviceAspectRatio = window.innerWidth / window.innerHeight;
console.log('Device Aspect Ratio:', deviceAspectRatio);

var globalTimescale = 1;

// DOM element references
var sliderLabelElement = document.getElementById('sliderLabel');
sliderLabelElement.textContent = sliderLabelText + '0';
var sliderLabelElement2 = document.getElementById('sliderLabel2');
sliderLabelElement.textContent = sliderLabelText2 + '0';

const sliderLabel = document.getElementById('sliderLabel');
const valueSlider = document.getElementById('valueSlider');
const valueSlider2 = document.getElementById('valueSlider2');
const toggleTransientCheckbox = document.getElementById('toggleTransientCheckbox');
const canvas = document.getElementById('pyfuncCanvas');
const ctx = canvas.getContext('2d');

let chart;
var config;

// Toggle transient event listener
toggleTransientCheckbox.addEventListener('change', (event) => {
  if (!toggleTransientCheckbox.checked) {
    //Steady state
    valueSlider.value = 0.5;
    valueSlider.min = 0;
    valueSlider.max = 1;

    const value = valueSlider.value
    fetchAndDrawPyfunc(parseFloat(value), 1);
  } else {
    //Transient
    valueSlider.value = 0.5;
    valueSlider.min = 0;
    valueSlider.max = 0.5;
    
    valueSlider2.value = 0.5;
    valueSlider2.min = 0;
    valueSlider2.max = 1;
    
    const value = valueSlider.value
    const value2 = valueSlider2.value
    fetchAndDrawPyfunc(parseFloat(value), parseFloat(value2), 1);
  }
});

// Draw the graph
function drawGraph(onloop) {
  if (!chart) {
    chart = new Chart(ctx, config);
  } else {
    chart.destroy()
    chart = new Chart(ctx, config);
  }
  if (!onloop) {
    resetChart();
  }

  // Update the slider label
  if (toggleTransientCheckbox.checked) {
    const formattedValue = parseFloat(valueSlider.value).toFixed(2);
    const formattedValue2 = parseFloat(valueSlider2.value).toFixed(2);
    sliderLabelText = 'f:'
    sliderLabelText2 = 'Drain:'
    sliderLabelElement.textContent = sliderLabelText + (formattedValue >= 0 ? ' ' : '') + formattedValue;
    sliderLabelElement2.textContent = sliderLabelText2 + (formattedValue2 >= 0 ? ' ' : '') + formattedValue2 + 'V';
  } else {
    const formattedValue = parseFloat(valueSlider.value).toFixed(2);
    sliderLabelText = 'Gate:'
    sliderLabelElement.textContent = sliderLabelText + (formattedValue >= 0 ? ' ' : '') + formattedValue + 'V';
    sliderLabelElement2.classList.add('hidden');
  }
}

// Fetch the data from the Python function
function fetchAndDrawPyfunc(parameter, onloop) {
  if (!Array.isArray(parameter)) {
    parameter = [parameter, 0];
  }
  console.log(parameter);

  const graphAspectRatio = deviceAspectRatio / 0.3;

  // When the toggleTransientCheckbox is checked, use the transient function
  if (document.getElementById('toggleTransientCheckbox').checked) {
    console.log('fetching transient');
    fetch(`/calculate_transient?f=${parameter[0]}&V=0.1`)
      .then(response => {
        console.log("what is f?")
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log(data)

        const t_values = data.map(item => item[0]);
        const I_values = data.map(item => item[1]);

        config = {
          type: 'scatter',
          data: {
            datasets: [{
              data: t_values.map((value, index) => ({ x: value, y: I_values[index] })),
              borderColor: 'rgba(0, 0, 0, 1)',
              borderWidth: 2,
              pointRadius: 2,
              pointBackgroundColor: 'black',
              pointBorderColor: 'blue',
              showLine: true,
            }]
          },
          options: {
            animation: {
              duration: 10,
            },
            aspectRatio: graphAspectRatio,
            layout: {
              padding: {
                bottom: 50
              }
            },
            plugins: {
              legend: {
                display: false
              },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Time (s) (norm.)'
                },
                min: Math.min(...t_values),
                max: Math.max(...t_values)
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Current (A) (norm.)'
                },
                min: -.2,
                max: 1.2
              }
            }
          }
        };
        
        drawGraph(onloop);
      })
      .catch(error => console.error('Error:', error));
    } 
  else 
  {
  // When the toggleTransientCheckbox is not checked, use the steady state function
  fetch(`/calculate_steady_state?V_G=${parameter[0]}`)
    .then(response => {
        console.log(response)
        return response.json()
      })
    .then(data => {
      const V_DS_values = data.map(item => item[0]);
      const I_DS_values = data.map(item => item[1]);

      config = {
        type: 'scatter',
        data: {
          datasets: [{
            data: V_DS_values.map((value, index) => ({ x: value, y: I_DS_values[index] })),
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: 'black',
            pointBorderColor: 'orange',
            showLine: true,
          }]
        },
        options: {
          animation: {
            duration: 10,
          },
          aspectRatio: graphAspectRatio,
          layout: {
            padding: {
              bottom: 50
            }
          },
          plugins: {
            legend: {
              display: false
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Voltage drain (V)',
              },
              min: Math.min(...V_DS_values),
              max: Math.max(...V_DS_values),
              ticks: {
                min: Math.min(...V_DS_values),
                max: Math.max(...V_DS_values),
                callback: function(value, index, values) {
                  return value.toExponential(2);
                },
              }
            },
            y: {
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Current drain (A)',
              },
              min: 3e-5,
              max: -1e-5,
              ticks: {
                callback: function(value, index, values) {
                  return value.toExponential(2);
                }
              }
            }
          }
        }
      };
    
      drawGraph(onloop);
      chart.data.datasets[0].data = V_DS_values.map((value, index) => ({ x: value, y: I_DS_values[index] }));
    })
    .catch(error => console.error('Error:', error));
  }
}

// Slider event listeners
valueSlider.addEventListener('input', eventlistener);
valueSlider2.addEventListener('input', eventlistener2);

function eventlistener() {
  fetchAndDrawPyfunc([parseFloat(event.target.value), parseFloat(valueSlider2.value)], 1);
  console.log('There is an event listener here!')
}
function eventlistener2() {
  fetchAndDrawPyfunc([parseFloat(valueSlider.value), parseFloat(event.target.value)], 1);
  console.log('There is an second event listener here!')
}

// Animation control
const animationDuration = 2430; // in milliseconds
const dotRadius = 3;
let animationStartTime;
let pointToShow = 0;

function animatePoints() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - animationStartTime;
  const progress = Math.min(elapsedTime / animationDuration, 1);

  const dataset = config.data.datasets[0];
  pointToShow = Math.ceil(progress * dataset.data.length);

  dataset.pointRadius = dataset.data.map((value, index) =>
    index < pointToShow ? dotRadius : 0
  );

  chart.update('none');

  if (document.getElementById('toggleTransientCheckbox').checked) {
    // Transient
  }
  else {
    // Steady state
    const ar_model = document.querySelector('a-entity[mindar-image-target]').childNodes[1]
    const animation_mixer = ar_model.components["animation-mixer"]
    const slid = document.getElementById('valueSlider').value
    const frame = (1-slid/2)*Math.E ** Math.abs((progress-0.5)*3)
    animation_mixer.mixer.setTime(frame)
  }

  if (progress < 1) {
    requestAnimationFrame(animatePoints);
  } else {
    resetChart();
  }
}

const resetChart = () => {
  if (config) {
    if (!chart.killme) {
      pointToShow = 0;
      playChart()
      console.log("reset")
      console.log(animationStartTime)
    }
    else{
      chart.destroy()
    }
  }
  const ar_model = document.querySelector('a-entity[mindar-image-target]').childNodes[1]
  ar_model.removeAttribute("animation-mixer");
  if (document.getElementById('toggleTransientCheckbox').checked) {
    // Transient
    ar_model.setAttribute("animation-mixer", {timeScale: 1, clip : "tr*"});
  }
  else {
    // Steady state
    ar_model.setAttribute("animation-mixer", {timeScale: 1, clip : "ss_hole*"});
  }
}

const playChart = () => {
  animationStartTime = Date.now();
  animatePoints(config);
};

const pauseChart = () => {
  pointToShow = chart.data.datasets[0].data.length;
  chart.update('none');
};

} // end if (ENABLE_CHART)
