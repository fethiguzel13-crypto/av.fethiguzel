// İnsan benzeri bekleme — bot tespitini azaltmak için
// Her istek arasında randomize delay, sayfa içi aksiyonlar arasında daha kısa

export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function humanDelay(minMs = 8000, maxMs = 14000) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await sleep(ms);
  return ms;
}

export async function shortDelay(minMs = 500, maxMs = 1500) {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await sleep(ms);
  return ms;
}

export class RequestBudget {
  constructor(maxRequests = 25) {
    this.maxRequests = maxRequests;
    this.count = 0;
    this.startTime = Date.now();
  }

  consume(label = "") {
    this.count++;
    if (this.count > this.maxRequests) {
      throw new Error(
        `Request budget aşıldı: ${this.count}/${this.maxRequests}. Son istek: ${label}`
      );
    }
    return { used: this.count, remaining: this.maxRequests - this.count };
  }

  status() {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
    return {
      used: this.count,
      remaining: this.maxRequests - this.count,
      elapsedSec: elapsed,
    };
  }
}
