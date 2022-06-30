import { connectToDatabase } from "../../utils/db";

async function Search(req, res) {
  const { term } = req.query;

  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection("restaurants")
      .aggregate([
        {
          $addFields: {
            arrayMenu: { $objectToArray: "$menu" },
          },
        },
        {
          $match: {
            $or: [
              {
                arrayMenu: {
                  $elemMatch: {
                    v: { $elemMatch: { name: new RegExp(term, "ig") } },
                  },
                },
              },
              {
                name: new RegExp(term, "ig"),
              },
            ],
          },
        },
        {
          $unset: "arrayMenu",
        },
        {
          $sort: {
            "user_rating.aggregate_rating": -1,
          },
        },
        {
          $limit: 30,
        },
      ])
      .toArray();

    res.send({ success: true, docs });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
}

export default Search;
