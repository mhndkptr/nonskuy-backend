import express from "express";
import movieController from "../controllers/movieController";

const router = express.Router();

router.get("/", movieController.index);
router.get("/:id", movieController.show);
router.put("/:id", movieController.update);
router.post("/", movieController.store);
router.post("/search", movieController.search);
router.delete("/:id", movieController.destroy);

export default router;
