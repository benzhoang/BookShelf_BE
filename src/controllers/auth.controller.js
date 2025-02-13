

exports.getCurrentUser = (req, res) => {
    if (req.user) {
      res.status(200).json({ message: "Welcome to the dashboard!", user: req.user , success: true, user: req.user });
      res.redirect("/dashboard");
    } else {
      res.status(401).json({ success: false, message: "Not authenticated" });
    }
  };
  
  exports.logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ success: false, message: "Logout failed" });
      res.redirect("/");
    });
  };
  