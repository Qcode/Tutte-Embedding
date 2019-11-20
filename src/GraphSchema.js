const schema = {
  title: 'Graph',
  type: 'object',
  additionalProperties: {
    type: 'object',
    required: ['nailed', 'adjacencyList', 'xPos', 'yPos'],
    properties: {
      nailed: {
        type: 'boolean',
      },
      adjacencyList: {
        type: 'array',
      },
      xPos: {
        type: 'number',
        minimum: 0,
        maximum: 1,
      },
      yPos: {
        type: 'number',
        minimum: 0,
        maximum: 1,
      },
    },
  },
};

export default schema;
