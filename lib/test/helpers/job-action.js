export default {

  friendlyName: 'Job Test',

  description: 'This is a machine test',

  inputs: {
    test: {
      type: 'boolean',
      required: true
    }
  },

  exits: {
    success: {
      done: 'Yay done'
    }
  },

  async fn(inputs, exits) {
    try {
      return exits.success(inputs)
    } catch (e) {
      return exits.error(e)
    }

  }
}
