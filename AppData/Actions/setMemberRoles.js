module.exports = {
  data: {
    name: "Set Member Roles",
  },
  category: "Members",
  UI: [
    {
      element: "member",
      storeAs: "member"
    },
    "-",
    {
      element: "typedDropdown",
      storeAs: "type",
      name: "Type",
      choices: {
        overwrite: { name: "Overwrite" },
        add: { name: "Add" },
        remove: { name: "Remove" }
      }
    },
    "_",
    {
      element: "menu",
      name: "Roles",
      storeAs: "roles",
      types: {
        role: "Role"
      },
      max: 1000,
      UItypes: {
        role: {
          name: "Role",
          preview: "`${subtitleConstants.role(option.data.role)}`",
          data: { role: { type: "id", value: "" } },
          UI: [
            {
              element: "role",
              name: "Role",
              storeAs: "role"
            }
          ]
        }
      }
    },
    "-",
    {
      element: "input",
      name: "Reason",
      storeAs: "reason"
    }
  ],
  subtitle: (values, constants, thisAction) => {
    return `${thisAction.UI[2].choices[values.type.type].name} ${values.roles.length} Roles - Member: ${constants.user(values.member)} - Reason: ${values.reason}`
  },
  async run(values, message, client, bridge) {
    let member = (await bridge.getUser(values.member)).member;
    let memberRoles = member.roles;
    let roles = [];
    
    for (let roleMenu of values.roles) {
      let role = await bridge.getRole(roleMenu.data.role);
      roles.push(role.id);
    }

    if (values.type.type == "overwrite") {
      memberRoles = roles;
    } else if (values.type.type == "add") {
      memberRoles = memberRoles.concat(roles);
    } else if (values.type.type == "remove") {
      memberRoles = memberRoles.filter(role => !roles.includes(role));
    }

    console.log(member, memberRoles, roles)

    await member.edit({
      roles: memberRoles,
      reason: values.reason ? bridge.transf(values.reason) : null
    })
  },
};
