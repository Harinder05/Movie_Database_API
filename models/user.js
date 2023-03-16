const bcrypt = require("bcryptjs");
const User = require("../schemas/user");

const bcryptSalt = bcrypt.genSaltSync(10);

function hashpassword(password, salt) {
  return bcrypt.hashSync(password, salt);
}

exports.registerUser = async function registerUser(body) {
  let status, message;
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    status = 400;
    message = "All fields are required";
    return { status, message };
  }

  if (role && role!== "admin" && role!== "user"  ){
    status = 400;
    message = "Invalid Role";
    return {status,message}
  }

  const duplicate = await User.findOne({ email });
  if (duplicate) {
    status = 409;
    message = "Email already used. Please register with different email";
    return { status, message };
  }

  const hashedpassword = hashpassword(password, bcryptSalt);
  const usercreated = await User.create({
    name: name,
    email: email,
    password: hashedpassword,
    role: role,
  });
  status = 200;
  message = `A user with name ${usercreated.name}, email ${usercreated.email} and ID ${usercreated._id} has been created.`;
  return { status, message };
};

exports.loginUser = async function loginUser(body) {
  let status, message;
  let { email, password } = body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const checkPassword = bcrypt.compareSync(password, userExists.password);

    if (checkPassword) {
      status = 200;
      message = "Login successful";
      return { status, message };
    } else {
      status = 401;
      message = "Email or Password are not correct.";
      return { status, message };
    }
  } else {
    status = 404;
    message = "The user is not registered with this email. Please register!";
    return { status, message };
  }
};

exports.updateUser = async function updateUser(body, id) {
  let status, message;
  const { name, email, role, password } = body;
  const user = await User.findById(id);
  if (!user) {
    status = 400;
    message = "User not found";
    return { status, message };
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  const hashedpassword = hashpassword(password, bcryptSalt);
  user.password = hashedpassword;

  const updateduser = await user.save();

  status = 200;
  message = `${updateduser.name} has been updated`;
  return { status, message };
};

exports.deleteUser = async function deleteUser(id) {
  let status, message;
  const user = await User.findById(id);
  if (!user) {
    status = 400;
    message = "User not found";
    return { status, message };
  }

  const result = await user.deleteOne();

  status = 200;
  message = `The user ${result.name} has been deleted`;
  return { status, message };
};

exports.getAll = async function getAll() {
  let status, message;
  const users = await User.find().select("-password -__v");
  if (!users) {
    status = 400;
    message = "There are no users";
    return { status, message };
  }
  status = 200;
  message = users;
  return { status, message };
};
