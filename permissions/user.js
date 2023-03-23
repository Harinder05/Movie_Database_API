
const AccessControl = require("role-acl");
const ac = new AccessControl();

// Permissions for admin
ac
.grant("admin")
.execute("read")
.on("user", ["_id", "name", "email", "role"]);

ac
.grant("admin")
.execute("update")
.on("user", ["name", "email", "password"]);

ac
.grant("admin")
.execute("delete")
.on("user");

// User permissions
ac
.grant("user")
.condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
.execute("read")
.on("user", ["_id","email", "role"]);

ac
.grant("user")
.execute("update")
.on("user", ["name", "email", "password"]);

ac
.grant("user")
.execute("delete")
.on("user");

exports.read = (requester,data) => {
  console.log(`Requester ID: ${requester.id} AND Owner ID: ${data._id}`)
  return ac
    .can(requester.role)
    .context({
      requester: requester.id,
      owner: data._id,
    })
    .execute("read")
    .sync()
    .on("user");
};

exports.adminReadAll = (requester) => {
  return ac
    .can(requester.role)
    .execute("read")
    .sync()
    .on("user");
};