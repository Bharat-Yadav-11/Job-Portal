import { currentUser } from "@clerk/nextjs/server";
import { fetchProfileAction } from "@/actions";
import { redirect } from "next/navigation";
import HomePageClient from "./home-page-client"; 

export default async function Home() {

  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);

  if (user && !profileInfo?._id) {
    redirect("/onboard");
  }

  return (
    <HomePageClient
      user={JSON.parse(JSON.stringify(user))}
      profileInfo={JSON.parse(JSON.stringify(profileInfo))}
    />
  );
}