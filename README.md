# EO4GEO-curr-viz

EO4GEO-curr-viz is an script to visualize curricula in a tree layout.

## Installation

Using npm: 

```bash
npm i @eo4geo/curr-viz
```


## Usage

Place a div and give it an id. If you want to show also the textual information, place a div and give it an id.
```html
<div id="graphTree"></div>

```

Then in Javascript:
```javascript
import * as cv from '@eo4geo/curr-viz';

[...]
// displays the 'program' tree
cv.displayCurricula('graphTree', program, width, height = 650);

// returns current selected node
cv.getCurrentNode();

// adds an existing node as a chils of the selected node
cv.addExistingNode(node);

// adds a new node as a child of the selected node with depth (0 for Study program, 1 for Modules, 2 for Courses and 3 for Lectures)
cv.addNewNodeWithDepth('New', depth);

// updates selected node with 'node' info
cv.updateNode(node);

```

