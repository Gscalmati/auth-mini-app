import DBLocal from 'db-local';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { UserValidations } from './validations/UserValidations.js';

const { Schema } = DBLocal({ path: "./db" });

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export class UserRepository {
    static create ({ username, password }) {
        // Validaciones -> zod?
        UserValidations.username(username);
        UserValidations.password(password);
        
        // Validar existencia del usuario
        const user = User.findOne({ username });
        if (user) throw new Error("El usuario ya existe");

        const hashedPassword = bcrypt.hashSync(password, 10); // Esto bloquea el thread principal -> es costoso
        //const hashedPassword = bcrypt.hash(password, 10); // Esto no lo bloquea el thread principal -> una promesa, hay que hacer await acá y en el uso del UserRepository

        // Crear id único
        const idNuevo = crypto.randomUUID();

        User.create({ _id: idNuevo, username, password: hashedPassword }).save();
        
        return idNuevo;
    }

    static login ({ username, password }) {
        UserValidations.username(username);
        UserValidations.password(password);
        
        // Validar existencia del usuario
        const user = User.findOne({ username });
        if (!user) throw new Error("El usuario no existe");

        if (!bcrypt.compareSync(password, user.password)) throw new Error("Contraseña inválida");

        // Forma simple de "volar" el password del obj user
        const { password: _, ...publicUser} = user;

        return publicUser;
    }
}