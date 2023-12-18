import { cookies } from 'next/headers';

export async function GET(req, res) {
  // Make a note we are on the api. This goes to the console.
  console.log("checking auth");

  // Get the auth record or set it to 'false' if it's undefined
  let record = cookies().get('auth') || { value: 'false' };

  console.log(record.value);

  // At the end of the process, send something back.
  return Response.json({ "status": "" + record.value + "" });
}