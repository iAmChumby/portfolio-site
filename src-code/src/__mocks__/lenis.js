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

  on(event, callback) {
    // Mock event listener
  }

  off(event, callback) {
    // Mock event listener removal
  }

  scrollTo(target, options = {}) {
    // Mock scroll to functionality
  }
}

module.exports = MockLenis;
module.exports.default = MockLenis;