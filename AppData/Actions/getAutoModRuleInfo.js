module.exports = {
  data: {
    name: "Get AutoMod Rule Info",
  },
  category: "AutoMod",
  UI: [
    {
      element: "automodRule",
      storeAs: "rule"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        name: { name: "Name", category: "Basic Info" },
        id: { name: "ID" },
        createdAt: { name: "Creation Timestamp" },

        exemptChannels: { name: "Exempt Channels", category: "Exemptions" },
        exemptRoles: { name: "Exempt Roles" },

        _keywordFilter: { name: "Keywords", category: "Triggers" },
        _allowList: { name: "Allowed Keywords", category: "Triggers" },
        _regexPatterns: { name: "Regex Patterns" },
        _mentionTotalLimit: { name: "Total Mention Limit" },
        _presets: { name: "Presets" },
        _mentionRaidProtectionEnabled: { name: "Is Mention Raid Protection Enabled?" },
        triggerType: { name: "Trigger Type" },

        enabled: { name: "Enabled", category: "Misc" },

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
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.channel(values.rule)} - Store As: ${constants.variable(values.store)}`
  },

  async run(values, message, client, bridge) {
    var rule = await bridge.get(values.rule);

    let output;
      switch (values.get.type) {
        case "createdAt":
          output = rule.createdAt.getTime();
          break;
        case "server":
          output = client.guilds.get(rule.guildId) || await client.rest.guilds.get(rule.guildId);
          break;
        case "exemptChannels":
          output = [];
          for (let channelID of rule.exemptChannels) {
            let channel = await bridge.getChannel({ type: "id", value: channelID });
            output.push(channel);
          }
          break;
        case "exemptRoles":
          output = rule.exemptRoles.map(async r => await bridge.getRole({ type: "id", value: r }));
          break;
        default:
          if (values.get.type.startsWith("_")) {
            output = rule.triggerMetadata[values.get.type.substring(1)];
          } else {
            output = rule[values.get.type];
          }
          break
      }  
  

    bridge.store(values.store, output)
  },
};
