
// Defining controller functions for the homepage called showHomePage

const showHomePage = (req, res) => {

    const title = 'Home';

    res.render('home', { title });
};

// Export function

export { showHomePage };