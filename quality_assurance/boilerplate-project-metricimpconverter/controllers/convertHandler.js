function ConvertHandler() {
  
  this.getNum = function(input) {
    let result;
    if (!input) return undefined;
    const match = input.match(/[a-zA-Z]/);
    const idx = match ? match.index : input.length;
    let numStr = input.slice(0, idx).trim();
    if (numStr === '') return 1;
    // check for double fraction
    const slashCount = (numStr.match(/\//g) || []).length;
    if (slashCount > 1) return 'invalid number';
    try {
      if (slashCount === 1) {
        const parts = numStr.split('/');
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (isNaN(num) || isNaN(den)) return 'invalid number';
        result = num / den;
      } else {
        const val = parseFloat(numStr);
        if (isNaN(val)) return 'invalid number';
        result = val;
      }
    } catch (e) {
      return 'invalid number';
    }
    return result;
  };
  
  this.getUnit = function(input) {
    if (!input) return 'invalid unit';
    const match = input.match(/[a-zA-Z]/);
    const idx = match ? match.index : input.length;
    let unit = input.slice(idx).trim();
    if (!unit) return 'invalid unit';
    unit = unit.toLowerCase();
    if (unit === 'l') unit = 'L';
    const valid = ['gal','L','mi','km','lbs','kg'];
    return valid.includes(unit) ? unit : 'invalid unit';
  };
  
  this.getReturnUnit = function(initUnit) {
    const map = {
      gal: 'L',
      L: 'gal',
      mi: 'km',
      km: 'mi',
      lbs: 'kg',
      kg: 'lbs'
    };
    return map[initUnit];
  };

  this.spellOutUnit = function(unit) {
    const map = {
      gal: 'gallons',
      L: 'liters',
      mi: 'miles',
      km: 'kilometers',
      lbs: 'pounds',
      kg: 'kilograms'
    };
    return map[unit];
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    if (initUnit === 'gal') result = initNum * galToL;
    else if (initUnit === 'L') result = initNum / galToL;
    else if (initUnit === 'lbs') result = initNum * lbsToKg;
    else if (initUnit === 'kg') result = initNum / lbsToKg;
    else if (initUnit === 'mi') result = initNum * miToKm;
    else if (initUnit === 'km') result = initNum / miToKm;
    else result = null;
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    const returnNumRounded = parseFloat(returnNum.toFixed(5));
    const initUnitSpelled = this.spellOutUnit(initUnit);
    const returnUnitSpelled = this.spellOutUnit(returnUnit);
    let result = `${initNum} ${initUnitSpelled} converts to ${returnNumRounded} ${returnUnitSpelled}`;
    return result;
  };
  
}

module.exports = ConvertHandler;
