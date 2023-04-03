const router = require('express').Router()
const Person =  require('../models/Person')

//CREATE
router.post("/", async (req, res) => {
  const { name, salary, approved } = req.body;

  const person = {
    name,
    salary,
    approved,
  };

  try {
    if(!name){
        res.status(422).json({message: 'Campo obrigatorio'})
        return
    }
    await Person.create(person);

    res.status(201).json({ message: "Pessoa inserida no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//READ
router.get('/', async (req, res) => {
    try {
        const people = await Person.find()

        if(!people){
            res.status(422).json({message: 'Usuarios nao encontrados'})
            return
        }

        res.status(200).json(people)

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

router.get('/:id', async (req, res) => {

    const id = req.params.id

    try {
        const person = await Person.findOne({_id: id})

        if(!person){
            res.status(422).json({message: 'Usuario nao encontrado'})
            return
        }

        res.status(200).json(person)

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

//UPDATE
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const { name, salary, approved } = req.body;

    const person = {
        name,
        salary,
        approved,
      };

    try {
        const updated = await Person.updateOne({_id: id}, person)

        if(updated.matchedCount === 0){
            res.status(422).json({message: 'Usuario nao encontrado'})
            return
        }

        res.status(200).json(person)

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

//DELETE

router.delete('/:id', async (req, res) => {

    const id = req.params.id

    const person = await Person.findOne({_id: id})

    if(!person){
        res.status(422).json({message: 'Usuario nao encontrado'})
        return
    }

    try {
        const person = await Person.deleteOne({_id: id})

        res.status(200).json({message: 'Usuario deletado'})

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

module.exports = router