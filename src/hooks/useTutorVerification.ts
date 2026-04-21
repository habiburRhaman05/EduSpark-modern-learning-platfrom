import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface VerificationApplication {
  id: string;
  tutor_id: string;
  full_name: string;
  nid_number: string;
  phone: string;
  address: string;
  profession: string;
  institution: string | null;
  years_experience: number | null;
  nid_doc_path: string;
  photo_doc_path: string;
  certificate_doc_path: string;
  additional_doc_path: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  reviewed_at: string | null;
  submitted_at: string;
}

export function useMyVerification() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-verification", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("tutor_verifications")
        .select("*")
        .eq("tutor_id", user!.id)
        .maybeSingle();
      if (error && error.code !== "PGRST116") {
        // table likely doesn't exist yet — surface a clear setup error
        if (error.message?.toLowerCase().includes("does not exist") || error.code === "42P01") {
          throw new Error("Verification system not initialized. Please run SEED_DATA.sql in Supabase SQL Editor.");
        }
        throw error;
      }
      return (data as VerificationApplication | null) ?? null;
    },
    retry: false,
  });
}

export interface VerificationInput {
  full_name: string;
  nid_number: string;
  phone: string;
  address: string;
  profession: string;
  institution?: string;
  years_experience: number;
  nid_file: File;
  photo_file: File;
  certificate_file: File;
  additional_file?: File | null;
}

async function uploadFile(userId: string, file: File, kind: string) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${kind}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("verification-docs").upload(path, file, { upsert: true });
  if (error) {
    const msg = (error as any).message || String(error);
    if (msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("bucket")) {
      throw new Error(
        "Storage bucket 'verification-docs' is missing. Open Supabase SQL Editor and run the SEED_DATA.sql file (the Phase 2 section creates the bucket)."
      );
    }
    throw new Error(msg);
  }
  return path;
}

export function useSubmitVerification() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: VerificationInput) => {
      if (!user) throw new Error("Not authenticated");
      const [nidPath, photoPath, certPath, addPath] = await Promise.all([
        uploadFile(user.id, input.nid_file, "nid"),
        uploadFile(user.id, input.photo_file, "photo"),
        uploadFile(user.id, input.certificate_file, "certificate"),
        input.additional_file ? uploadFile(user.id, input.additional_file, "additional") : Promise.resolve(null),
      ]);
      const { error } = await (supabase as any).from("tutor_verifications").insert({
        tutor_id: user.id,
        full_name: input.full_name,
        nid_number: input.nid_number,
        phone: input.phone,
        address: input.address,
        profession: input.profession,
        institution: input.institution || null,
        years_experience: input.years_experience,
        nid_doc_path: nidPath,
        photo_doc_path: photoPath,
        certificate_doc_path: certPath,
        additional_doc_path: addPath,
        status: "pending",
      });
      if (error) {
        if (error.code === "23505") throw new Error("You already submitted an application. Please wait for review.");
        throw new Error(error.message || "Submission failed");
      }
      // Mark profile as having a pending verification
      await supabase
        .from("tutor_profiles")
        .update({ verification_status: "pending" })
        .eq("user_id", user.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-verification"] });
      qc.invalidateQueries({ queryKey: ["my-tutor-profile"] });
    },
  });
}
