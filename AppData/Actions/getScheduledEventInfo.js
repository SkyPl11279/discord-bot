module.exports = {
  data: {
    name: "Get Scheduled Event Info",
  },
  category: "Server Events",
  UI: [
    {
      element: "var",
      storeAs: "event"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name", category: "Basic Info" },
        description: { name: "Description" },
        id: { name: "ID" },
        creator: { name: "Creator" },
        createdAt: { name: "Creation Timestamp" },

        coverURL: { name: "Cover URL", category: "Assets" },

        location: { name: "Location", category: "Location" },
        channel: { name: "Channel" },

        scheduleStartAt: { name: "Scheduled Start Timestamp", category: "Schedule" },
        scheduleEndAt: { name: "Scheduled End Timestamp" },
        
        userCount: { name: "Interested Users Count", category: "Misc" },
      },
    },
    "-",
    {
      element: "store",
      name: "Store As",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.user(values.event)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    var event = await bridge.get(values.event);

    let output;
      switch (values.get.type) {
        case "createdAt":
          output = event.createdAt.getTime();
          break;
        case "scheduleStartAt":
          output = event.scheduledStartTime.getTime();
          break;
        case "scheduleEndAt":
          output = event.scheduledEndTime.getTime();
          break;
        case "server":
          output = client.guilds.get(event.guildId) || await client.rest.guilds.get(event.guildId);
          break;
        case "location":
          output = event.entityMetadata.location;
          break;
        case "coverURL":
          output = event.imageURL();
          break;
        default:
          output = event[values.get.type];
          break
      }  
  

    bridge.store(values.store, output)
  },
};
