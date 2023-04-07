const Celeb = require("../schemas/dbSchemas/celebs");

exports.getAll = async function getAll() {
  const data = await Celeb.find().select("-__v").populate("knownFor", "title");
  if (data.length === 0) {
    return { status: 404, message: "No Celebrities in database" };
  } else {
    return { status: 200, message: data };
  }
};

exports.getById = async function getById(id) {
  const data = await Celeb.findById(id)
    .select("-__v")
    .populate("knownFor", "title");
  if (!data) {
    return { status: 404, message: "No Celeb in database with this ID" };
  } else {
    return { status: 200, message: data };
  }
};

exports.addCeleb = async function addCeleb(body) {
  const { name, dob, gender, nationality, knownFor } = body;

  const duplicate = await Celeb.findOne({ name });
  if (duplicate) {
    return {
      status: 409,
      message: `This celebrity already in database with id:'${duplicate._id}'`,
    };
  }

  if (!name || !dob || !gender || !nationality) {
    return {
      status: 400,
      message: "All fields are required except 'knownFor'",
    };
  }

  const newCeleb = await Celeb.create({
    name,
    dob,
    gender,
    nationality,
    knownFor,
  });

  return { status: 200, id: newCeleb._id };
};

exports.updateCeleb = async function updateCeleb(id, update) {
  const { name, dob, gender, nationality, knownFor } = update;
  const data = await Celeb.findById(id);
  if (!data) {
    return { status: 404, message: "No Celeb in database with this ID" };
  }

  data.name = name || data.name;
  data.dob = dob || data.dob;
  data.gender = gender || data.gender;
  data.nationality = nationality || data.nationality;
  data.knownFor = knownFor || data.knownFor;
  await data.save();
  return { status: 201, message: { updated: true, info: data } };
};

exports.deleteCeleb = async function deleteCeleb(id) {
  const Exists = await Celeb.findById(id);
  console.log(Exists);
  if (!Exists) {
    return {
      status: 404,
      message: `ID:'${id}' does not exist in database`,
    };
  }

  const CelebToDelete = await Celeb.findByIdAndDelete(id)
    .select("-__v")
    .populate("knownFor", "title");
  console.log(CelebToDelete);
  return { status: 200, message: { deleted: true, info: CelebToDelete } };
};
