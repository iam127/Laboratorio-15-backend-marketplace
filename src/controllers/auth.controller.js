const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nombre, email y password son requeridos', data: null });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado', data: null });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'CUSTOMER'
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario', data: null });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y password son requeridos', data: null });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas', data: null });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas', data: null });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } }
    });
  } catch (error) {
    console.error('Error al login:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', data: null });
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, message: 'Usuario autenticado', data: req.user });
};