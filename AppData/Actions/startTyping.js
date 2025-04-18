module.exports = {
  data: { name: "Start Typing" },
  category: "Channels",
  UI: [
    {
      element: "channelInput",
      name: "In Channel",
      storeAs: "channel"
    }
  ],

  subtitle: (values, constants) => {
    return `In ${constants.channel(values.channel)}`
  },
  compatibility: ["Any"],

  async run(values, message, client, bridge) {
    let channel = await bridge.getChannel(values.channel)

    await channel.sendTyping()
  },
};
