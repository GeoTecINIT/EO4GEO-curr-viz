var d3 = require("d3");

var currentSelectedD = null;

var i = 0,
  duration = 750,
  root,
  treemap,
  svg,
  arc,
  pie,
  width,
  height;

var outerRadius = 10;
var innerRadius = 0;

var proportionsCode = {
  GI: 0,
  AM: 1,
  CF: 2,
  CV: 3,
  DA: 4,
  DM: 5,
  DN: 6,
  GC: 7,
  GD: 8, 
  GS: 9,
  MD: 10,
  OI: 11,
  SD: 12,
  SH: 13,
  WB: 14,
  PP: 15,
  PS: 16,
  no: 17,
  IP: 18,
  TA: 19
}

var codeColors = [
  "#ff7f0e",
  "#9467bd",
  "#8c564b",
  "#17becf",
  "#1f77b4",
  "#7f7f7f",
  "#17becf",
  "#d62728",
  "#e377c2",
  "#2ca02c",
  "#d62728",
  "#bcbd22",
  "#8c564b",
  "#e377c2",
  "#2ca02c",
  "#2ca02c",
  "#1f77b4",
  "#1f77b4",
  "#ff7f0e",
  "#d62728"
]

var colorForNode = "#75DCCD";
var colorForSelectedNode = "#096B5D";

//displays tree graph
exports.displayCurricula = function (tag = 'tree', treeData = treeData, initialWidth = 500, initialHeight = 650) {
    currentSelectedD = null;
    // Set the dimensions and margins of the diagram
    var margin = {
      top: 50,
      right: 15,
      bottom: 30,
      left: 5
    };
    width = initialWidth - margin.left - margin.right,
      height = initialHeight - margin.top - margin.bottom;

    d3.select("#" + tag).select("svg").remove();
    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    svg = d3.select("#" + tag).append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "svgGraphTree")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // declares a tree layout and assigns the size
    treemap = d3.tree().size([width, height]);

    arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    pie = d3.pie();

    if (treeData != null) {

      if (treeData.children.length != 0) {
        // tree is not already created
        if (!treeData.children[0].data) {
          // Assigns parent, children, height, depth
          root = d3.hierarchy(treeData, function (d) {
            return d.children;
          });
          root.x0 = width / 2;
          root.y0 = 0;
        }
      } else { // new SP
        // Assigns parent, children, height, depth
        root = d3.hierarchy(treeData, function (d) {
          return d.children;
        });
        root.x0 = width / 2;
        root.y0 = 0;
      }
      currentSelectedD = root;

      calculateNumChild(root.children);
      exports.update(root);
    }

    function calculateNumChild(children) {
      // recursively calculate proportions for child nodes
      // console.log("calculateNumChild");
      if (children && children.length > 0) {
        for (var j = 0; j < children.length; j++) {
          children[j].numNode = j;
          calculateNumChild(children[j].children);
        }
      }
    }
  },

  exports.update = function (source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = d.depth * 180
    });

    // ****************** Nodes section ***************************     

    // Update the nodes...
    var node = svg.selectAll('g.node')
      .data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("id", function (d) {
        return "node" + d.id; // d.data.name;
      })
      .attr("name", function (d) {
        return "node" + d.id;
      })
      .attr("transform", function (d) {
        if (source && source.x0) {
          //  console.log("translate(" + source.x0 + "," + source.y0 + ")");
          return "translate(" + source.x0 + "," + source.y0 + ")";
        } else {
          //   console.log("translate(" + 200 + "," + 0 + ")");
          return "translate(200,0)";
        }
      })
      .on('click', clickNodeTree)
      .style("fill", function (d) {
        if (currentSelectedD.id == d.id)
          return colorForSelectedNode;
        else
          return colorForNode;
      })
      .style("fill-opacity", 0.8);

    // Add Circle for the nodes
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("stroke-linecap", "round")
      .style("stroke-width", "1px")
      .style("stroke", "steelblue")
      .style("fill", function (d) {
        if (currentSelectedD.id == d.id)
          return colorForSelectedNode;
        else
          return colorForNode;
      })
      .style("fill-opacity", 0.8);

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr("y", function (d) {
        if (d.numNode % 2 != 0) {
          // return d.depth < 4 ? -18 : 18;
          return -18;
        } else {
          return 30;
        }
      }) //if it's last level, text goes below node, else above node
      .attr("dy", -1)
      .attr("x", function (d) {
        return 0; // return d.children || d._children ? -13 : 13;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(function (d) {
        return d.data.name;
      })
      .style("fill-opacity", 0.5);

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr("r", function (d) {
        if (currentSelectedD.id == d.id)
          return 15;
        else
          return 10;
      })
      .style("fill", function (d) { //change Node color depending on type
        if (currentSelectedD.id == d.id)
          return colorForSelectedNode;
        else
          return colorForNode;
      })
      .style("fill-opacity", 0.8)
      .attr('cursor', 'pointer');


    nodeUpdate.select("text")
      .text(function (d) {
        var abbr = false;
        if (d.data && d.data.name && d.data.name.length > 30) {
          return d.data.name.substring(0, 20) + "...";
        } else {
          return d.data.name;
        }
      })
      .attr("dy", function (d) {
        if (d.children) {
          return -1 - d.children.length * 1.5;
        } else {
          return -1;
        }
      })
      .style("fill-opacity", 0.7);

    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);


    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
      .data(links, function (d) {
        return d.id;
      });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .style("stroke-width", function (d) {
        return d.data.ects > 0 ? 15 + d.data.ects * 3 : 15;
      })
      .style("stroke", colorForNode)
      .style("fill", "none")
      .style("stroke-linecap", "round")
      .style("stroke-opacity", "0.2")
      .attr('d', function (d) {
        var o = {
          x: source.x0,
          y: source.y0
        }
        return diagonal(o, o)
      });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(duration)
      .attr('d', function (d) {
        return diagonal(d, d.parent)
      });

    // Remove any exiting links
    var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function (d) {
        var o = {
          x: source.x,
          y: source.y
        }
        return diagonal(o, o)
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    calculateProportionsForPie(root);

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

      path = `M ${s.x} ${s.y}
          C ${(s.x + d.x) / 2} ${s.y},
            ${(s.x + d.x) / 2} ${d.y},
            ${d.x} ${d.y}`

      return path
    }

    // Toggle children on click.
    function toggleNodes(d) {
      if (d.children) {
        d.isClosed = true;
        d._children = d.children;
        d.children = null;
      } else {
        d.isClosed = false;
        d.children = d._children;
        d._children = null;
      }
    }


    function clickNodeTree(d) {

      //if clicked twice, hide or show children
      if (currentSelectedD.id == d.id) { //already selected
        toggleNodes(d);
      } else { // new selection
        currentSelectedD = d;
      }
      exports.update(d);
      // redraw pies when parent closed
      drawPieForChildren(currentSelectedD);
    }

    function drawPieForChildren(node) {
      if (node.children && node.children.length > 0) {
        for (var j = 0; j < node.children.length; j++) {
          drawPieForChildren(node.children[j]);
          drawPie(node.children[j]);
        }
      }
    }

    function drawPie(pieNode) {
      var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);

      if (pieNode && pieNode.data.proportions && pieNode.data.proportions.length > 0) {

        //Pie chart
        d3.select("#node" + pieNode.id).selectAll("g.arc").remove();

        var nodeUpdate = d3.select("#node" + pieNode.id);

        arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(pieNode.data.r ? pieNode.data.r : 10);

        var arcs = nodeUpdate
          .append("g")
          .attr("class", "arc")
          .selectAll("g.arc")
          .data(function (d) {
            return pie(pieNode.data.proportions);
          })
          .enter();

        arcs.append("path")
          .attr("class", "pie")
          .attr("fill", function (d, i) {
            return codeColors[i];
          })
          .attr("d", arc);
      }
    }

    function calculateProportionsForPie(nodeDrawingPie) {
      //Pie chart
      d3.select("#node" + nodeDrawingPie.id).selectAll("g.arc").remove();
      var conceptId;
      nodeDrawingPie.data.proportions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (nodeDrawingPie.data.concepts && nodeDrawingPie.data.concepts.length > 0) {
        for (var i = 0; i < nodeDrawingPie.data.concepts.length; i++) {
          conceptId = nodeDrawingPie.data.concepts[i].substring(1, 3);
          nodeDrawingPie.data.proportions[proportionsCode[conceptId]]++;
        }
      }
      // recursively calculate proportions for child nodes
      if (nodeDrawingPie.children && nodeDrawingPie.children.length > 0) {
        for (var j = 0; j < nodeDrawingPie.children.length; j++) {
          calculateProportionsForPie(nodeDrawingPie.children[j]);
        }
      }
      drawPie(nodeDrawingPie)
    }
  },

  exports.addNewNodeWithDepth = function (nameNew, depth) {

    // If node children are closed copy them to prevent losing children
    if (currentSelectedD && currentSelectedD.children == null) {
      currentSelectedD.children = currentSelectedD._children;
    }

    var newNode = {
      name: nameNew,
      longName: nameNew,
      proportions: [],
      depth: depth,
      id: 0,
    };
    //Creates a Node from newNode object using d3.hierarchy(.)
    var newNode = d3.hierarchy(newNode);

    //later added some properties to Node like child,parent,depth
    newNode.depth = depth;
    newNode.height = 4 - depth;

    if (currentSelectedD) {

      newNode.parent = currentSelectedD;

      //Selected is a node, to which we are adding the new node as a child
      //If no child array, create an empty array
      if (currentSelectedD && !currentSelectedD.children) {
        currentSelectedD.children = [];
      }

      // newNode numNode to calculate text up or down
      newNode.numNode = currentSelectedD.children ? currentSelectedD.children.length : 0;

      //Push it to parent.children array  
      currentSelectedD.children.push(newNode);

      //Update tree
      exports.update(currentSelectedD);
    } else {
      root = d3.hierarchy(newNode, function (d) {
        return d.children;
      });
      currentSelectedD = root;
      exports.update(root);
    }
  },


  exports.addNewNode = function (nameNew) {

    // If node children are closed copy them to prevent losing children
    if (currentSelectedD.children == null) {
      currentSelectedD.children = currentSelectedD._children;
    }

    var newNode = {
      name: nameNew,
      longName: nameNew,
      proportions: []
    };
    //Creates a Node from newNode object using d3.hierarchy(.)
    var newNode = d3.hierarchy(newNode);

    //later added some properties to Node like child,parent,depth
    newNode.depth = currentSelectedD.depth + 1;
    newNode.height = currentSelectedD.height - 1;
    newNode.parent = currentSelectedD;
    // newNode.id = Date.now();

    //Selected is a node, to which we are adding the new node as a child
    //If no child array, create an empty array
    if (!currentSelectedD.children) {
      currentSelectedD.children = [];
    }

    // newNode numNode to calculate text up or down
    newNode.numNode = currentSelectedD.children ? currentSelectedD.children.length : 0;

    //Push it to parent.children array  
    currentSelectedD.children.push(newNode);

    //Update tree
    exports.update(currentSelectedD);

  },

  exports.addExistingNode = function (node) {

    // If node children are closed copy them to prevent losing children
    if (currentSelectedD.children == null) {
      currentSelectedD.children = currentSelectedD._children;
    }

    node.proportions = [];
    node.longName = node.name;

    //Creates a Node from newNode object using d3.hierarchy(.)
    var newNode = d3.hierarchy(node);

    //later added some properties to Node like child,parent,depth
    newNode.depth = currentSelectedD.depth + 1;
    newNode.height = currentSelectedD.height - 1;
    newNode.parent = currentSelectedD;
    // newNode.id = Date.now();

    // newNode numNode to calculate text up or down
    newNode.numNode = currentSelectedD.children ? currentSelectedD.children.length : 0;

    //Selected is a node, to which we are adding the new node as a child
    //If no child array, create an empty array
    if (!currentSelectedD.children) {
      currentSelectedD.children = [];
    }

    //add node children to this newNode
    if (newNode.children && newNode.children.length > 0) {
      newNode.children.forEach(c => {
        c.depth = currentSelectedD.depth + 2;
        if (c.children && c.children.length > 0) {
          c.children.forEach(gs => {
            gs.depth = currentSelectedD.depth + 3;
          })
        }
      })
    }

    //Push it to parent.children array  
    currentSelectedD.children.push(newNode);

    calculateNumChild(currentSelectedD.children);

    function calculateNumChild(children) {
      if (children && children.length > 0) {
        for (var j = 0; j < children.length; j++) {
          children[j].numNode = j;
          calculateNumChild(children[j].children);
        }
      }
    }

    //Update tree
    exports.update(currentSelectedD);

  },

  exports.removeSelectedNode = function () {
    var temp = currentSelectedD.parent;

    if (temp) {
      for (var i = 0; i < temp.children.length; i++) {
        if (temp.children[i] == currentSelectedD) {
          temp.children.splice(i, 1);
        }
      }
      if (temp.children.length == 0) {
        temp.children = null;
      }
      currentSelectedD = temp;
    }
    //Update tree
    exports.update(currentSelectedD);
  },

  exports.updateNode = function (node) {
    currentSelectedD.data = node;
    // currentSelectedD.data.longName = txt;
    //Update tree
    exports.update(currentSelectedD);
  },

  exports.getCurrentNode = function () {
    return currentSelectedD;
  }