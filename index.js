var d3 = require("d3");

var treeData = {
  "longName": "Family",
  "type": "studyProgram",
  "name": "id0",
  "parent": "null",
  "path": 0,
  "ects": 2,
  "nsemesters": 1,
  "proportions": [],
  "concepts": ["treeConcept.drag-drop-list-learn-obj.DM3-5b http:/…#DM3-5b_Resolution_and_georeferencing_system_rev3", "treeConcept.drag-drop-list-learn-obj.GD3-1 http://…tos/gin2k#GD3-1_Geographic_coordinate_system_rev1", "treeConcept.drag-drop-list-description.CV6-5b http…k#CV6-5b_Map_ethics_Legal_and_privacy_issues_rev5", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
  "r": 10,
  "level": "",
  "children": [{
      "name": "Maths",
      "longName": "Family",
      "proportions": [],
      "concepts": ["treeConcept.drag-drop-list-name.DM1-8 http://www.b…ledge.net/ontos/gin2k#DM1-8_XML_introduction_rev4", "treeConcept.drag-drop-list-learn-obj.GD3-1 http://…tos/gin2k#GD3-1_Geographic_coordinate_system_rev1", "treeConcept.drag-drop-list-description.CV6-5b http…k#CV6-5b_Map_ethics_Legal_and_privacy_issues_rev5", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
      "ects": 4,
      "r": 10,
      "children": [{
          "name": "Grandson",
          "proportions": [],
          "concepts": ["treeConcept.drag-drop-list-name.DM1-8 http://www.b…ledge.net/ontos/gin2k#DM1-8_XML_introduction_rev4", "treeConcept.drag-drop-list-learn-obj.DM3-5b http:/…#DM3-5b_Resolution_and_georeferencing_system_rev3", "treeConcept.drag-drop-list-learn-obj.GD3-1 http://…tos/gin2k#GD3-1_Geographic_coordinate_system_rev1", "treeConcept.drag-drop-list-description.CV6-5b http…k#CV6-5b_Map_ethics_Legal_and_privacy_issues_rev5", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
          "longName": "Family",
          "ects": 4,
          "r": 10,
        },
        {
          "name": "Granddaughter",
          "proportions": [],
          "concepts": ["treeConcept.drag-drop-list-name.DM1-8 http://www.b…ledge.net/ontos/gin2k#DM1-8_XML_introduction_rev4", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
          "longName": "Family",
          "ects": 3,
          "r": 10,
        }
      ]
    },
    {
      "name": "GIS",
      "longName": "Family",
      "proportions": [],
      "concepts": ["treeConcept.drag-drop-list-name.DM1-8 http://www.b…ledge.net/ontos/gin2k#DM1-8_XML_introduction_rev4", "treeConcept.drag-drop-list-learn-obj.GD3-1 http://…tos/gin2k#GD3-1_Geographic_coordinate_system_rev1", "treeConcept.drag-drop-list-description.CV6-5b http…k#CV6-5b_Map_ethics_Legal_and_privacy_issues_rev5", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
      "ects": 4,
      "r": 10,
      "children": [{
          "name": "Grandson2",
          "proportions": [],
          "concepts": ["treeConcept.drag-drop-list-name.DM1-8 http://www.b…ledge.net/ontos/gin2k#DM1-8_XML_introduction_rev4", "treeConcept.drag-drop-list-learn-obj.DM3-5b http:/…#DM3-5b_Resolution_and_georeferencing_system_rev3", "treeConcept.drag-drop-list-learn-obj.GD3-1 http://…tos/gin2k#GD3-1_Geographic_coordinate_system_rev1", "treeConcept.drag-drop-list-description.CV6-5b http…k#CV6-5b_Map_ethics_Legal_and_privacy_issues_rev5", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
          "longName": "Family",
          "ects": 4,
          "r": 10,
        },
        {
          "name": "Granddaughter2",
          "proportions": [],
          "concepts": ["treeConcept.drag-drop-list-name.DM1-8 http://www.b…ledge.net/ontos/gin2k#DM1-8_XML_introduction_rev4", "treeConcept.drag-drop-list-prereq.OI6-1 http://www…and_international_organizations_and_programs_rev1"],
          "longName": "Family",
          "ects": 3,
          "r": 10,
        }
      ]
    }
  ]
};

var currentSelectedD;

var i = 0,
  duration = 750,
  root,
  treemap,
  svg,
  arc,
  pie;

var outerRadius = 10;
var innerRadius = 0;

var proportionsCode = {
  AM: 0,
  CF: 2,
  CV: 3,
  DA: 5,
  DM: 8,
  DN: 10,
  GC: 9,
  GD: 1,
  GI: 11,
  GS: 6,
  OI: 4,
  WB: 7,
  SD: 13,
  SH: 14,
  SV: 15,
  Sa: 16,
  MD: 17,
  no: 12
}

var colorForNode = "#75DCCD";
var colorForSelectedNode = "#096B5D";

//displays tree graph
exports.displayCurricula = function (tag = 'tree', treeData = treeData, initialWidth = 500, initialHeight = 650) {
    // Set the dimensions and margins of the diagram
    var margin = {
        top: 50,
        right: 15,
        bottom: 30,
        left: 5
      },
      width = initialWidth - margin.left - margin.right,
      // width = d3.select("#" + tag).node().clientWidth - margin.left - margin.right,
      height = initialHeight - margin.top - margin.bottom;
    // height = d3.select("#" + tag).node().clientWidth - margin.top - margin.bottom;

    console.log('display curricula Width: ' + width);

    /*  var margin = 5,
     diameter = svg.node().getAttribute('viewBox').split(" ")[2],
     g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")"); */

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

    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function (d) {
      return d.children;
    });
    root.x0 = width / 2;
    root.y0 = 0;

    currentSelectedD = root;

    arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    pie = d3.pie();

    exports.update(root);
  },

  exports.update = function (source) {

    /*var width = d3.select("#" + tag).node().clientWidth - margin.left - margin.right,
     height = d3.select("#" + tag).node().clientWidth - margin.top - margin.bottom;
     svg.attr("width", width + margin.right + margin.left)
       .attr("height", height + margin.top + margin.bottom);

       */
    // console.log("update width: " +  document.getElementById("svgGraphTree").width)
    //  document.getElementById("svgGraphTree").width = 900;

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
        return "translate(" + source.x0 + "," + source.y0 + ")";
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
        return d.depth < 4 ? -18 : 18;
      }) //if it's last level, text goes below node, else above node
      .attr("dy", -1)
      .attr("x", function (d) {
        return d.children || d._children ? -13 : 13;
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
      // TODO: Abbreviations
        //   var abbr = document.getElementById("activateAbbreviation").checked;
        var abbr = false;
       /* if (d.parent && d.parent.children != null && d.data.name.length > 5 && abbr)
          return d.data.name.substring(0, 5) + "...";
        else
        */
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
            //  console.log(pieNode.data.proportions);
            // console.log("color for " + i + " is " + d3.schemeCategory10[i % d3.schemeCategory10.length])
            return d3.schemeCategory10[i % d3.schemeCategory10.length];
          })
          .attr("d", arc);
      }

    }

    function calculateProportionsForPie(nodeDrawingPie) {
      //Pie chart
      d3.select("#node" + nodeDrawingPie.id).selectAll("g.arc").remove();

      var conceptId;
      if (nodeDrawingPie.data.concepts && nodeDrawingPie.data.concepts.length > 0) {
        nodeDrawingPie.data.proportions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < nodeDrawingPie.data.concepts.length; i++) {
          conceptId = nodeDrawingPie.data.concepts[i].substring(1, 3);
          nodeDrawingPie.data.proportions[proportionsCode[conceptId]]++;
        }
      }
      // recursively calculate proportions for child nodes
      if (nodeDrawingPie.children && nodeDrawingPie.children.length > 0) {
        for (var j = 0; j < nodeDrawingPie.children.length; j++) {
          calculateProportionsForPie(nodeDrawingPie.children[j])
        }
      }
      drawPie(nodeDrawingPie)
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
      // -- currentSelectedD.data.children = [];
    }

    //Push it to parent.children array  
    currentSelectedD.children.push(newNode);
    // --  currentSelectedD.data.children.push(newNode.data);

    //Update tree
    exports.update(currentSelectedD);

  },

  exports.addExistingNode = function (node) {

    // If node children are closed copy them to prevent losing children
    if (currentSelectedD.children == null) {
      currentSelectedD.children = currentSelectedD._children;
    }

    /* var newNode = {
      name: node.name,
      longName: node.name,
      proportions: [],
      children: node.children
    }; */

    node.proportions = [];
    node.longName = node.name;

    //Creates a Node from newNode object using d3.hierarchy(.)
    var newNode = d3.hierarchy(node);

    //later added some properties to Node like child,parent,depth
    newNode.depth = currentSelectedD.depth + 1;
    newNode.height = currentSelectedD.height - 1;
    newNode.parent = currentSelectedD;
    // newNode.id = Date.now();

    //Selected is a node, to which we are adding the new node as a child
    //If no child array, create an empty array
    if (!currentSelectedD.children) {
      currentSelectedD.children = [];
      // --    currentSelectedD.data.children = [];
    }

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
    // --  currentSelectedD.data.children.push(newNode.data);

    //Update tree
    exports.update(currentSelectedD);

  },

  exports.removeSelectedNode = function () {
    var temp = currentSelectedD.parent;

    for (var i = 0; i < temp.children.length; i++) {
      if (temp.children[i] == currentSelectedD) {
        temp.children.splice(i, 1);
        // --    temp.data.children.splice(i, 1);
      }
    }
    /* for (var j = 0; j < temp.data.children.length; j++) {
       if (temp.data.children[j] == currentSelectedD) {
         temp.data.children.splice(j, 1);
       }
     }*/
    currentSelectedD = temp;
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