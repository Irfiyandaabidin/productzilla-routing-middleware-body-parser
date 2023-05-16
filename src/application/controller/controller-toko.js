const fs = require("fs");
const path = require("path");

const pathFile = "public/data.json";

const readData = (req, res) => {
  const data = fs.readFileSync(pathFile);
  const dataJson = JSON.parse(data);
  return dataJson;
};

const uploadImage = (req, res) => {
  try {
    const { id } = req.params;
    const metaData = req.file;
    const extensionName = metaData.originalname.split(".").pop();
    const oldPath = metaData.path;
    fs.renameSync(
      oldPath,
      path.resolve(`public/images/${id}.${extensionName}`)
    );
    res.status(200).json({
      msg: "Berhasil menambahkan image produk",
    });
  } catch (err) {
    res.json({ msg: "Failed add image product." });
  }
};

const getProduct = (req, res) => {
  try {
    fs.readFile(pathFile, (err, data) => {
      if (data) {
        const dataJson = JSON.parse(data);
        res.status(200).json(dataJson);
      }
      res.status(500).send("Internal server error");
    });
  } catch (err) {
    res.json({ msg: "Can not get data product" });
  }
};

const addProduct = (req, res) => {
  try {
    const id = req.body.id;
    const nama = req.body.nama;
    const harga = req.body.harga;
    const barcode = req.body.barcode;
    const newData = {
      id,
      nama,
      harga,
      barcode,
    };
    if (!fs.existsSync(pathFile)) {
      const dataArr = [];
      dataArr.push(newData);
      const newDataStr = JSON.stringify(dataArr);
      fs.writeFileSync(pathFile, newDataStr);
      res.status(200).json({
        msg: "Data berhasil ditambahkan",
        data: dataArr,
      });
    } else {
        const data = readData(req, res);
        data.push(newData);
        const newDataStr = JSON.stringify(data);
        fs.writeFileSync(pathFile, newDataStr);
        res.status(200).json({
          msg: "Data berhasil ditambahkan",
          data: data,
        });
    }
  } catch (err) {
    res.json({ msg: "Failed add product", err });
  }
};

const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(req, res);
    const indexProduct = data.findIndex((e) => e.id == id);
    if (indexProduct != -1) {
      res.status(200).json(data[indexProduct]);
    }
    res.status(400).send({ msg: "Id not found" });
  } catch (err) {
    res.json({ msg: "Can not get product by id." });
  }
};

const updateProductById = (req, res) => {
  try {
    const { nama, harga, barcode } = req.body;
    const { id } = req.params;
    const data = readData(req, res);
    const indexProduct = data.findIndex(
      (d) => d.id.toString() === id.toString()
    );
    if (indexProduct != -1) {
      const newData = {
        id,
        nama,
        harga,
        barcode,
      };
      data[indexProduct] = newData;
      const dataStr = JSON.stringify(data);
      fs.writeFileSync(pathFile, dataStr);
      res.status(200).json({
        msg: "Data berhasil diubah",
        data,
      });
    }
    res.status(400).json({ msg: "Id not found." });
  } catch (err) {
    res.json({ msg: "Failed update data product." });
  }
};

const deleteProductById = (req, res) => {
  try {
    const { id } = req.params;
    const data = readData(req, res);
    const indexProduct = data.findIndex(
      (d) => d.id.toString() === id.toString()
    );
    if (indexProduct != -1) {
      data.splice(indexProduct, 1);
      const dataStr = JSON.stringify(data);
      fs.writeFileSync(pathFile, dataStr);
      res.status(200).json({ msg: "Data berhasil dihapus", data });
    }
    res.status(400).json({ msg: "Id not found." });
  } catch (err) {
    res.json({ msg: "Failed delete product." });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  addProductImage: uploadImage,
};
