"use client";

import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import React from "react";

const Profile = () => {
  const router = useRouter();
  const { isAuthResolved, accessToken } = useAuthStore();
  const fetchRef = React.useRef(false);

  React.useEffect(() => {
    if (!isAuthResolved) return;
    if (!accessToken) {
      router.push("/");
      return;
    }

    if (fetchRef.current) return;

    const fetchMe = async () => {
      try {
        const res = await apiFetch("/auth/me", {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          console.log(data);
          return;
        }

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMe();
    fetchRef.current = true;
  }, [accessToken, isAuthResolved, router]);
  return <div>Profile</div>;
};

export default Profile;
