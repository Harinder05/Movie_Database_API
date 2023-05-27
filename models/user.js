/**
 * @module User-Models
 * @author Harinderveer Singh
 * @description Provides access to database for managing users
 */

const bcrypt = require("bcryptjs");
const User = require("../schemas/dbSchemas/user");
const { generateToken } = require("../controllers/auth");
const bcryptSalt = bcrypt.genSaltSync(10);

/**
 * @function hashpassword
 * @description Hashes the password that is given using the salt provided
 * @param {string} password - The password to hash
 * @param {string} salt - The salt used for hashing
 * @returns {String} Hashed password
 */
function hashpassword(password, salt) {
  return bcrypt.hashSync(password, salt);
}

/**
 * @function registerUser
 * @description Register a new user in database
 * @param {Object} body - The user data
 * @returns {Object} Object with status code and message about registration
 */
exports.registerUser = async function registerUser(body) {
  const { name, email, password, role } = body;

  const duplicate = await User.findOne({ email });
  if (duplicate) {
    return {
      status: 409,
      message: "Email already used. Please register with different email",
    };
  }
  const hashedpassword = hashpassword(password, bcryptSalt);
  const usercreated = await User.create({
    name: name,
    email: email,
    password: hashedpassword,
    role: role,
  });
  return {
    status: 201,
    message: `A user with name ${usercreated.name}, email ${usercreated.email} and ID ${usercreated._id} has been created.`,
  };
};

/**
 * @function loginUser
 * @description Logs in a user
 * @param {Object} body - The user data
 * @returns {Object} Object with status code and message about login
 */
exports.loginUser = async function loginUser(body) {
  let { email, password } = body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    const checkPassword = bcrypt.compareSync(password, userExists.password);
    if (checkPassword) {
      const { token, userinfo } = generateToken(userExists);
      return {
        status: 200,
        message: `Login successful`,
        token: token,
        userinfo: userinfo,
      };
    } else {
      return { status: 401, message: "Password not correct." };
    }
  } else {
    return {
      status: 401,
      message: "This email is not registered. Please register!",
    };
  }
};

/**
 * @function updateUser
 * @description Updates information about a registered user
 * @param {Object} body - The user data
 * @param {String} id - Id of user to update
 * @returns {Object} Object with status code and message about update
 */
exports.updateUser = async function updateUser(id, body) {
  const { name, email, role, password } = body;
  const user = await User.findById(id);
  if (!user) {
    return { status: 400, message: "User not found. Check ID given." };
  }
  user.name = name;
  user.email = email;
  user.role = role;
  const hashedpassword = hashpassword(password, bcryptSalt);
  user.password = hashedpassword;

  const updateduser = await user.save();
  return { status: 200, message: `${updateduser.name} has been updated` };
};

/**
 * @function deleteUser
 * @description Deletes a user from database
 * @param {String} id - Id of user to delete
 * @returns {Object} Object with status code and message about deletion
 */
exports.deleteUser = async function deleteUser(id) {
  const user = await User.findById(id);
  if (!user) {
    return { status: 400, message: "User not found. Check ID given." };
  }
  const result = await User.findByIdAndDelete(id);
  return { status: 200, message: `The user ${result.name} has been deleted` };
};

/**
 * @function getall
 * @description Retreives all users from database
 * @returns {Object} Object with status code and message about data found
 */
exports.getall = async function getall() {
  const foundusers = await User.find().select("-password -__v");
  if (!foundusers) {
    return { status: 404, message: "No users. Empty database" };
  }
  return { status: 200, message: foundusers };
};

/**
 * @function getById
 * @description Retrieves information about one user
 * @param {String} id - Id used to find user information
 * @returns {Object} Object with data found about user
 */
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
