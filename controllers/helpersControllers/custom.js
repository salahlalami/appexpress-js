const mongoose = require("mongoose");
const pdf = require("phantom-html2pdf");
const pug = require("pug");
const fs = require("fs");
const moment = require("moment");

exports.getData = (model) => {
  const Model = mongoose.model(model);
  const result = Model.find({ removed: false });
  return result;
};

exports.getOne = (model, id) => {
  const Model = mongoose.model(model);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
};

exports.regExSearch = async (Model, req, res) => {
  let results = await Model.find({
    name: { $regex: new RegExp(req.query.q, "i") },
  })
    .sort({ name: "asc" })
    .limit(10);

  if (results.length >= 1) {
    res.status(200).json(results).end();
  } else {
    results = [];
    res.status(202).json(results).end();
  }
};

exports.search = async (Model, req, res) => {
  let results = await Model.find({ birthday: req.query.q })
    .sort({ name: "asc" })
    .limit(10);

  if (results.length < 1 || !results) {
    results = await Model
      // first find stores that match
      .find(
        {
          $text: {
            $search: req.query.q,
          },
        },
        {
          score: { $meta: "textScore" },
        }
      )
      // the sort them
      .sort({
        score: { $meta: "textScore" },
      })
      // limit to only 5 messages
      .limit(10);
    console.log(results);
  }

  if (results.length >= 1) {
    res.status(200).json(results).end();
  } else {
    results = [];
    res.status(202).json(results).end();
  }
};
// Added the new package => pdf v2
exports.generatePDF = (
  modelName,
  info = { filename: "PDF File", format: "A5" },
  ejsFile
) => async (req, res) => {
  const Model = mongoose.model(modelName);
  try {
    if (!ejsFile) {
      ejsFile = modelName;
    }

    const result = await Model.findOne({ _id: req.params.id });
    const fileId = info.filename + "-" + req.params.id + ".pdf";
    const html = pug.renderFile("views/pdf/" + ejsFile + ".pug", {
      model: result,
    });

    // the old pdf package =>
    // pdf.convert(html, { format: info.format }).toFile('./download/' +fileId, function(err, result) {
    //    if (err) return console.log(err);

    //  });

    // the new pdf package =>
    pdf.convert({ html: html, format: info.format }, function (err, result) {
      result.toFile("./public/download/" + fileId, function () {});

      /* Using a buffer and callback */
      result.toBuffer(function (returnedBuffer) {});

      /* Using a readable stream */
      var stream = result.toStream();

      /* Using the temp file path */
      var tmpPath = result.getTmpPath();
      console.warn(result);

      res.redirect("/public/download/" + fileId);
    });

    // res.status(200).json({ model: result }).end();
  } catch (e) {
    console.log(e);

    const error = "Oops there is error";
    res.status(403).json(error).end();
  }
};

// exports.oldPDF = (
//   modelName,
//   info = { filename: "PDF File", format: "A5" }
// ) => async (req, res) => {
//   const Model = mongoose.model(modelName);
//   try {
//     const result = await Model.findOne({ _id: req.params.id });
//     const html = pug.renderFile("views/pdf/" + modelName + ".pug", {
//       model: result,
//     });
//     pdf.create(html, { format: info.format }).toStream(function (err, stream) {
//       res.setHeader(
//         "Content-disposition",
//         'inline; filename="' + info.filename + '.pdf"'
//       );
//       res.setHeader("Content-type", "application/pdf");
//       res.status(200);
//       stream.pipe(res);
//     });
//     // res.status(200).json({ model: result }).end();
//   } catch (e) {
//     console.log(e);

//     const error = "Oops there is error";
//     res.status(403).json(error).end();
//   }
// };

/*
 * Pdf Generate New Method
 * This method only generate PDF in the folder, not download the PDF
 */
exports.pdfGenerater = async (
  modelName,
  info = { filename: "PDF File", format: "A5" },
  params,
  callback
) => {
  const Model = mongoose.model(modelName);

  try {
    const modelId = params.id;
    const result = await Model.findById(modelId);
    //                         .populate('doctor')
    //                         .populate('patient')
    //                         .populate('medicamentsList');
    const fileId = info.filename + "-" + params.id + ".pdf";

    // if PDF already exist, then delete it and create new PDF
    if (fs.existsSync(`./public/download/${modelName}/${fileId}`)) {
      fs.unlinkSync(`./public/download/${modelName}/${fileId}`);
    }

    //render pdf html
    const html = pug.renderFile("views/pdf/" + modelName + ".pug", {
      model: result,
      moment: moment,
    });

    await pdf.convert(
      {
        html: html,
        paperSize: {
          format: info.format,
          orientation: "portrait",
          border: "1cm",
        },
      },
      async function (err, res) {
        // /* Using a buffer and callback */
        // res.toBuffer(function(returnedBuffer) {});

        // /* Using a readable stream */
        // var stream = res.toStream();

        // /* Using the temp file path */
        // var tmpPath = res.getTmpPath();

        res.toFile(`./public/download/${modelName}/` + fileId, function () {});

        //update pdfPath after generated PDF
        const updatedOne = await Model.findOneAndUpdate(
          { _id: result.id },
          { pdfPath: fileId },
          {
            new: true,
          }
        ).exec();

        // //check if callback is typeof function
        // if (typeof callback == 'function') {
        //     callback({
        //         success: 1,
        //         data: updatedOne,
        //         message: 'Successfully generated pdf for this prescription'
        //     });
        // }

        // return updatedOne;
      }
    );
  } catch (error) {
    //if server side failed, then return error to callback function
    callback({
      success: 0,
      data: null,
      message: "Oops there is error",
    });
  }
};
