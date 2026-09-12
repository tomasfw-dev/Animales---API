import express  from "express";
import * as animalesController from '../controllers/animalesController'

const router = express.Router() 

router.get('/', animalesController.traerAnimalesController)

router.get('/:id', animalesController.buscarAnimalPorIdController)

router.post('/', animalesController.agregarAnimalController)

export default  router