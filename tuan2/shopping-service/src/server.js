const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log(`Shopping Service running on port ${process.env.PORT}`);
});
