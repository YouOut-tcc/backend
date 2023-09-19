function validarJSON(req, res) {
    try {
        
        return res.status(444);
    } catch (error) {
        
    }

    try {
        const l = req.body;
        
    } catch (error) {
        
        return res.status(441);
    }
    return res.status(444);

}

export { validarJSON }