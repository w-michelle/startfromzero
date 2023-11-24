export const dateFormat = (input: any) => {
  const date = new Date(input);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formattedDate = `${months[date.getMonth()]} ${date.getFullYear()}`;
  return formattedDate;
};

export const dateFormat2 = (input: any) => {
  const date = new Date(input);
  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
};
