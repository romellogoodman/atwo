const error = (error) => {
  console.error("Error:", error);

  return { error: true };
};

const json = (res) => res.json();

const text = (res) => res.text();

const status = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

const client = (url, config) => {
  return fetch(url, config).then(status).then(json).catch(error);
};

const getText = (url, options) => {
  return fetch(url, options).then(status).then(text).catch(error);
};

const get = (url, options = {}) => {
  return client(url, options);
};

const post = (url, body = {}, options = {}) => {
  console.log(`POST:`, url);
  console.log(`POST Body:`, body);

  const config = {
    ...options,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return client(url, config);
};

module.exports = {
  getText,
  get,
  post,
};
