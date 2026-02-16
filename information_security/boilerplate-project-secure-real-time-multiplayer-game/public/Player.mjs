```javascript
class Player {
  constructor({x, y, score, id}) {
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.score = Number(score) || 0;
    this.id = id;
    // size used for simple collision detection
    this.width = 20;
    this.height = 20;
  }

  movePlayer(dir, speed) {
    const s = Number(speed) || 0;
    const d = String(dir).toLowerCase();
    if (d === 'up' || d === 'arrowup') this.y -= s;
    else if (d === 'down' || d === 'arrowdown') this.y += s;
    else if (d === 'left' || d === 'arrowleft') this.x -= s;
    else if (d === 'right' || d === 'arrowright') this.x += s;
  }

  collision(item) {
    if (!item) return false;
    // Simple AABB-like collision using tolerances around coordinates
    const dx = Math.abs(this.x - item.x);
    const dy = Math.abs(this.y - item.y);
    return (dx < this.width && dy < this.height);
  }

  calculateRank(arr) {
    if (!Array.isArray(arr)) return `Rank: 1/1`;
    const total = arr.length;
    const sorted = arr.slice().sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex(p => p.id === this.id);
    const rank = idx === -1 ? total : idx + 1;
    return `Rank: ${rank}/${total}`;
  }
}

export default Player;

```
