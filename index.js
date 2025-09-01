import express from 'express';
import { UserRepository } from './userRepository.js';
import jwt from 'jsonwebtoken';
import { PORT, SECRET_KEY } from "./env.js"
import cookieParser from 'cookie-parser';

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
})

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    try {

        const user = UserRepository.login({ username, password });

        // Creamos sesión
        // express-session -> libreria
        // Usamos JWT lo hacemos sin estado
        const token = jwt.sign(
            { 
                username: user.username, id: user._id
            },
             SECRET_KEY,
             {
                expiresIn: '1h'
             });
        
        res
        .cookie('access_token', token, {
            httpOnly: true, // solo se puede acceder en el servidor
            secure: true, // solo HTTPS
            sameSite: 'strict', // solo se puede acceder en el mismo dominio
            maxAge: 1000 * 60 * 60
        })
        .json({
            status: "ok",
            message: "Credenciales correctas, derivando usuario...",
            token
        })
    } catch (error) {
        res.status(401).send({message: error.message});
    }
});
app.post("/register", (req, res) => {

    const { username, password } = req.body;

    try {

        const idUser = UserRepository.create({ username, password });
        
        res.status(200).send({ message: "El id creado fue " + idUser });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }

});
app.post("/logout", (req, res) => {});

app.get("/protected", (req, res) => {

    const token = req.cookies.access_token;

    if (!token) return res.status(403).send('Acceso no autorizado');

    try {
        const data = jwt.verify(token, SECRET_KEY); // Verificar token vía JWT
        res.render('privado', { username: data.username });
    }
    catch (error) {
        return res.status(401).send('Acceso no autorizado');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});