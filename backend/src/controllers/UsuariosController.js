const Usuario = require ('../models/Usuario');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

/* função para gerar token que recebe como params o id do usuario */
function gerarToken(params = {}) {
    /* Irá ser gerado um token com base no id do usuario e no secret */
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400, /* 86400 segundos = 24h */
    });
}

module.exports = {

    async login(req, res) {
        const { senha, email, is_logged } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(400).send({
                status: 0,
                message: 'E-mail ou senha incerreto!'
            });
        }

        /* compara a senha hash passada no body da req com a senha do usuario do banco */
        if (!bcrypt.compareSync(senha, usuario.senha)) {
            return res.status(400).send({
                status: 0,
                message: 'E-mail ou senha incerreto!'
            })
        };

        const usuario_id = usuario.id;

        /* atualiza coluna is_logged para true para identificar usuario logado */
        await Usuario.update({
            is_logged
        }, {
            where: {
                id: usuario_id
            }
        });

        /* ao colocar senha undefined ira ocultar a senha no response (200) */
        usuario.senha = undefined;

        const token = gerarToken({ id: usuario.id });

        return res.status(200).send({
            status: 1,
            message: "Usuario logado com sucesso!",
            usuario, token
        })


    },

    async index(req, res) {
        const usuario = await Usuario.findAll();

        if (usuario == "" || usuario == null) {
            return res.status(200).send({message: "Nenhum usuário encontrado"});
        }

        return res.status(200).send({ usuario });
    }, 

    async store(req, res) {
        const { nome, email, senha } = req.body;

        const usuario = await Usuario.create({ nome, email, senha});

        const token = gerarToken({ id: usuario.id });
        
        return res.status(200).send({
            status: 1,
            message: "usuário cadastrado com sucesso",
            usuario, token
        });
    },

    async update(req, res) {
        const { nome, email, senha } = req.body;
        const { usuario_id } = req.params;

        await Usuario.update({
            nome, email, senha
        },{
            where: {
                id: usuario_id
            }
        });

        return res.status(200).send({
            status: 1,
            message: "usuário atualizado com sucesso"
        });
    },

    async delete(req, res) {
        const { usuario_id } = req.params;

        await Usuario.destroy({
            where: {
                id: usuario_id
            }
        });

        return res.status(200).send({
            status: 1,
            message: "usuário deletado com sucesso"
        });
    },
}