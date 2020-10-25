const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

const uri = "mongodb://joe:doe@localhost:27017/masterclass_project";
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
    } catch (e) {
        console.error(e);
    }
}

async function getRestaurantById(restaurant_id) {
    return result = await client.db("masterclass_project").collection("restaurants")
        .findOne({ _id: ObjectId(restaurant_id) });
}

async function updateRestaurant(restaurant_id, body) {
    return result = await client.db("masterclass_project").collection("restaurants")
        .updateOne(
            { _id: ObjectId(restaurant_id) },
            { $set: { name: body.name, long_coordinates: body.long_coordinates, lat_coordinates: body.lat_coordinates } }
        );
}

async function deleteRestaurant(restaurant_id) {
    return result = await client.db("masterclass_project").collection("restaurants")
        .deleteOne({ _id: ObjectId(restaurant_id) });
}

async function createRestaurant(body) {
    return result = await client.db("masterclass_project").collection("restaurants")
        .insertOne(
            { name: body.name, long_coordinates: body.long_coordinates, lat_coordinates: body.lat_coordinates }
        );
}

async function getAveragePrice() {
    return result = await client.db("masterclass_project").collection("restaurants")
        .aggregate(
            [
                {
                    $group:
                        { _id: "", avg_price: { $avg: "$price" } }
                }
            ]
        ).toArray();
}

async function findRestaurantsWithLocation(long_coordinates, lat_coordinates, max_distance) {
    await client.db("masterclass_project").collection("restaurants").createIndex({ "location": "2dsphere" });

    return result = await client.db("masterclass_project").collection("restaurants")
        .find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(long_coordinates), parseFloat(lat_coordinates)]
                    },
                    $maxDistance: parseInt(max_distance ? max_distance : 5000),
                    $minDistance: 0
                }
            }
        }).toArray();
}

async function getRestaurantRating(restaurant_id) {

    return result = await client.db("masterclass_project").collection("restaurants")
        .aggregate(
            [{ $project: { _id: "$_id", name: "$name", avg_stars: { $avg: "$reviews" } } }]
        ).toArray();

}

main().catch(console.error);

module.exports = { getRestaurantById, updateRestaurant, createRestaurant, findRestaurantsWithLocation, getAveragePrice, deleteRestaurant, getRestaurantRating };