import { db } from "../../../lib/server";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ error: "Missing request body" });
  }
  console.log("Creating booking with body", body);
  try {
    const booking = await db.booking.create({
      data: {
        ...body,
      },
    });

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking", error);
    return res.status(500).json({ error: "An error occurred while creating the booking" });
  }
}