'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function(req, res) {
      const input = req.query.input;
      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);

      const numInvalid = initNum === 'invalid number' || initNum === undefined && input && input.trim().length>0 && isNaN(parseFloat(input));
      const unitInvalid = initUnit === 'invalid unit' || !initUnit;

      if (initNum === 'invalid number' && initUnit === 'invalid unit') {
        return res.send('invalid number and unit');
      }
      if (initNum === 'invalid number') return res.send('invalid number');
      if (initUnit === 'invalid unit') return res.send('invalid unit');

      const returnUnit = convertHandler.getReturnUnit(initUnit);
      const returnNum = convertHandler.convert(initNum, initUnit);
      const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      res.json({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: parseFloat(returnNum.toFixed(5)),
        returnUnit: returnUnit,
        string: string
      });
    });

};
