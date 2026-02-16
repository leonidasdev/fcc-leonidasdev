```javascript
class Collectible {
  constructor({x, y, value, id}) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.value = Number(value) || 1;
    this.id = id;
  }

}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;

```
