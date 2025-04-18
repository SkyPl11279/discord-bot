const boilerplate = (name, customUI, storeAs) => {
  return {
    element: "menu",
    name,
    storeAs: storeAs || name,
    types: {
      name,
    },
    max: 1,
    required: false,
    UItypes: {
      name: {
        name,
        data: {},
        UI: customUI || [],
      },
    },
  }
}

module.exports = {
  data: {
    name: "Create AutoMod Rule",
    enabled: true
  },
  category: "AutoMod",
  UI: [
    boilerplate("Keywords", [
      {
        element: "largeInput",
        storeAs: "keywords",
        name: "Keywords",
        placeholder: "Separate with commas",
      }
    ], "keywords"),
    "_",
    boilerplate("Allowed Keywords", [
      {
        element: "largeInput",
        storeAs: "allowList",
        name: "Allowed Keywords",
        placeholder: "Separate with commas",
      }
    ], "allowedKeywords"),
    "_",
    boilerplate("Regex Patterns", [
      {
        element: "largeInput",
        storeAs: "regexPatterns",
        name: "Regex Patterns",
        placeholder: "Separate with commas",
      }
    ], "regexPatterns"),
    "_",
    boilerplate("Mention Total Limit", [
      {
        element: "input",
        storeAs: "mentionTotalLimit",
        name: "Mention Total Limit",
        placeholder: "Number",
      }
    ], "mentionTotalLimit"),
    "_",
    {
      element: "toggle",
      name: "Enabled",
      storeAs: "enabled",
    },
    "-",
    {
      element: "menu",
      storeAs: "roles",
      name: "Exempt Roles",
      max: 1000,
      types: {
        role: "Role"
      },
      UItypes: {
        role: {
          name: "Role",
          data: { role: { type: "ID", value: "" } },
          UI: [
            {
              element: "role",
              storeAs: "role",
              name: "Role"
            }
          ]
        }
      }
    },
    "_",
    {
      element: "menu",
      storeAs: "channels",
      name: "Exempt Channels",
      max: 1000,
      types: {
        channel: "Channel"
      },
      UItypes: {
        channel: {
          name: "Channel",
          data: { channel: { type: "ID", value: "" } },
          UI: [
            {
              element: "channel",
              storeAs: "channel",
              name: "Channel"
            }
          ]
        }
      }
    },
    "-",
    {
      element: "menu",
      name: "Moderation Actions",
      storeAs: "actions",
      types: {
        actions: "Actions",
      },
      max: 1,
      required: true,
      inheritData: true,
      UItypes: {
        actions: {
          name: "Actions",
          data: {},
          inheritData: true,
          UI: [
            boilerplate("Send Alert Options", [
              {
                element: "channel",
                storeAs: "channel",
              }
            ], "alertChannel"),
            "_",
            boilerplate("Block Message Options", [
              {
                element: "largeInput",
                storeAs: "message",
                placeholder: "Optional",
                name: "Custom Message (Reasoning)",
              }
            ], "blockMessage"),
            "_",
            boilerplate("Timeout Options", [
              {
                element: "typedDropdown",
                storeAs: "time",
                name: "Timeout Duration",
                choices: {
                  1: { name: "Seconds", field: true },
                  3600: { name: "Hours", field: true },
                  86400: { name: "Days", field: true },
                  604800: { name: "Weeks", field: true },
                }
              }
            ], "timeout"),
            "_",
            boilerplate("Block Member Interaction Options", [], "blockMember"),
          ]
        }
      }
    },
    "-",
    {
      element: "input",
      name: "Reason",
      storeAs: "reason",
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
    let rule = {
      triggerMetadata: {},
      actions: []
    };

    let getData = (menu) => {
      return menu[0]?.data;
    }

    let keywords = getData(values.keywords);
    let allowList = getData(values.allowList);
    let regexPatterns = getData(values.regexPatterns);
    let mentionTotalLimit = getData(values.mentionTotalLimit);
    let roles = getData(values.roles);
    let channels = getData(values.channels);

    if (keywords) {
      rule.triggerMetadata.keywords = bridge.transf(keywords.keywords).split(",").map(e => e.trim());
    }
    if (allowList) {
      rule.triggerMetadata.allowList = bridge.transf(allowList.allowList).split(",").map(e => e.trim());
    }
    if (regexPatterns) {
      rule.triggerMetadata.regexPatterns = bridge.transf(regexPatterns.regexPatterns).split(",").map(e => e.trim());
    }
    if (mentionTotalLimit) {
      rule.triggerMetadata.mentionTotalLimit = mentionTotalLimit.mentionTotalLimit;
    }
    if (roles) {
      rule.triggerMetadata.exemptRoles = roles.roles;
    }
    if (channels) {
      rule.triggerMetadata.exemptChannels = channels.channels;
    }


    let alertChannel = getData(values.alertChannel);
    let blockMessage = getData(values.blockMessage);
    let timeout = getData(values.timeout);
    let blockMember = getData(values.blockMember);

    if (alertChannel) {
      let channel = await bridge.getChannel(alertChannel.channel);
      rule.actions.push(
        {
          metadata: { channel: channel.id },
          type: 2
        }
      );
    }
    if (blockMessage) {
      rule.actions.push(
        {
          metadata: { channel: message.channel.id },
          type: 1
        }
      );
    }
    if (timeout) {
      rule.actions.push(
        {
          metadata: { duration: timeout.time.type * Number(bridge.transf(timeout.time.value)) },
          type: 3
        }
      );
    }
    if (blockMember) {
      rule.actions.push(
        {
          metadata: { duration: 0 },
          type: 4
        }
      );
    }
    rule.enabled = values.enabled;
    rule.eventType = 1;
    rule.triggerType = 3;
    if (values.reason) {
      rule.reason = bridge.transf(values.reason);
    }

    bridge.guild.createAutoModerationRule(rule)

    bridge.store(values.store, output)
  },
};
