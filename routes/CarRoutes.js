const router = require("express").Router();
const multer = require('multer');
const Car = require("../model/Car");

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas'));
    }
    cb(null, true);
  }
});

// CADASTRAR
router.post("/", upload.single('carPhoto'), async (req, res) => {
  const {
    brand,
    model,
    description,
    price,
    year,
    fuel,
    color,
    kilometers,
    numOfDoors
  } = req.body;

  if (!brand) {
    res.status(422).json({ error: "A marca do carro é obrigatória" });
    return;
  }
  
  if (!model) {
    res.status(422).json({ error: "O modelo do carro é obrigatório" });
    return;
  }
  
  if (!description) {
    res.status(422).json({ error: "A descrição do carro é obrigatória" });
    return;
  }
  
  if (!price) {
    res.status(422).json({ error: "O preço do carro é obrigatório" });
    return;
  }
  
  if (!year) {
    res.status(422).json({ error: "O ano de fabricação do carro é obrigatório" });
    return;
  }
  
  if (!fuel) {
    res.status(422).json({ error: "O tipo de combustível do carro é obrigatório" });
    return;
  }
  
  if (!color) {
    res.status(422).json({ error: "A cor do carro é obrigatória" });
    return;
  }
  
  if (!kilometers) {
    res.status(422).json({ error: "Os quilômetros rodados do carro são obrigatórios" });
    return;
  }
  
  if (!numOfDoors) {
    res.status(422).json({ error: "O número de portas do carro é obrigatório" });
    return;
  }
  
  if (!req.file) {
    res.status(422).json({ error: "A imagem do carro é obrigatória" });
    return;
  }

  // Convertendo a imagem para base64
  const carPhotoBase64 = req.file.buffer.toString('base64');

  const car = new Car({
    brand,
    model,
    description,
    price,
    year,
    fuel,
    color,
    kilometers,
    numOfDoors,
    carPhoto: carPhotoBase64 // Salvando a imagem como string base64
  });

  try {
    await Car.create(car);

    res.status(201).json({ msg: "Carro cadastrado no sistema com sucesso!", obj : carPhotoBase64 });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// LER TODOS
router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const query = {};

    if(filters.brand) query.brand = filters.brand;
    if(filters.model) query.model = filters.model;
    if(filters.year) query.year = filters.year;
    if(filters.color) query.color = filters.color;

    const cars = await Car.find(query);

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// LER OS 4 PRIMEIROS ITENS
router.get("/home", async (req, res) => {
    try {
      const cars = await Car.find().limit(4);
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

// LER POR ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const cars = await Car.findOne({ _id: id });

    if (!cars) {
      res
        .status(422)
        .json({ msg: "Esse carro não foi encontrado em nossa base" });
      return;
    }

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// ATUALIZAR
router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  const {
    brand,
    model,
    description,
    price,
    year,
    fuel,
    color,
    kilometers,
    numOfDoors,
    carPhoto,
  } = req.body;

  const car = {
    brand,
    model,
    description,
    price,
    year,
    fuel,
    color,
    kilometers,
    numOfDoors,
    carPhoto,
  };

  try {
    const updatedCar = await Car.updateOne({ _id: id }, car);

    if (updatedCar.matchedCount === 0) {
      res
        .status(422)
        .json({ msg: "Esse carro não foi encontrado em nossa base" });
      return;
    }

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// DELETAR
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const removedCar = await Car.deleteOne({ _id: id });

    if (removedCar.matchedCount === 0) {
      res
        .status(422)
        .json({ msg: "Esse carro não foi encontrado em nossa base" });
      return;
    }

    res.status(200).json(removedCar);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
