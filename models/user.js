const bcrypt = require("bcryptjs");
const User = require("../schemas/user");
const { generateToken } = require("../controllers/auth");

const bcryptSalt = bcrypt.genSaltSync(10);

function hashpassword(password, salt) {
  return bcrypt.hashSync(password, salt);
}

exports.registerUser = async function registerUser(ctx) {
  const { name, email, password, role } = ctx.request.body;

  if (!name || !email || !password) {
    ctx.throw(400, "All fields are required");
  }

  if (role && role !== "admin" && role !== "user") {
    ctx.throw(400, "Invalid Role");
  }

  const duplicate = await User.findOne({ email });
  if (duplicate) {
    ctx.throw(409, "Email already used. Please register with different email");
  }

  const hashedpassword = hashpassword(password, bcryptSalt);
  const usercreated = await User.create({
    name: name,
    email: email,
    password: hashedpassword,
    role: role,
  });
  ctx.status = 200;
  ctx.body = {
    message: `A user with name ${usercreated.name}, email ${usercreated.email} and ID ${usercreated._id} has been created.`,
  };
};

exports.loginUser = async function loginUser(ctx) {
  let { email, password } = ctx.request.body;
  const userExists = await User.findOne({ email });
  // If user is registered with this email
  if (userExists) {
    const checkPassword = bcrypt.compareSync(password, userExists.password);
    // If password is correct
    if (checkPassword) {
      const token = generateToken(userExists);
      ctx.cookies.set("jwtToken", token, { httpOnly: true });
      ctx.status = 200;
      ctx.body = { message: `Login successful. Info in the toekn is ${token}` };
      // User exists but password is wrong
    } else {
      ctx.throw(401, "Email or Password are not correct.");
    }
    // Email not in database
  } else {
    ctx.throw(
      404,
      "The user is not registered with this email. Please register!"
    );
  }
};

exports.updateUser = async function updateUser(ctx) {
  const { name, email, role, password } = ctx.request.body;
  const user = await User.findById(ctx.params.id);
  if (!user) {
    ctx.throw(400, "User not found");
  }
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  const hashedpassword = hashpassword(password, bcryptSalt);
  user.password = hashedpassword;

  const updateduser = await user.save();

  ctx.status = 200;
  ctx.body = { message: `${updateduser.name} has been updated` };
};

exports.deleteUser = async function deleteUser(ctx) {
  const user = await User.findById(ctx.params.id);
  if (!user) {
    ctx.throw(400, "User not found");
  }
  const result = await user.deleteOne(ctx);
  ctx.status = 200;
  ctx.body = { message: `The user ${result.name} has been deleted` };
};

exports.getall = async function getall() {
  try {
    console.log("getall Models")
    const foundusers = await User.find().select("-password -__v");
    console.log(foundusers)
    if (!foundusers) {
      ctx.throw(404, "no users found");
    }

    return foundusers;
  } catch (err) {
    //console.error(err.status, err.message);
    ctx.status = err.status || 404;
    ctx.body = { message: err.message };
  }
};

exports.getById = async function getById(id) {
  try {
    const getUser = await User.findById(id);
    
    return getUser;
  } catch (err) {
    //console.error(err.status, err.message);
    ctx.status = err.status || 404;
    ctx.body = { message: err.message };
  }
};
