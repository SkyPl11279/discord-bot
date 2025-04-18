module.exports = {
  category: "Text",
  data: {
    name: "Check If Text Starts With",
  },
  UI: [
    {
      element: "input",
      name: "Text",
      storeAs: "string"
    },
    "_",
    {
      element: "input",
      name: "Must Start With",
      storeAs: "startsWith"
    },
    "-",
    {
      element: "condition",
      storeAs: "true",
      storeActionsAs: "trueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "false",
      storeActionsAs: "falseActions",
      name: "If False"
    },
    "-",
    {
      element: "toggle",
      name: "Case Sensitive",
      storeAs: "caseSensitive"
    }
  ],

  subtitle: "$[string]$ Must Start With $[startsWith]$",
  compatibility: ["Any"],
  
  async run(values, message, client, bridge) {
    let string = bridge.transf(values.string);
    let startsWith = bridge.transf(values.startsWith);
    let caseSensitive = values.caseSensitive;

    if (!caseSensitive) {
      string = string.toLowerCase();
      startsWith = startsWith.toLowerCase();
    }

    if (string.startsWith(startsWith)) {
      await bridge.call(values.true, values.trueActions)
    } else {
      await bridge.call(values.false, values.falseActions)
    }
  },
};
