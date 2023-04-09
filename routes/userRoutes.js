const router = require('express').Router()
const User =  require('../models/User')

//CREATE
router.post("/", async (req, res) => {

  const { name,surname,wallet } = req.body;

  const user = {
    name,
    surname,
    wallet
  };

  try {
    if(!name || !surname){
        res.status(422).json({message: 'Nome e Sobrenome são obrigatórios'})
        return
    }
    await User.create(user);

    res.status(201).json({ message: "Usuário inserido no sistema com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: error });
  }
});

//READ
router.get('/', async (req, res) => {
    try {
        const users = await User.find()

        if(!users){
            res.status(422).json({message: 'Usuários não encontrados'})
            return
        }

        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

router.get('/:id', async (req, res) => {

    const id = req.params.id

    try {
        const user = await User.findOne({_id: id})

        if(!user){
            res.status(422).json({message: 'Usuário não encontrado'})
            return
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

//DELETE

router.delete('/:id', async (req, res) => {

    const id = req.params.id

    const user = await User.findOne({_id: id})

    if(!user){
        res.status(422).json({message: 'Usuário não encontrado'})
        return
    }

    try {
        const user = await User.deleteOne({_id: id})

        res.status(200).json({message: 'Usuário deletado com sucesso!'})

    } catch (error) {
        res.status(500).json({ erro: error });
    }
})

//ADICIONAR SALDO
router.patch('/:id/wallet', async (req, res) => {

    const id = req.params.id
    const { amount } = req.body;
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
  
      user.wallet += amount;
  
      const updatedUser = await user.save();
  
      if (!updatedUser) {
        res.status(422).json({ message: 'Falha ao atualizar usuário' });
        return;
      }
  
      res.json({ message: 'Saldo adicionado com sucesso', user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });


module.exports = router