module.exports = {
  data: { name: "Get All Members Data Data" },
  category: "Member Data",
  UI: [
    {
      element: "store",
      storeAs: "store"
    }
  ],

  subtitle: (values, constants) => {
    return `Store As: ${constants.variable(values.store)}`
  },

  compatibility: ["Any"],
  async run(values, message, client, bridge) {
    var storedData = bridge.data.IO.get();
    let members = storedData.members;
    let endMembers = {};
    for (let memberID in members) {
      if (memberID.startsWith(bridge.guild.id)) {
        endMembers[memberID] = members[memberID];
      }
    }

    bridge.store(values.store, endMembers);
  }
}