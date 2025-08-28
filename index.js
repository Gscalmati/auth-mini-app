import express from 'express';
import { UserRepository } from './userRepository.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("GET root. Que hacés papá?");
})

app.post("/login", (req, res) => {
    res.json({
        status: "ok",
        message: "login method"
    })
});
app.post("/register", (req, res) => {

    const { username, password } = req.body;

    try {

        const idUser = UserRepository.create({ username, password });
        
        res.send("El id creado fue " + idUser);
    } catch (error) {
        res.status(400).send(error.message);
    }

});
app.post("/logout", (req, res) => {});
app.post("/protected", (req, res) => {});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
});