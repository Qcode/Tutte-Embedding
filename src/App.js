import React from 'react';
import AjvModule from 'ajv';
import schema from './GraphSchema';
import * as preloadedGraphs from './PreLoadedGraphs';
import Vertex from './Vertex';

const Ajv = new AjvModule();
const validateGraph = Ajv.compile(schema);
const noInvalidAdjacencies = graph => {
  for (const vertexIndex in graph) {
    for (let x = 0; x < graph[vertexIndex].adjacencyList.length; x++) {
      if (graph[graph[vertexIndex].adjacencyList[x]] === undefined) {
        return false;
      }
    }
  }
  return true;
};

const getMaxLineWidth = string =>
  string
    .split('\n')
    .reduce((acc, cur) => (cur.length > acc ? cur.length : acc), 0);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.canvasRef = React.createRef();
    this.loadGraph('icosahedralGraph', true);
    this.stepAnimation = this.stepAnimation.bind(this);
    this.randomizeFreeVertices = this.randomizeFreeVertices.bind(this);
    this.zoomGraph = this.zoomGraph.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.dragGraph = this.dragGraph.bind(this);
    this.recordAnimation = this.recordAnimation.bind(this);
    this.updateGraphJSON = this.updateGraphJSON.bind(this);
  }

  recordAnimation() {
    if (!this.state.recording) {
      const chunks = [];
      const canvas = this.canvasRef.current;
      const stream = canvas.captureStream(); // grab our canvas MediaStream
      this.mediaRecorder = new MediaRecorder(stream); // init the recorder
      this.mediaRecorder.ondataavailable = e => chunks.push(e.data);
      this.mediaRecorder.onstop = e =>
        this.saveVideo(new Blob(chunks, { type: 'video/webm' }));
      this.mediaRecorder.start();
    } else {
      this.mediaRecorder.stop();
    }
    this.setState(prevState => ({
      recording: !prevState.recording,
    }));
  }

  saveVideo(blob) {
    const a = document.createElement('a');
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(blob);
    a.download = 'myvid.webm';
    a.href = vid.src;
    a.click();
    window.URL.revokeObjectURL(vid.src);
  }

  getCanvasScale() {
    const canvas = this.canvasRef.current;
    const myCanvasWidth = this.state.canvasWidth ? this.state.canvasWidth : 640;
    const myCanvasHeight = this.state.canvasHeight
      ? this.state.canvasHeight
      : 360;
    return myCanvasHeight > myCanvasWidth ? myCanvasWidth : myCanvasHeight;
  }

  loadGraph(name, setStateDirectly) {
    let graph = preloadedGraphs[name]();
    const canvasScale = this.getCanvasScale();

    for (const vertexIndex in graph) {
      if (graph[vertexIndex].nailed === undefined) {
        graph[vertexIndex].nailed = false;
      }
      if (graph[vertexIndex].xPos === undefined) {
        graph[vertexIndex].xPos = Math.random();
      }
      if (graph[vertexIndex].yPos === undefined) {
        graph[vertexIndex].yPos = Math.random();
      }
    }

    const canvas = this.canvasRef.current;

    const myCanvasWidth = this.state.canvasWidth ? this.state.canvasWidth : 640;
    const myCanvasHeight = this.state.canvasHeight
      ? this.state.canvasHeight
      : 360;

    const baseState = {
      scale: 1,
      translateX: (myCanvasWidth - canvasScale) / 2,
      translateY: (myCanvasHeight - canvasScale) / 2,
      graph: graph,
      graphJSON: JSON.stringify(graph, null, 2),
    };

    if (setStateDirectly) {
      this.state = {
        ...baseState,
        showVertexIndices: false,
        vertexRadius: 0.5,
        playing: false,
        recording: false,
        animationSpeed: 16,
        canvasWidth: 640,
        canvasHeight: 360,
        freeEdgeWidth: 0.25,
        nailedEdgeWidth: 0.25,
      };
    } else {
      this.setState(baseState);
      this.renderGraph(graph);
    }
  }

  renderGraph(graph) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = '12px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const canvasScale = this.getCanvasScale();

    ctx.setTransform(
      this.state.scale,
      0,
      0,
      this.state.scale,
      this.state.translateX,
      this.state.translateY,
    );

    for (const vertexIndex in graph) {
      const vertex = graph[vertexIndex];

      for (let i = 0; i < vertex.adjacencyList.length; i++) {
        const adjacentVertex = graph[vertex.adjacencyList[i]];
        ctx.strokeStyle =
          vertex.nailed && adjacentVertex.nailed ? '#F00' : '#00F';
        ctx.lineWidth =
          vertex.nailed && adjacentVertex.nailed
            ? this.state.nailedEdgeWidth
            : this.state.freeEdgeWidth;
        ctx.beginPath();
        ctx.moveTo(vertex.xPos * canvasScale, vertex.yPos * canvasScale);
        ctx.lineTo(
          adjacentVertex.xPos * canvasScale,
          adjacentVertex.yPos * canvasScale,
        );
        ctx.stroke();
        ctx.closePath();
      }
    }
    for (const vertexIndex in graph) {
      const vertex = graph[vertexIndex];

      ctx.fillStyle = vertex.nailed ? '#F00' : '#000';
      ctx.beginPath();
      ctx.arc(
        vertex.xPos * canvasScale,
        vertex.yPos * canvasScale,
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
          vertex.xPos * canvasScale - this.state.vertexRadius / 2,
          vertex.yPos * canvasScale + this.state.vertexRadius / 2,
        );
      }
    }
    ctx.restore();
  }

  zoomGraph(e) {
    e.preventDefault();

    let currentTargetRect = e.currentTarget.getBoundingClientRect();

    const x = e.pageX - currentTargetRect.left;
    const y = e.pageY - currentTargetRect.top;

    const direction = e.deltaY > 0 ? -1 : 1;
    const factor = 0.05;

    this.setState(prevState => {
      const newScale = prevState.scale * 1 * direction * factor;
      if (prevState.scale + newScale < 0.5) {
        return {};
      }
      const translateX =
        prevState.translateX -
        ((x - prevState.translateX) / prevState.scale) * newScale;
      const translateY =
        prevState.translateY -
        ((y - prevState.translateY) / prevState.scale) * newScale;
      return {
        scale: prevState.scale + newScale,
        translateX,
        translateY,
      };
    }, this.renderGraph(this.state.graph));
  }

  startDrag(e) {
    let currentTargetRect = e.currentTarget.getBoundingClientRect();

    const x = e.pageX - currentTargetRect.left;
    const y = e.pageY - currentTargetRect.top;
    this.setState(prevState => ({
      dragging: true,
      startDragX: x - prevState.translateX,
      startDragY: y - prevState.translateY,
    }));
  }

  dragGraph(e) {
    if (this.state.dragging) {
      let currentTargetRect = e.currentTarget.getBoundingClientRect();

      const x = e.pageX - currentTargetRect.left;
      const y = e.pageY - currentTargetRect.top;

      this.setState(
        prevState => ({
          translateX: x - prevState.startDragX,
          translateY: y - prevState.startDragY,
        }),
        this.renderGraph(this.state.graph),
      );
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
        const finalXPos = (1 / degree) * xSum;
        const finalYPos = (1 / degree) * ySum;
        const dist = Math.sqrt(finalXPos * finalXPos + finalYPos * finalYPos);
        const unitVectorX = (finalXPos - vertex.xPos) / dist;
        const unitVectorY = (finalYPos - vertex.yPos) / dist;
        const scaleFactor = 0.15;

        let nextXPos = vertex.xPos + unitVectorX * scaleFactor;
        let nextYPos = vertex.yPos + unitVectorY * scaleFactor;
        if (
          Math.sqrt(
            Math.pow(nextXPos - vertex.xPos, 2) +
              Math.pow(nextYPos - vertex.yPos, 2),
          ) < 0.001
        ) {
          nextXPos = finalXPos;
          nextYPos = finalYPos;
        }
        newGraph[vertexIndex] = {
          nailed: false,
          adjacencyList: vertex.adjacencyList,
          xPos: nextXPos,
          yPos: nextYPos,
        };
      }
      graph = newGraph;
      newGraph = {};
    }
    this.renderGraph(graph);
    this.setState({ graph: graph, graphJSON: JSON.stringify(graph, null, 2) });
  }

  componentDidMount() {
    this.renderGraph(this.state.graph);
  }

  updateGraphJSON(e) {
    const newState = { graphJSON: e.target.value };
    try {
      const newGraph = JSON.parse(e.target.value);
      if (validateGraph(newGraph) && noInvalidAdjacencies(newGraph)) {
        newState.graph = newGraph;
      }
    } catch {}
    this.setState(newState, () => this.renderGraph(this.state.graph));
  }

  playAnimation(flipState) {
    const step = () => {
      this.stepAnimation(1, false);
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
    const canvas = this.canvasRef.current;
    const newGraph = this.state.graph;
    for (let vertexIndex in newGraph) {
      if (newGraph[vertexIndex].nailed) {
        continue;
      }
      newGraph[vertexIndex].xPos = Math.random();
      newGraph[vertexIndex].yPos = Math.random();
    }
    this.setState({ graph: newGraph });
    this.renderGraph(newGraph);
  }

  render() {
    return (
      <div>
        <div className="flex-container">
          <div className="container">
            <h1>Tutte Embedding</h1>
            <canvas
              onWheel={this.zoomGraph}
              onMouseDown={this.startDrag}
              onMouseUp={() => this.setState({ dragging: false })}
              onMouseMove={this.dragGraph}
              onMouseOut={() => this.setState({ dragging: false })}
              ref={this.canvasRef}
              width={this.state.canvasWidth}
              height={this.state.canvasHeight}
              id="tutte-embedding"
            />
          </div>
          <div className="container control-container">
            <h1>Controls</h1>
            <h2>Animation Controls</h2>
            <button onClick={() => this.stepAnimation()}>Step Animation</button>
            <button onClick={() => this.stepAnimation(50)}>
              Step Animation (50)
            </button>
            <button onClick={() => this.playAnimation(true)}>
              {!this.state.playing ? 'Play Animation' : 'Stop Animation'}
            </button>
            <button onClick={this.recordAnimation}>
              {!this.state.recording ? 'Record Canvas' : 'Stop Recording'}
            </button>
            <button onClick={this.randomizeFreeVertices}>
              Randomize free vertex positions
            </button>
            <h2>Graph Presets</h2>
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
            <h2>Display Controls</h2>
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
            <label> Canvas Width: </label>
            <input
              type="number"
              min="0"
              className="numberInput"
              value={this.state.canvasWidth}
              onChange={e =>
                this.setState({ canvasWidth: parseInt(e.target.value) }, () =>
                  this.renderGraph(this.state.graph),
                )
              }
            />
            <label> Canvas Height: </label>
            <input
              type="number"
              min="0"
              className="numberInput"
              value={this.state.canvasHeight}
              onChange={e =>
                this.setState({ canvasHeight: parseInt(e.target.value) }, () =>
                  this.renderGraph(this.state.graph),
                )
              }
            />
            <p>
              <label>Vertex Radius: </label>
              <input
                type="number"
                min="0"
                max="10"
                step="any"
                size={2}
                className="numberInput"
                value={this.state.vertexRadius}
                onChange={e =>
                  this.setState({ vertexRadius: Number(e.target.value) }, () =>
                    this.renderGraph(this.state.graph),
                  )
                }
              />
            </p>
            <p>
              <label>Frame Delay (in milliseconds)</label>
              <input
                type="number"
                min="0"
                step="any"
                max="1000"
                className="numberInput"
                value={this.state.animationSpeed}
                onChange={e =>
                  this.setState({ animationSpeed: parseInt(e.target.value) })
                }
              />
              <label>Free Edge Width:</label>
              <input
                type="number"
                min="0"
                step="any"
                max="10"
                className="numberInput"
                value={this.state.freeEdgeWidth}
                onChange={e =>
                  this.setState({ freeEdgeWidth: Number(e.target.value) }, () =>
                    this.renderGraph(this.state.graph),
                  )
                }
              />
              <label>Nailed Edge Width:</label>
              <input
                type="number"
                min="0"
                step="any"
                max="10"
                className="numberInput"
                value={this.state.nailedEdgeWidth}
                onChange={e =>
                  this.setState(
                    { nailedEdgeWidth: Number(e.target.value) },
                    () => this.renderGraph(this.state.graph),
                  )
                }
              />
            </p>
          </div>
          {!this.state.playing && (
            <div className="graph-container">
              <h1>Graph JSON Representation</h1>
              <textarea
                onChange={this.updateGraphJSON}
                cols={getMaxLineWidth(this.state.graphJSON) + 2}
                rows={this.state.graphJSON.split('\n').length}
                value={this.state.graphJSON}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
