const paginatedResult = async (model, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const res = {};
  console.log("START INDEX: ", startIndex)
  console.log("END INDEX: ", endIndex)
  console.log("COUNT: ", await model.countDocuments())
  if (startIndex > 0) {
    res.prev = {
      page: page - 1,
      limit: limit,
    };
  }
  if (endIndex < await model.countDocuments()) {
    res.next = {
      page: page + 1,
      limit: limit,
    };
  }
  res.result = await model.find().limit(limit).skip(startIndex);
  return res;
};

export default paginatedResult;
