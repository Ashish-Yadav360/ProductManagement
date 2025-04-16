let data = [
    {
      price:20,
      quantity : 25,
   option :"yes"
    },
    {
      price:12,
      quantity : 25,
   option :"yes"
    },
    {
      price:20,
      quantity : 25,
      option :"yes"
    },
    {
      price:15,
      quantity : 25,
      option :"yes"
    },
    {
      price:15,
      quantity : 5,
      option :"yes"
    }
  ]

  const findata = data.reduce((acc, item) => {
    const key = JSON.stringify(item.price+item.option);
    if (!acc[key]) {
        acc[key] = { price: item.price, option: item.option, quantity: 0 };
    }
    acc[key].quantity += item.quantity;
    return acc;
}, {});

const result = Object.values(findata);

console.log(result);