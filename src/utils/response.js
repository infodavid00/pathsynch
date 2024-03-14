class Response {
  constructor(message) {
    this.message = message;
  }

  success(data) {
    return {
      acknowledged: true,
      message: this.message,
      data: data || 0,
    };
  }

  warn() {
    return {
      acknowledged: false,
      message: this.message,
    };
  }
}

export default Response;
