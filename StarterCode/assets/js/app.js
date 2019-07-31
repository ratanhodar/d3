d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
  });


var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 4;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

var cr;
function crGet() {
  if (width <= 530) {
    cr = 5;
  }
  else {
    cr = 10;
  }
}
crGet();
//Bottom Axis
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");
var mar = 10;
var lArea = 100;
var padd = 50;
var padd_left = 50;
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - lArea) / 2 + lArea) +
      ", " +
      (height - mar - padd) +
      ")"
  );
}
xTextRefresh();

// Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// B) Left Axis
// ============
var leftTextX = mar + padd_left;
var leftTextY = (height + lArea) / 2 - lArea;
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

// 3. Create our visualization function
function visualize(theData) {
  var curX = "poverty";
  var curY = "obesity";
  var xMin;
  var xMax;
  var yMin;
  var yMax;
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      var theX;
      var theState = "<div>" + d.state + "</div>";
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      if (curX === "poverty") {
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      return theState + theX + theY;
    });
  svg.call(toolTip);

  function xMM() {
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
        // return parseFloat(d[curX]);
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    //   return parseFloat(d[curX]);
    });
  }

  function yMM() {
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  function changel(axis, clickedText) {
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    clickedText.classed("inactive", false).classed("active", true);
  }

  xMM();
  yMM();

  var xS = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([mar + lArea, width - mar]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - mar - lArea, mar]);

  var xAxis = d3.axisBottom(xS);
  var yAxis = d3.axisLeft(yScale);

  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - mar - lArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (mar + lArea) + ", 0)");

  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xS(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", cr)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    
theCircles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return xS(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + cr / 2;
    })
    .attr("font-size", cr)
    .attr("class", "stateText")
    

  d3.selectAll(".aText").on("click", function() {
    var self = d3.select(this);

    if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");
      if (axis === "x") {
        curX = name;
        xMM();
        xS.domain([xMin, xMax]);
        svg.select(".xAxis").transition().duration(300).call(xAxis);
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xS(d[curX]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xS(d[curX]);
            })
            .duration(300);
        });

        changel(axis, self);
      }
      else {
        curY = name;

        yMM();

        yScale.domain([yMin, yMax]);

        svg.select(".yAxis").transition().duration(300).call(yAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + cr / 3;
            })
            .duration(300);
        });

        changel(axis, self);
      }
    }
  });

  // Part 5: Mobile Responsive
  d3.select(window).on("resize", resize);

  function resize() {
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 4;
    leftTextY = (height + lArea) / 2 - lArea;

    svg.attr("width", width).attr("height", height);

    xS.range([mar + lArea, width - mar]);
    yScale.range([height - mar - lArea, mar]);

    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - mar - lArea) + ")");

    svg.select(".yAxis").call(yAxis);

    tickCount();

    xTextRefresh();
    yTextRefresh();

    crGet();

    
  }
}
