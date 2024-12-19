import express from "express";
import movieController from "../controllers/movieController";

const router = express.Router();

router.get("/trending", movieController.getTrending);
router.get("/", movieController.index);
router.get("/:id", movieController.show);
router.get("/:id/related", movieController.getRelated);
router.put("/:id", movieController.update);
router.post("/", movieController.store);
router.post("/search", movieController.search);
router.post("/search-analytics/:type", movieController.searchAnalytics);
router.post("/analytics/:type", movieController.getAnalytics);
router.delete("/:id", movieController.destroy);

export default router;
