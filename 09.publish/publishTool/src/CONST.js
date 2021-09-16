function CONFIG() {
  return {
    requestConfig: {
      host: "localhost",
      port: 8000,
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    },
    publishFilename: "index.html",
  };
}

module.exports = CONFIG();
