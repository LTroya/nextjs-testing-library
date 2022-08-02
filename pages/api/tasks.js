// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).json(req.body);
    return;
  }

  res.status(200).json([
    { id: 1, text: "Learn typescript", done: false },
    { id: 2, text: "Learn Next.js", done: true },
    { id: 3, text: "Learn DevOps", done: false },
  ]);
}
