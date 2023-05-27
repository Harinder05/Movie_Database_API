const AccessControl = require("role-acl");
const ac = new AccessControl();

// Permissions for admin
ac.grant("admin").execute("delete").on("movie").execute("update").on("movie");

// User permissions
ac.grant("user")
  .condition({ Fn: "EQUALS", args: { requester: "$.owner" } })
  .execute("update")
  .on("movie");

ac.grant("user").execute("delete").on("movie");
exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({ requester: requester.id, owner: data.createdBy._id.toString() })
    .execute("update")
    .sync()
    .on("movie");
};

exports.delete = (requester) => {
  return ac.can(requester.role).execute("delete").sync().on("movie");
};
