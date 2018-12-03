const idGenerator = () => {
  let text = '';
  const possible = '0123456789';

  for (let i = 0; i < 5; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default idGenerator;
