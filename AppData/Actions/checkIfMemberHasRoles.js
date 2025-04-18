module.exports = {
  data: { name: "Check If Member Has Roles", user: {type: "any", value: ""} },
  category: "Members",
  aliases: ["limit to role", "lock down to role", "has role", "check if has roles", "role restriction"],
  UI: [
    {
      element: "user",
      storeAs: "user",
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "checkType",
      name: "Check If",
      choices: {
        all: { name: "They Have All Roles" },
        any: { name: "They Have Any Role"},
        custom: { name: "They Have Any # Roles", field: true, placeholder: "Number" }
      }
    },
    "_",
    {
      element: "menu",
      storeAs: "roles",
      name: "Roles",
      max: 1000,
      types: {
        role: "Role"
      },
      UItypes: {
        role: {
          name: "Role",
          data: {role: {type: "ID", value: ""}},
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
    "-",
    {
      element: "condition",
      storeAs: "ifTrue",
      storeActionsAs: "ifTrueActions",
      name: "If True"
    },
    "-",
    {
      element: "condition",
      storeAs: "ifFalse",
      storeActionsAs: "ifFalseActions",
      name: "If False"
    }
  ],

  subtitle: (values, constants) => {
    let kind = 'All';
    if (values.checkType.type == 'any') kind = 'Any Of The';
    if (values.checkType.type == 'custom') kind = `${values.checkType.value} Of The`;
    return `Check If ${constants.user(values.user)} Has ${kind} ${values.roles.length} Roles`
  },
  async run(values, message, client, bridge) {
    let roles = [];
    values.roles.forEach(async roleMenu => {
      let role = await bridge.getRole(roleMenu.data.role);
      roles.push(role);
    });

    let user = await bridge.getUser(values.user);
    let member = await user.member;

    let hasRoles = false;

    if (values.checkType.type == "all") {
      hasRoles = roles.every(role => member.roles.includes(role.id));
    } else if (values.checkType.type == "any") {
        hasRoles = roles.some(role => member.roles.includes(role.id));
    } else if (values.checkType.type == "custom") {
      if (roles.filter(role => member.roles.includes(role.id)).length == Number(bridge.transf(values.checkType.field))) {
          hasRoles = true;
      }
    }

    if (hasRoles == true) {
      await bridge.call(values.ifTrue, values.ifTrueActions)
    } else {
      await bridge.call(values.ifFalse, values.ifFalseActions)
    }
  },
};
