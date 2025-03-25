import * as ai from '../services/ai.service.js'

export const getResponseController = async (req,res) => {
    const {prompt} = req.query;
    try {
        const response = await ai.generateResult(prompt);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}