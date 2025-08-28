import DBLocal from 'db-local';
import crypto from 'crypto';
import { type } from 'os';

const { Schema } = DBLocal({ path: "./db" });

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export class UserRepository {
    static create ({ username, password }) {
        // Validaciones -> zod?
        if (typeof username !== 'string') throw new Error("El nombre de usuario debe ser un string");
        if (username.length < 6) throw new Error("El nombre de usuario debe tener más de 6 caracteres");
        
        if (typeof password !== 'string') throw new Error("La contraseña debe ser un string");
        if (password.length < 8) throw new Error("La contraseña debe tener más de 8 caracteres");

        // Validar existencia del usuario
        const user = User.findOne({ username });
        if (user) throw new Error("El usuario ya existe");

        // Crear id único
        const idNuevo = crypto.randomUUID();

        User.create({ _id: idNuevo, username, password }).save();
        
        return idNuevo;
    }

    static login ({ username, password }) {}
}