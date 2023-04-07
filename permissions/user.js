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
.on("user", ["name", "email", "password","role"]);

ac
.grant("admin")
.condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
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
.condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
.execute("update")
.on("user", ["name", "email", "password"]);

ac
.grant("user")
.condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
.execute("delete")
.on("user");

exports.read = (requester,data) => {
  
  return ac
    .can(requester.role)
    .context({requester: requester.id, owner: data._id,})
    .execute("read")
    .sync()
    .on("user")
};

exports.readAll = (requester) => {
  if(requester.role !== "admin"){
    return {granted: false}
  }
  return ac
    .can(requester.role)
    .execute("read")
    .sync()
    .on("user");
};

exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.id, owner:data._id})
    .execute('update')
    .sync()
    .on('user');
}

exports.delete = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.id, owner:data._id})
    .execute('delete')
    .sync()
    .on('user');
}