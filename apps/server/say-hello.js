
const res = await fetch('http://127.0.0.1:5001/say-hello/James', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ greeting: 'Hello There' }),
});
const body = await res.text();
console.log(body);
