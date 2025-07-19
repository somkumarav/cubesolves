"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { VerifyEmail } from "@/actions/auth";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    VerifyEmail({ token: token || "" });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, []);

  return null;
};

export default VerifyPage;
