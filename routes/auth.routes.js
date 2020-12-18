const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const {check, validationResult} = require('express-validator');
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post(
    '/register', 
    [
        check('email', 'Not an Email').isEmail(),
        check('password', 'Min lenght is 2 digits')
            .isLength({min:2})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors:errors.array(),
                message: 'There are some errors'
            })
        }

        const {email, password} = req.body;

        const candidate = await User.findOne({email});

        if (candidate) {
            res.status(400).json({message: 'Такой пользователь уже есть'});
        }

        const hashedPass = await bcrypt.hash(password, 12);

        const user = new User({
            email,
            password: hashedPass           
        });

        await user.save();
        res.status(201).json({message: 'user saved'});

    } catch (e) {
        res.status(500).json({message: 'something is wrong'});
    }
});

router.post(
    '/login',
    [
        check('email', 'Not an Email').normalizeEmail().isEmail(),
        check('password', 'Enter password')
            .exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'There are some errors during entry'
                });
            }
    
            const {email, password} = req.body;
            
            const user = await User.findOne({email});
            
            if (!user) {
                return res.status(400).json({message: 'no such user'});
            }
                       
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Wrong password!'});
            }
            
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({token, userId: user.id});
    
        } catch (e) {
            res.status(500).json({message: 'something is wrong'});
        }
});


module.exports = router;
