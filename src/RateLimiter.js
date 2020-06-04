class RateLimiter {
  /**
   * RateLimiter limits the rate of operations.
   * 
   * new RateLimiter(20, 1000) means that there cannot be more than 20 operations in any period of 1 seconds.
   * @param {number} maxOperations The maximum amount of operations that can be done in the given period, inclusive.
   * @param {number} timePeriod The time, in milliseconds, of each period. Cannot exceed maxOperations in this amount of time.
   */
  constructor(maxOperations, timePeriod) {
    this.maxOperations = maxOperations;
    this.timePeriod = timePeriod;
    /**
     * Times of previous operations.
     * @type {number[]}
     */
    this.history = [];
  }

  /**
   * Indicate that the next operation is going to run and determine if it is rate limited
   * @return {boolean} Whether the request is being limited.
   */
  rateLimited() {
    const now = Date.now();
    // We record the time of the last maxOperations operations
    this.history.push(now);
    if (this.history.length > this.maxOperations) {
      const period = this.history.shift();
      const timeSince = now - period;
      // If the last request of the last maxOperations operations was within the time period, this is a rate limiting violation.
      return timeSince < this.timePeriod;
    }
    return false;
  }
}

module.exports = RateLimiter;