const bcrypt = require('bcryptjs');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const { generateAccessToken, generateRandomPassword, generateHashedPassword } = require('../utils/jwtToken');
const { sendEmail } = require('../utils/mailer');
const { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, validationErrorResponse } = require('../utils/apiResponses');
const { registerValidation } = require('../validations/registerValidation');


// Register
exports.register = async (req, res) => {

    const { error } = registerValidation(req.body);
    if (error) {
        return notFoundResponse(res, error.details[0].message);
    }

    try {
        const { name, email, password, bio, phone, avatar } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await generateHashedPassword(password);

        const verificationToken = generateRandomPassword(10);

        const user = new User({
            name,
            email,
            bio,
            phone,
            avatar,
            password: hashedPassword,
            role: "USER",
            verificationToken,
            verificationTokenExpires: Date.now() + 3600000
        });

        await user.save();

        // 6. Send email
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        try {
            await sendEmail(
                email,
                'Verify your email',
                `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
            );
        } catch (emailError) {
            console.error('Email send failed:', emailError.message);
            return res.status(500).json({
                message: 'User registered, but verification email could not be sent.'
            });
        }

        return successResponse(res, {}, "Registration successful. Please check your email to verify your account.");

    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('Invalid or expired token.');

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        const tokenGenUser = generateAccessToken({
            id: user._id,
            role: user.role,
        });

        return successResponse(res, {
            token: tokenGenUser,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, "Email verified successfully. Welcome to our platform!");

    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Resend Verification Email
exports.resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return errorResponse(res, "User not found");


        if (user.isVerified) return errorResponse(res, 'Email already verified.');

        const newVerificationToken = generateRandomPassword(10);
        const newVerificationTokenExpires = Date.now() + 3600000;

        user.verificationToken = newVerificationToken;
        user.verificationTokenExpires = newVerificationTokenExpires;

        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newVerificationToken}`;

        await sendEmail(
            email,
            'Verify your email',
            `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
        );

        return successResponse(res, {}, "New verification link sent.");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return unauthorizedResponse(res, "Invalid email or password");
        }

        // Check if the user is active
        if (!user.isVerified) {
            return unauthorizedResponse(res, "Your account is inactive. Please contact support.");
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return unauthorizedResponse(res, "Invalid email or password");
        }

        // Generate a JWT token
        const token = generateAccessToken({
            id: user._id,
            role: user.role,
        });

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        return successResponse(res, { token, user: userData }, "Login successful");

    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return errorResponse(res, "User not found");

        const resetToken = generateRandomPassword(10);
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendEmail(
            email,
            'Reset your password',
            `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        );

        return successResponse(res, {}, "Password reset link sent to your email.");
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return errorResponse(res, "Invalid or expired token.");

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return successResponse(res, {}, "Password successfully reset.");

    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Log Out
exports.logout = async (req, res) => {
    try {

        const token = req.header('Authorization')?.replace('Bearer ', '');

        const userId = req.user?.id;

        if (!userId) {

            if (token) {
                await BlacklistedToken.create({ token });
            }
            req.session.destroy((err) => {
                if (err) {
                    return errorResponse(res, "Logout failed")
                }
                res.clearCookie("connect.sid");
                return successResponse(res, "Logged out successfully");
            });
        } else {
            if (token) {
                await BlacklistedToken.create({ token });
            }
            return successResponse(res, "Logout successful");
        }

    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Get Me (Protected route)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return errorResponse(res, "User not found.");

        res.json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};