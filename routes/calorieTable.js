
var request = require('request');
var couch = require('config').couch;

var couchUrl = 'http://' + couch.host + ':' + couch.port + '/' + couch.db.calorieTable;

module.exports = function (app) {
  app.get('/calorieTableInfo', calorieTableInfo);
  app.get('/calorieTable', getCalorieTable);
  app.post('/calorieTable', postCalorieTable);
  app.delete('/calorieTable/:id/:rev', deleteCalorieTable);
};


function calorieTableInfo(req, res) {
  request({
    url: couchUrl,
    method: 'GET'
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'Info');

    if (body.error) {
      return _fail(res, body.error);
    }

    res.send(body);
  });
}

function getUrl(skip, limit) {
  var url = couchUrl + '/_design/calorieTable/_view/all';

  if(!skip && !limit)   return url;
  if(!skip)             return url + '?skip='+skip;
  if(!limit)            return url + '?limit='+limit;

  return url + '?skip='+skip + '&limit='+limit;
}

function getCalorieTable(req, res) {
  var skip = req.query.skip;
  var limit = req.query.limit;

  request({
    url: getUrl(skip, limit),
    method: 'GET'
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'GET');

    if (body.error) {
      return _fail(res, body.error);
    }

    return res.send({
      success: true,
      calorieTable: body
    });
  });
}

function postCalorieTable(req, res) {
  var item = req.body;

  request({
    url: couchUrl,
    method: 'POST',
    json: item
  }, function (err, resp, body) {
    if (err) return _fail(res, err);

    body = _tryJsonParse(body, 'POST');

    if (body.error) {
      return _fail(res, body.error);
    }

    return res.send({
      success: true,
      id: body.id,
      rev: body.rev
    });
  });
}

function deleteCalorieTable(req, res) {
  var id = req.params.id;
  var rev = req.params.rev;

  request({
    url: couchUrl+'/' + id + '?rev=' + rev,
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

