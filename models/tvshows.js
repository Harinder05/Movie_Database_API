const Tvshows = require("../schemas/dbSchemas/tvshows");

async function searchTvshow(title) {
  const data = await Tvshows.find({ title: new RegExp(title, "i") })
    .select("-__v")
    .populate("cast", "name");
  return data;
}

async function getAll() {
  const data = await Tvshows.find()
    .select("-__v")
    .populate([
      { path: "cast", select: "name -_id" },
      { path: "createdBy", select: "name -_id" },
      { path: "updatedBy", select: "name -_id" },
    ]);
  if (!data) {
    return { status: 404, message: "No tvshows in database" };
  }
  return { status: 200, message: data };
}

async function getById(id) {
  const data = await Tvshows.findById(id)
    .select("-__v")
    .populate("cast", "name")
    .populate("createdBy", "name")
    .populate("updatedBy", "name");
  return data;
}

async function addTvshow(body, createrId) {
  let { title, description, releaseDate, network, seasons, episodes, cast } = body;

  const duplicate = await Tvshows.findOne({ title, releaseDate });
  if (duplicate) {
    throw new Error("duplicate");
  }

  const data = await Tvshows.create({
    title,
    description,
    releaseDate,
    network,
    seasons,
    episodes,
    cast,
    createdBy: createrId,
    updatedBy: createrId,
  });

  if (!data) {
    return { status: 400, message: "Could not add tvshow. Try later" };
  }

  return { status: 201, message: data };
}

async function updateTvshow(id, update) {
  try{
  let { title, description, releaseDate, network, seasons, episodes, cast } = update;

  const data = await Tvshows.findById(id);

  data.title = title || data.title;
  data.description = description || data.description;
  data.releaseDate = releaseDate || data.releaseDate;
  data.network = network || data.network;
  data.seasons = seasons || data.seasons;
  data.episodes = episodes || data.episodes;
  data.cast = cast || data.cast;
  await data.save();
  return { status: 201, message: data };
  }catch(err){
    console.error(err.message)
  }
}

async function deleteTvshow(id) {
  const tvshow = await Tvshows.findById(id);
  if (!tvshow) {
    return { status: 400, message: "Tvshow not found. Check ID." };
  }
  const result = await Tvshows.findByIdAndDelete(id);
  return {
    status: 200,
    message: `The tvshow ${result.title} has been deleted`,
  };
}

module.exports = {
  searchTvshow,
  getAll,
  getById,
  addTvshow,
  updateTvshow,
  deleteTvshow,
};
