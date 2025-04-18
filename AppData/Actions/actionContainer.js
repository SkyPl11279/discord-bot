module.exports = {
  category: "Actions",
  aliases: ["Run Actions", "Action Box", "Box", "Action Folder", "Folders Actions", "Contain Actions"],
  data: {
    name: "Action Container",
  },
  UI: [
    {
      element: "actions",
      name: "Actions",
      storeAs: "actions",
      large: true
    },
    "-",
    {
      element: "input",
      storeAs: "name",
      name: "Name"
    },
  ],
  subtitle: (data, constants) => {
    return `${data.name || ""}`
  },
  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    await bridge.runner(values.actions);
  },
};
