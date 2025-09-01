export class UserValidations {
  static username(username) {
    if (typeof username !== "string")
      throw new Error("El nombre de usuario debe ser un string");
    if (username.length < 6)
      throw new Error("El nombre de usuario debe tener más de 6 caracteres");
  }

  static password(password) {
    if (typeof password !== "string")
      throw new Error("La contraseña debe ser un string");
    if (password.length < 8)
      throw new Error("La contraseña debe tener más de 8 caracteres");
  }
}
