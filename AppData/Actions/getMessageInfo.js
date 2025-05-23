const { Message } = require('oceanic.js')

module.exports = {
  category: "Messages",
  data: {
    name: "Get Message Info"
  },

  UI: [
    {
      element: "message",
      name: "Message",
      storeAs: "message",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "get",
      name: "Get",
      choices: {
        content: { name: "Content" },
        author: { name: "Author" },
        channel: { name: "Channel" },
        jumpLink: { name: "URL" },
        id: { name: "ID" },
        poll: { name: "Poll" },
        createdAt: { name: "Creation Date" },
        server: { name: "Server" },
        reactions: { name: "Reactions" },
        referencedMessage: { name: "Replied Message" },
        isDM: { name: "Is DM?" },
        isWebhook: { name: "Is Webhook Message?"},
        isCrossposted: { name: "Is Crossposted?" },
        embeds: { name: "Embeds" },
        attachments: { name: "Attachments" },
        interaction: { name: "Interaction" },
        forwards: { name: "Forwarded Messages" },
        pinned: { name: "Is Pinned?"},
        type: { name: "Type" }
      }
    },
    "-",
    {
      element: "store",
      storeAs: "store"
    }
  ],

  compatibility: ["Any"],

  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI.find(e => e.element == 'typedDropdown').choices[values.get.type].name} of ${constants.message(values.message)} - Store As: ${constants.variable(values.store)}`
  },


  async run(values, message, client, bridge) {
    /**
     * @type {Message}
     */
    let msg = await bridge.getMessage(values.message)

    let result;
    switch (values.get.type) {
      case "createdAt":
        var cat = msg.createdAt.getTime();
        result = cat;
        break;
      case "reactions":
        let endList = [];
        let gotten = {};
        let reactions = msg.reactions;
        for (let reaction in reactions) {
          let endCount = reactions[reaction].count;
          while (endCount != 0) {
            let emoji = reactions[reaction].emoji;
            let reactionList = await msg.getReactions(`${emoji.name}${emoji.id ? ":" : ""}${emoji.id || ""}`, { limit: Infinity })
            if (!gotten[reaction]) {
              gotten[reaction] = 0;
            }
            endList.push({
              emoji: reaction.includes(":") ? reaction.split(':')[0] : reaction,
              emojiID: reaction.includes(":") ? reaction.split(':')[1] : '',
              author: reactionList[gotten[reaction]],
              message: msg
            })
            gotten[reaction] = Number(gotten[reaction]) + 1
            endCount--
          }
        }
        result = endList;
        break;
      case "isDM":
        result = msg.inDirectMessageChannel()
        break
      case "isWebhook":
        result = msg.webhookID ? true : false;
        break
      case "attachments":
        result = msg.attachments.toArray();
        break
      case "forwards":
        result = msg.messageSnapshots.filter(m => m.message);
        break
      default:
        result = msg[values.get.type];
        break
    }

    bridge.store(values.store, result)
  },
};
