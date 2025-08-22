// Mock for lenis library to avoid ES module issues in Jest

class MockLenis {
  constructor(options = {}) {
    this.options = options;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }

  destroy() {
    this.isRunning = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  on(_event, _callback) {
    // Mock event listener
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  off(_event, _callback) {
    // Mock event listener removal
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scrollTo(_target, _options = {}) {
    // Mock scroll to functionality
  }
}

module.exports = MockLenis;
module.exports.default = MockLenis;