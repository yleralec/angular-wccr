
var request = require('request');
var couch = require('config').couch;

var couchUrl = 'http://' + couch.host + ':' + couch.port + '/' + couch.db.foodItems;

module.exports = function(app) {
  app.get('/foodItem', getFoodItem);
  app.post('/foodItem', postFoodItem);
  app.put('/foodItem/:id', putFoodItem);
  app.delete('/foodItem/:id/:rev', deleteFoodItem);
  app.get('/weekly', getWeeklyTotalCals);
};


function getFoodItem(req, res) {
  var start = req.query.start;
  var end = req.query.end;

  var url = couchUrl + '/_design/foodItems/_view/all';

  if(start && end) {
    url += '?startkey="' + start + '"&endkey="' + end + '"';
  }

  request({
    url: url,
    method: 'GET'
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'GET');

    if (body.error) {
      return _fail(res, body.error);
    }
    
    var rows = body.rows;

    var foodItems = [];

    for(var i in rows) {
      var foodItem = rows[i].value;
      foodItems.push(foodItem);
    }

    res.send({
      success: true,
      foodItems: foodItems
    });

  });
}

function postFoodItem(req, res) {
  var foodItem = req.body;

  request({
    url: couchUrl,
    method: 'POST',
    json: foodItem
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'POST');

    if (body.error) {
      return _fail(res, body.error);
    }

    res.send({
      success: true,
      id: body.id,
      rev: body.rev
    });
  });
}

function putFoodItem(req, res) {
  var id = req.route.params.id;
  var foodItem = req.body;

  if(!foodItem._id) {
    return _fail(res, 'To update the item must have an _id attrubute.');
  }

  if(!foodItem._rev) {
    return _fail(res, 'To update the item must have a _rev attrubute.');
  }

  request({
    url: couchUrl + '/' + id,
    method: 'PUT',
    json: foodItem
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'PUT');

    if (body.error) {
      return _fail(res, body.error);
    }

    res.send({
      success: true,
      id: body.id,
      rev: body.rev
    });
  });
}

function deleteFoodItem(req, res) {
  var id = req.route.params.id;
  var rev = req.route.params.rev;

  if(!id || !rev)
    return _fail(res, "body must have id and rev");

  request({
    url: couchUrl + '/' + id + '?rev=' + rev,
    method: 'DELETE'
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'DELETE');

    if (body.error) {
      return _fail(res, body.error);
    }

    res.send({
      success: true
    });
  });
}

function getWeeklyTotalCals(req, res) {
  request({
    url: couchUrl + '/_design/foodItems/_view/weeklyCal?group=true',
    method: 'GET'
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body);

    if (body.error) {
      return _fail(res, body.error);
    }

    res.send({
      success: true,
      weekly: body.rows
    });
  });
}

function _tryJsonParse(item, who) {
  try {
    item = JSON.parse(item);
  } catch (e) {
    console.log(who, e);
  }

  return item;
}

function _fail(res, err) {
  res.send({
    success: false,
    err: err
  });
}