const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const email = (value) => {
  // eslint-disable-next-line
  var regex =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g;
  return !regex.test(value);
};

const phone = (value) => {
  // eslint-disable-next-line
  var regex = /^[+]?\d{10,25}$/g;
  return !regex.test(value);
};

const empty = (value) => {
  // eslint-disable-next-line
  return !value;
};

const length = (value, len) => {
  // eslint-disable-next-line
  return value.length > len;
};

const obj = {
  randomColor,
  email,
  phone,
  empty,
  length,
};

export default obj;
