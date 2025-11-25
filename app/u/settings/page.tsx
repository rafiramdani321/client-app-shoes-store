import { redirect } from "next/navigation";

export default function SettingsRootPage() {
  redirect("/u/settings/profile");
}
