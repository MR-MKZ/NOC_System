import { Router } from "express";

const router = Router()

router.get('/hello', function(req, res) {
    res.status(200).json({
        'message': 'Jalebe'
    })
})

export {
    router as apiV1Routes
}