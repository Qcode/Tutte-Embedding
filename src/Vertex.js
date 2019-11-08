import React from 'react';

function Vertex(props) {
  return (
    <p>
      Vertex {props.index}: xPos:{' '}
      <input
        onChange={e =>
          props.updateVertexProperty(
            props.index,
            'xPos',
            parseInt(e.target.value),
          )
        }
        min="0"
        max="640"
        type="number"
        className="numberInput"
        value={props.xPos}
      />
      , yPos:{' '}
      <input
        onChange={e =>
          props.updateVertexProperty(
            props.index,
            'yPos',
            parseInt(e.target.value),
          )
        }
        min="0"
        max="360"
        size={3}
        type="number"
        className="numberInput"
        value={props.yPos}
      />
      , Nailed:{' '}
      <input
        onChange={e =>
          props.updateVertexProperty(props.index, 'nailed', !props.nailed)
        }
        type="checkbox"
        checked={props.nailed}
      />
      adjacencyList:{' '}
      <input
        onChange={e => {
          props.updateVertexProperty(
            props.index,
            'adjacencyListText',
            e.target.value,
          );
        }}
        value={props.adjacencyListText}
      />
    </p>
  );
}

export default Vertex;
