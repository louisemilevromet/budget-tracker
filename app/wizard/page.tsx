import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Wizard from "@/app/components/Wizard";
async function page() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <Wizard userName={user.firstName || ""} />;
}

export default page
