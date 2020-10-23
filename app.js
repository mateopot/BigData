const express = require("express");
const db = require("./db");

const app = express();

app.get('/getRestaurant/:id', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.getRestaurantById(req.params.id))
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.post('/newRestaurant', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.createRestaurant(req.body))
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.delete('/restaurants/:restaurant_id', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.deleteRestaurant(req.params.restaurant_id))
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.put('/restaurants/:restaurant_id', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.updateRestaurant(req.params.restaurant_id, req.body))
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.get('/restaurants_price_average', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.getAveragePrice())
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.get('/restaurants', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.findRestaurantsWithLocation(req.query.long_coordinates, req.query.lat_coordinates, req.query.max_distance))
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.get('/restaurants/average_rating', async (req, res) => {
    return new Promise((resolve, reject) => {
        resolve(db.getRestaurantRating())
    }).then((state) => {
        res.status(200).send({
            success: 'true',
            response: state
        })
    }).catch((error) => {
        res.status(500).send({
            success: 'false',
            response: error.toString()
        })
    })
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed' });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});