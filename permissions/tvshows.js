const AccessControl = require("role-acl");
const ac = new AccessControl();

// Permissions for admin
ac.grant("admin").execute("delete").on("tvshow");

// User permissions
ac.grant("user")
  .condition({ Fn: "EQUALS", args: { requester: "$.owner" } })
  .execute("update")
  .on("tvshow", ["title","description","releaseDate","network","seasons","episodes","cast"]);

exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({ requester: requester.id, owner: data.createdBy._id.toString() })
    .execute("update")
    .sync()
    .on("tvshow");
};

exports.delete = (requester) => {
  return ac.can(requester.role).execute("delete").sync().on("tvshow");
};