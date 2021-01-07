const catchAsync = require("../helpers/catchAsync");
const { ErrorHandler } = require("../helpers/errorHandler");

// delete one
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ErrorHandler(404, 'No document found with that ID'));
    }
    res.status(204).json({
      status: 'success',
      body: null,
    });
  });

// update one
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new ErrorHandler(404, 'No document found with that ID'));
    res.status(200).json({
      status: 'success',
      body: doc,
    });
  });

// create one
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      body: doc,
    });
  });

// get one
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new ErrorHandler(404, 'No document found with that ID'));

    res.status(200).json({
      status: 'success',
      body: doc,
    });
  });

// get all
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    res.status(200).json({
      status: 'success',
      results: doc.length,
      body: doc,
    });
  });
