const url = 'https://catfact.ninja';
// const url = 'http://localhost:3000'; // zakomentuj linię powyżej i odkomentuj ten url, jeśli będziesz korzystać z JSON Servera

export function get(resource) {
  return fetchData(resource);
}

export function create(resource, data) {
  const options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  };
  return fetchData(resource, options);
}

export function remove(resource, id) {
  const options = {
    method: 'DELETE',
  };
  return fetchData(resource, options, id);
}

export function update(resource, id, updatedEl) {
  const options = {
    method: 'PATCH',
    body: JSON.stringify(updatedEl),
    headers: { 'Content-Type': 'application/json' },
  };
  return fetchData(resource, options, id);
}

function fetchData(resource = '', options = { method: 'GET' }, id = '') {
  const path = url + resource + `/${id}`;
  const promise = fetch(path, options);
  return promise
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      }
      return Promise.reject(resp);
    })
    .catch(err => console.error(err))
    .finally(() => {
      console.log('Odpytywanie API zakończone!');
    });
}
