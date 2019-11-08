function icosahedralGraph() {
  let graph = {};
  graph[0] = {
    nailed: true,
    adjacencyList: [1, 2, 3, 7, 8],
    xPos: 128,
    yPos: 72,
  };

  graph[1] = {
    nailed: true,
    adjacencyList: [0, 2, 3, 4, 5],
    xPos: 512,
    yPos: 72,
  };

  graph[2] = {
    nailed: true,
    adjacencyList: [0, 1, 5, 6, 7],
    xPos: 320,
    yPos: 288,
  };

  graph[3] = {
    adjacencyList: [0, 1, 4, 8, 9],
  };
  graph[4] = {
    adjacencyList: [1, 3, 5, 9, 11],
  };
  graph[5] = {
    adjacencyList: [1, 2, 4, 6, 11],
  };
  graph[6] = {
    adjacencyList: [2, 5, 7, 10, 11],
  };
  graph[7] = {
    adjacencyList: [0, 2, 6, 8, 10],
  };
  graph[8] = {
    adjacencyList: [0, 3, 7, 9, 10],
  };
  graph[9] = {
    adjacencyList: [3, 4, 8, 10, 11],
  };
  graph[10] = {
    adjacencyList: [6, 7, 8, 9, 11],
  };
  graph[11] = {
    adjacencyList: [4, 5, 6, 9, 10],
  };
  return graph;
}

function fullereneHexGraph() {
  let graph = {};
  graph[1] = { adjacencyList: [18, 19, 2] };
  graph[2] = { adjacencyList: [1, 3, 40] };
  graph[3] = { adjacencyList: [2, 32, 4] };
  graph[4] = { adjacencyList: [3, 5, 41] };
  graph[5] = { adjacencyList: [4, 30, 6] };
  graph[6] = { adjacencyList: [5, 7, 43] };
  graph[7] = { adjacencyList: [6, 29, 8] };
  graph[8] = { adjacencyList: [7, 9, 45] };
  graph[9] = { adjacencyList: [8, 27, 10] };
  graph[10] = { adjacencyList: [9, 11, 46] };
  graph[11] = { adjacencyList: [10, 25, 12] };
  graph[12] = { adjacencyList: [11, 13, 48] };
  graph[13] = { adjacencyList: [12, 24, 14] };
  graph[14] = { adjacencyList: [13, 15, 50] };
  graph[15] = { adjacencyList: [14, 22, 16] };
  graph[16] = { adjacencyList: [15, 17, 51] };
  graph[17] = { adjacencyList: [16, 20, 18] };
  graph[18] = { adjacencyList: [17, 1, 53] };
  graph[19] = { adjacencyList: [1, 20, 33] };
  graph[20] = { adjacencyList: [19, 17, 21] };
  graph[21] = { adjacencyList: [20, 22, 35] };
  graph[22] = { adjacencyList: [21, 15, 23] };
  graph[23] = { adjacencyList: [22, 24, 36] };
  graph[24] = { adjacencyList: [23, 13, 25] };
  graph[25] = { adjacencyList: [24, 11, 26] };
  graph[26] = { adjacencyList: [25, 27, 37] };
  graph[27] = { adjacencyList: [26, 9, 28] };
  graph[28] = { adjacencyList: [27, 29, 38] };
  graph[29] = { adjacencyList: [28, 7, 30] };
  graph[30] = { adjacencyList: [29, 5, 31] };
  graph[31] = { adjacencyList: [30, 32, 39] };
  graph[32] = { adjacencyList: [31, 3, 33] };
  graph[33] = { adjacencyList: [32, 19, 34] };
  graph[34] = { adjacencyList: [33, 35, 39] };
  graph[35] = { adjacencyList: [34, 21, 36] };
  graph[36] = { adjacencyList: [35, 23, 37] };
  graph[37] = { adjacencyList: [36, 26, 38] };
  graph[38] = { adjacencyList: [37, 28, 39] };
  graph[39] = { adjacencyList: [38, 31, 34] };
  graph[40] = { adjacencyList: [2, 41, 54] };
  graph[41] = { adjacencyList: [40, 4, 42] };
  graph[42] = { adjacencyList: [41, 43, 56] };
  graph[43] = { adjacencyList: [42, 6, 44] };
  graph[44] = { adjacencyList: [43, 45, 57] };
  graph[45] = { adjacencyList: [44, 8, 46] };
  graph[46] = { adjacencyList: [45, 10, 47] };
  graph[47] = { adjacencyList: [46, 48, 58] };
  graph[48] = { adjacencyList: [47, 12, 49] };
  graph[49] = { adjacencyList: [48, 50, 59] };
  graph[50] = { adjacencyList: [49, 14, 51] };
  graph[51] = { adjacencyList: [50, 16, 52] };
  graph[52] = { adjacencyList: [51, 53, 60] };
  graph[53] = { adjacencyList: [52, 18, 54] };
  graph[54] = { adjacencyList: [53, 40, 55] };

  graph[55] = {
    xPos: 192,
    yPos: 72,
    nailed: true,
    adjacencyList: [54, 56, 60],
  };
  graph[56] = {
    xPos: 448,
    yPos: 72,
    nailed: true,
    adjacencyList: [55, 42, 57],
  };
  graph[57] = {
    xPos: 576,
    yPos: 180,
    nailed: true,
    adjacencyList: [56, 44, 58],
  };
  graph[58] = {
    xPos: 448,
    yPos: 288,
    nailed: true,
    adjacencyList: [57, 47, 59],
  };
  graph[59] = {
    xPos: 192,
    yPos: 288,
    nailed: true,
    adjacencyList: [58, 49, 60],
  };
  graph[60] = {
    xPos: 64,
    yPos: 180,
    nailed: true,
    adjacencyList: [59, 52, 55],
  };

  for (let x = 0; x < 60; x++) {
    graph[x] = graph[x + 1];
    graph[x].adjacencyList = graph[x].adjacencyList.map(el => el - 1);
  }
  delete graph[60];
  return graph;
}

function fullerenePentGraph() {
  let graph = {};
  graph[1] = { adjacencyList: [10, 11, 2] };
  graph[2] = { adjacencyList: [1, 3, 56] };
  graph[3] = { adjacencyList: [2, 19, 4] };
  graph[4] = { adjacencyList: [3, 5, 57] };
  graph[5] = { adjacencyList: [4, 17, 6] };
  graph[6] = { adjacencyList: [5, 7, 58] };
  graph[7] = { adjacencyList: [6, 15, 8] };
  graph[8] = { adjacencyList: [7, 9, 59] };
  graph[9] = { adjacencyList: [8, 13, 10] };
  graph[10] = { adjacencyList: [9, 1, 60] };
  graph[11] = { adjacencyList: [1, 12, 20] };
  graph[12] = { adjacencyList: [11, 13, 23] };
  graph[13] = { adjacencyList: [12, 9, 14] };
  graph[14] = { adjacencyList: [13, 15, 25] };
  graph[15] = { adjacencyList: [14, 7, 16] };
  graph[16] = { adjacencyList: [15, 17, 27] };
  graph[17] = { adjacencyList: [16, 5, 18] };
  graph[18] = { adjacencyList: [17, 19, 29] };
  graph[19] = { adjacencyList: [18, 3, 20] };
  graph[20] = { adjacencyList: [19, 11, 21] };
  graph[21] = { adjacencyList: [20, 22, 30] };
  graph[22] = { adjacencyList: [21, 23, 33] };
  graph[23] = { adjacencyList: [22, 12, 24] };
  graph[24] = { adjacencyList: [23, 25, 35] };
  graph[25] = { adjacencyList: [24, 14, 26] };
  graph[26] = { adjacencyList: [25, 27, 37] };
  graph[27] = { adjacencyList: [26, 16, 28] };
  graph[28] = { adjacencyList: [27, 29, 39] };
  graph[29] = { adjacencyList: [28, 18, 30] };
  graph[30] = { adjacencyList: [29, 21, 31] };
  graph[31] = { adjacencyList: [30, 32, 40] };
  graph[32] = { adjacencyList: [31, 33, 43] };
  graph[33] = { adjacencyList: [32, 22, 34] };
  graph[34] = { adjacencyList: [33, 35, 45] };
  graph[35] = { adjacencyList: [34, 24, 36] };
  graph[36] = { adjacencyList: [35, 37, 47] };
  graph[37] = { adjacencyList: [36, 26, 38] };
  graph[38] = { adjacencyList: [37, 39, 49] };
  graph[39] = { adjacencyList: [38, 28, 40] };
  graph[40] = { adjacencyList: [39, 31, 41] };
  graph[41] = { adjacencyList: [40, 42, 50] };
  graph[42] = { adjacencyList: [41, 43, 52] };
  graph[43] = { adjacencyList: [42, 32, 44] };
  graph[44] = { adjacencyList: [43, 45, 53] };
  graph[45] = { adjacencyList: [44, 34, 46] };
  graph[46] = { adjacencyList: [45, 47, 54] };
  graph[47] = { adjacencyList: [46, 36, 48] };
  graph[48] = { adjacencyList: [47, 49, 55] };
  graph[49] = { adjacencyList: [48, 38, 50] };
  graph[50] = { adjacencyList: [49, 41, 51] };
  graph[51] = { adjacencyList: [50, 52, 55] };
  graph[52] = { adjacencyList: [51, 42, 53] };
  graph[53] = { adjacencyList: [52, 44, 54] };
  graph[54] = { adjacencyList: [53, 46, 55] };
  graph[55] = { adjacencyList: [54, 48, 51] };
  graph[56] = { nailed: true, xPos: 320, yPos: 0, adjacencyList: [2, 57, 60] };
  graph[57] = {
    nailed: true,
    xPos: 132,
    yPos: 137,
    adjacencyList: [56, 4, 58],
  };
  graph[58] = {
    nailed: true,
    xPos: 204,
    yPos: 358,
    adjacencyList: [57, 6, 59],
  };
  graph[59] = {
    nailed: true,
    xPos: 436,
    yPos: 358,
    adjacencyList: [58, 8, 60],
  };
  graph[60] = {
    nailed: true,
    xPos: 508,
    yPos: 137,
    adjacencyList: [59, 10, 56],
  };
  for (let x = 0; x < 60; x++) {
    graph[x] = graph[x + 1];
    graph[x].adjacencyList = graph[x].adjacencyList.map(el => el - 1);
  }
  delete graph[60];
  return graph;
}

function dodecGraph() {
  let graph = {};
  graph[1] = { nailed: true, xPos: 320, yPos: 0, adjacencyList: [2, 5, 6] };
  graph[2] = {
    nailed: true,
    xPos: 132,
    yPos: 137,
    adjacencyList: [1, 3, 8],
  };
  graph[3] = {
    nailed: true,
    xPos: 204,
    yPos: 358,
    adjacencyList: [2, 4, 10],
  };
  graph[4] = {
    nailed: true,
    xPos: 436,
    yPos: 358,
    adjacencyList: [3, 5, 12],
  };
  graph[5] = {
    nailed: true,
    xPos: 508,
    yPos: 137,
    adjacencyList: [1, 4, 14],
  };
  graph[6] = { adjacencyList: [1, 7, 15] };
  graph[7] = { adjacencyList: [6, 8, 17] };
  graph[8] = { adjacencyList: [2, 7, 9] };
  graph[9] = { adjacencyList: [8, 10, 18] };
  graph[10] = { adjacencyList: [3, 9, 11] };
  graph[11] = { adjacencyList: [10, 12, 19] };
  graph[12] = { adjacencyList: [4, 11, 13] };
  graph[13] = { adjacencyList: [12, 14, 20] };
  graph[14] = { adjacencyList: [5, 13, 15] };
  graph[15] = { adjacencyList: [6, 14, 16] };
  graph[16] = { adjacencyList: [15, 17, 20] };
  graph[17] = { adjacencyList: [7, 16, 18] };
  graph[18] = { adjacencyList: [9, 17, 19] };
  graph[19] = { adjacencyList: [11, 18, 20] };
  graph[20] = { adjacencyList: [13, 16, 19] };
  for (let x = 0; x < 20; x++) {
    graph[x] = graph[x + 1];
    graph[x].adjacencyList = graph[x].adjacencyList.map(el => el - 1);
  }
  delete graph[20];
  return graph;
}

const size = 7;
const coordsToIndex = (x, y) => size * x + y;
const indexToCoords = index => ({
  x: Math.floor(index / size),
  y: index % size,
});

function grid() {
  let graph = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let vertex = {};
      if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
        vertex.nailed = true;
        vertex.xPos = (x + 1) * 80;
        vertex.yPos = (y + 1) * 45;
      }
      const adjList = [];
      if (x !== 0) {
        adjList.push(coordsToIndex(x - 1, y));
      }
      if (x !== size - 1) {
        adjList.push(coordsToIndex(x + 1, y));
      }
      if (y !== 0) {
        adjList.push(coordsToIndex(x, y - 1));
      }
      if (y !== size - 1) {
        adjList.push(coordsToIndex(x, y + 1));
      }
      vertex.adjacencyList = adjList;
      graph[coordsToIndex(x, y)] = vertex;
    }
  }
  return graph;
}

function gridDiagonal() {
  let graph = grid();
  for (let z = 0; z < size * size; z++) {
    const coords = indexToCoords(z);
    if (coords.y > 0 && coords.x < size - 1) {
      graph[z].adjacencyList.push(coordsToIndex(coords.x + 1, coords.y - 1));
    }
    if (coords.y < size - 1 && coords.x > 0) {
      graph[z].adjacencyList.push(coordsToIndex(coords.x - 1, coords.y + 1));
    }
  }
  return graph;
}

function setToCircle(graph) {
  let circlePos = 0;
  let radius = 150;
  const arcLength = (Math.PI * 2) / (4 * (size - 1));
  const setVertexPos = (x, y) => {
    const index = coordsToIndex(x, y);
    const newX = 320 + radius * Math.cos(circlePos * arcLength);
    const newY = 180 + radius * Math.sin(circlePos * arcLength);
    ++circlePos;
    graph[index].xPos = newX;
    graph[index].yPos = newY;
  };

  for (let x = 0; x < size; x++) {
    setVertexPos(x, 0);
  }
  for (let y = 1; y < size; y++) {
    setVertexPos(size - 1, y);
  }
  for (let x = size - 2; x >= 0; x--) {
    setVertexPos(x, size - 1);
  }
  for (let y = size - 2; y > 0; y--) {
    setVertexPos(0, y);
  }
  return graph;
}

function gridCircle() {
  return setToCircle(grid());
}

function gridCircleDiagonal() {
  return setToCircle(gridDiagonal());
}

export {
  icosahedralGraph,
  fullereneHexGraph,
  fullerenePentGraph,
  dodecGraph,
  grid,
  gridDiagonal,
  gridCircle,
  gridCircleDiagonal,
};
