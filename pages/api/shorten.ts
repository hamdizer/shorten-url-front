import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { originalUrl } = req.body;

    const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(originalUrl);

    if (!isValidUrl) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/shorten`,
        {
          originalUrl,
        }
      );

      return res.status(200).json({ shortenedUrl: response.data.shortenedUrl });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.status(500).json({ message: "Failed to shorten URL" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
