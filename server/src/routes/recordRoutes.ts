import { Router } from "express";
import {
  fetchAllRecords,
  fetchRecordById,
  patchRecord,
  removeRecord,
  exportRecordAsJson,
  exportRecordAsCsv,
  exportRecordAsMarkdown,
} from "../controllers/recordController";

const router = Router();

router.get("/", fetchAllRecords);
router.get("/:id/export/json", exportRecordAsJson);
router.get("/:id/export/csv", exportRecordAsCsv);
router.get("/:id/export/markdown", exportRecordAsMarkdown);
router.get("/:id", fetchRecordById);
router.patch("/:id", patchRecord);
router.delete("/:id", removeRecord);

export default router;