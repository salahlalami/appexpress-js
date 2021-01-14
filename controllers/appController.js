exports.dashboard = (req, res) => {
  res.render("index", {
    title: "Cedimed app",
  });
};

exports.download = (req, res) => {
  const file = `./public/download/${req.params.pdfname}`;
  res.download(file);
};

exports.notFound = (req, res) => {
  res.status(404).json({ Message: "Error 404" });
};
