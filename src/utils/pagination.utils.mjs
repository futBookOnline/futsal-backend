const paginatedResult = async (model, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const data = {};
  console.log("START INDEX: ", startIndex)
  console.log("END INDEX: ", endIndex)
  console.log("COUNT: ", await model.countDocuments())
  if (startIndex > 0) {
    data.prev = {
      page: page - 1,
      limit: limit,
    };
  }
  if (endIndex < await model.countDocuments()) {
    data.next = {
      page: page + 1,
      limit: limit,
    };
  }
  data.result = await model.find().limit(limit).skip(startIndex);
  return data;
};

export default paginatedResult;
