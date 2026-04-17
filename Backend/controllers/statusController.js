// controllers/statusController.js

export const getStatuses = (req, res) => {
  const STATUSES = [
    { key: "rs", label: "rs" },
    { key: "processing", label: "Processing" },
    { key: "on_hold", label: "On Hold" },
    { key: "completed", label: "Completed" },
    { key: "canceled", label: "Canceled" },
    { key: "refunded", label: "Refunded" },
    { key: "failed", label: "Failed" },
    { key: "trash", label: "Trash" },
  ];

  res.json(STATUSES);
};
