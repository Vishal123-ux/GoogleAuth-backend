import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth Login
router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get('/google/callback', passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("http://localhost:5173/home"); // Redirect to frontend after login
});

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((error) => {
            if (error) {
                return next(error);
            }
            res.clearCookie("connect.sid"); // Clear session cookie
            res.redirect("http://localhost:5173/home"); // Redirect to frontend
        });
    });
});


// Get Authenticated User
router.get("/user", (req, res) => {
    res.json(req.user || null);
});

export default router;
