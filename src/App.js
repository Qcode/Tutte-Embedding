import React from 'react';
import * as preloadedGraphs from './PreLoadedGraphs';
import Vertex from './Vertex';

const canvasWidth = 640;
const canvasHeight = 360;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.loadGraph('icosahedralGraph', true);
    this.stepAnimation = this.stepAnimation.bind(this);
    this.updateVertexProperty = this.updateVertexProperty.bind(this);
    this.changeVertexCount = this.changeVertexCount.bind(this);
    this.randomizeFreeVertices = this.randomizeFreeVertices.bind(this);
  }

  loadGraph(name, setStateDirectly) {
    let graph = preloadedGraphs[name]();

    for (const vertexIndex in graph) {
      if (!graph[vertexIndex].nailed === undefined) {
        graph[vertexIndex].nailed = false;
      }
      if (graph[vertexIndex].xPos === undefined) {
        graph[vertexIndex].xPos = Math.round(Math.random() * canvasWidth);
      }
      if (graph[vertexIndex].yPos === undefined) {
        graph[vertexIndex].yPos = Math.round(Math.random() * canvasHeight);
      }
      graph[vertexIndex].adjacencyListText = JSON.stringify(
        graph[vertexIndex].adjacencyList,
      );
    }

    if (setStateDirectly) {
      this.state = {
        graph: graph,
        showVertexIndices: true,
        vertexRadius: 2,
        playing: false,
        animationSpeed: 50,
      };
    } else {
      this.setState({ graph: graph });
      this.renderGraph(graph);
    }
  }

  renderGraph(graph) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = '12px Arial';

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const vertexIndex in graph) {
      const vertex = graph[vertexIndex];

      for (let i = 0; i < vertex.adjacencyList.length; i++) {
        const adjacentVertex = graph[vertex.adjacencyList[i]];
        ctx.strokeStyle =
          vertex.nailed && adjacentVertex.nailed ? '#F00' : '#00F';
        ctx.beginPath();
        ctx.moveTo(vertex.xPos, vertex.yPos);
        ctx.lineTo(adjacentVertex.xPos, adjacentVertex.yPos);
        ctx.stroke();
        ctx.closePath();
      }
    }
    for (const vertexIndex in graph) {
      const vertex = graph[vertexIndex];

      ctx.fillStyle = vertex.nailed ? '#F00' : '#000';
      ctx.beginPath();
      ctx.arc(
        vertex.xPos,
        vertex.yPos,
        this.state.vertexRadius,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      ctx.closePath();
      if (this.state.showVertexIndices) {
        ctx.fillStyle = '#0F0';
        ctx.fillText(
          vertexIndex,
          vertex.xPos - this.state.vertexRadius / 2,
          vertex.yPos + this.state.vertexRadius / 2,
        );
      }
    }
  }

  stepAnimation(iterations = 1) {
    let graph = this.state.graph;
    let newGraph = {};
    for (let x = 0; x < iterations; x++) {
      for (const vertexIndex in graph) {
        const vertex = graph[vertexIndex];
        if (vertex.nailed) {
          newGraph[vertexIndex] = graph[vertexIndex];
          continue;
        }
        const degree = vertex.adjacencyList.length;
        const xSum = vertex.adjacencyList.reduce(
          (acc, cur) => acc + graph[cur].xPos,
          0,
        );
        const ySum = vertex.adjacencyList.reduce(
          (acc, cur) => acc + graph[cur].yPos,
          0,
        );
        const newXPos = (1 / degree) * xSum;
        const newYPos = (1 / degree) * ySum;
        const dist = Math.sqrt(newXPos * newXPos + newYPos * newYPos);
        const unitVectorX = (newXPos - vertex.xPos) / dist;
        const unitVectorY = (newYPos - vertex.yPos) / dist;
        const scaleFactor = 100;
        newGraph[vertexIndex] = {
          nailed: false,
          adjacencyList: vertex.adjacencyList,
          xPos: vertex.xPos + unitVectorX * scaleFactor,
          yPos: vertex.yPos + unitVectorY * scaleFactor,
          adjacencyListText: JSON.stringify(vertex.adjacencyList),
        };
      }
      graph = newGraph;
      newGraph = {};
    }
    this.renderGraph(graph);
    this.setState({ graph: graph });
  }

  componentDidMount() {
    this.renderGraph(this.state.graph);
  }

  updateVertexProperty(index, property, value) {
    const newGraph = {
      ...this.state.graph,
      [index]: { ...this.state.graph[index], [property]: value },
    };
    if (property === 'adjacencyListText') {
      try {
        const jsonValue = JSON.parse(value);
        const isValidList =
          jsonValue.filter(el => !(el in this.state.graph)).length === 0;
        console.log(jsonValue, isValidList);
        if (isValidList) {
          newGraph[index].adjacencyList = jsonValue;
        }
      } catch {
        // do nothing
      }
    }
    this.setState(prevState => ({
      graph: newGraph,
    }));
    this.renderGraph(newGraph);
  }

  changeVertexCount(event) {
    const newVertexCount = parseInt(event.target.value);
    if (!isNaN(newVertexCount)) {
      const prevVertexCount = Object.keys(this.state.graph).length;
      let newGraph = this.state.graph;
      if (newVertexCount > prevVertexCount) {
        for (let i = prevVertexCount; i < newVertexCount; i++) {
          newGraph[i] = {
            nailed: false,
            xPos: Math.random() * canvasWidth,
            yPos: Math.random() * canvasHeight,
            adjacencyList: [],
            adjacencyListText: JSON.stringify([]),
          };
        }
      } else if (newVertexCount < prevVertexCount) {
        for (let i = prevVertexCount; i > newVertexCount; i--) {
          delete newGraph[i - 1];
          for (let j = 0; j < i - 1; j++) {
            newGraph[j].adjacencyList = newGraph[j].adjacencyList.filter(
              v => v !== i - 1,
            );
            newGraph[j].adjacencyListText = JSON.stringify(
              newGraph[j].adjacencyList,
            );
          }
        }
      }
      this.setState({ graph: newGraph });
      this.renderGraph(newGraph);
    }
  }

  playAnimation(flipState) {
    const step = () => {
      this.stepAnimation();
      if (this.state.playing) {
        setTimeout(() => this.playAnimation(), this.state.animationSpeed);
      }
    };
    if (flipState) {
      this.setState(
        prevState => ({
          playing: !prevState.playing,
        }),
        step,
      );
    } else {
      step();
    }
  }

  randomizeFreeVertices() {
    const newGraph = this.state.graph;
    for (let vertexIndex in newGraph) {
      if (newGraph[vertexIndex].nailed) {
        continue;
      }
      newGraph[vertexIndex].xPos = Math.random() * canvasWidth;
      newGraph[vertexIndex].yPos = Math.random() * canvasHeight;
    }
    this.setState({ graph: newGraph });
    this.renderGraph(newGraph);
  }

  render() {
    return (
      <div>
        <div className="grid">
          <h1>Tutte Embedding</h1>
          <h1>Graph Information</h1>
          <div className="container-item">
            <canvas
              ref={this.canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              id="tutte-embedding"
            />
            <button onClick={() => this.stepAnimation()}>Step Animation</button>
            <button onClick={() => this.stepAnimation(50)}>
              Step Animation (50)
            </button>
            <button onClick={() => this.playAnimation(true)}>
              {!this.state.playing ? 'Play Animation' : 'Stop Animation'}
            </button>
            <button onClick={() => this.loadGraph('icosahedralGraph')}>
              Icosahedral Graph
            </button>
            <button onClick={() => this.loadGraph('fullereneHexGraph')}>
              Fullerene Graph (hexagon)
            </button>
            <button onClick={() => this.loadGraph('fullerenePentGraph')}>
              Fullerene Graph (pentgaon)
            </button>
            <button onClick={() => this.loadGraph('dodecGraph')}>
              Dodecahedron Graph
            </button>
            <button onClick={() => this.loadGraph('grid')}>7x7 grid</button>
            <button onClick={() => this.loadGraph('gridDiagonal')}>
              7x7 grid (w/ diagonals)
            </button>
            <button onClick={() => this.loadGraph('gridCircle')}>
              7x7 circle grid
            </button>
            <button onClick={() => this.loadGraph('gridCircleDiagonal')}>
              7x7 circle grid (w/ diagonals)
            </button>
            <button onClick={this.randomizeFreeVertices}>
              Randomize free vertex positions
            </button>
            <label>Show vertex indices:</label>
            <input
              type="checkbox"
              checked={this.state.showVertexIndices}
              onChange={() => {
                this.setState(
                  prevState => ({
                    showVertexIndices: !prevState.showVertexIndices,
                  }),
                  () => this.renderGraph(this.state.graph),
                );
              }}
            />
            <label>Vertex Radius</label>
            <input
              type="number"
              min="0"
              max="10"
              value={this.state.vertexRadius}
              onChange={e =>
                this.setState({ vertexRadius: parseInt(e.target.value) }, () =>
                  this.renderGraph(this.state.graph),
                )
              }
            />
            <label>Animation Speed</label>
            <input
              type="number"
              min="0"
              max="1000"
              value={this.state.animationSpeed}
              onChange={e =>
                this.setState({ animationSpeed: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="container-item">
            Vertex Count:{' '}
            <input
              type="number"
              onChange={this.changeVertexCount}
              value={Object.keys(this.state.graph).length}
            />
            {Object.keys(this.state.graph).map(v => (
              <Vertex
                key={v}
                updateVertexProperty={this.updateVertexProperty}
                index={v}
                {...this.state.graph[v]}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
