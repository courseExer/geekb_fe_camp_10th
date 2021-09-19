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
    publishDir: "resource",
    auth: {
      client_id: "Iv1.8f4cf9203734e6e8",
    },
  };
}

module.exports = CONFIG();
