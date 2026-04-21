import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTutorProfileId } from "./useTutorDashboard";

export interface AvailabilitySlot {
  id: string;
  tutor_id: string;
  day_of_week: number;
  specific_date: string | null;
  start_time: string;
  end_time: string;
  is_recurring: boolean | null;
  is_booked: boolean | null;
  created_at: string;
}

export function useAvailabilityList() {
  const { data: tutorProfileId } = useTutorProfileId();
  return useQuery({
    queryKey: ["tutor-availability", tutorProfileId],
    enabled: !!tutorProfileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability")
        .select("*")
        .eq("tutor_id", tutorProfileId!)
        .order("specific_date", { ascending: true, nullsFirst: false })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return (data || []) as AvailabilitySlot[];
    },
  });
}

export interface SlotInput {
  specific_date: string;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
}

export function useCreateSlot() {
  const qc = useQueryClient();
  const { data: tutorProfileId } = useTutorProfileId();
  return useMutation({
    mutationFn: async (input: SlotInput) => {
      if (!tutorProfileId) throw new Error("Tutor profile not ready");
      const day = new Date(input.specific_date + "T00:00:00").getDay();
      // Check overlap
      const { data: existing } = await supabase
        .from("availability")
        .select("start_time, end_time")
        .eq("tutor_id", tutorProfileId)
        .eq("specific_date", input.specific_date);
      const overlap = (existing || []).some(
        (s: any) =>
          (input.start_time >= s.start_time && input.start_time < s.end_time) ||
          (input.end_time > s.start_time && input.end_time <= s.end_time) ||
          (input.start_time <= s.start_time && input.end_time >= s.end_time)
      );
      if (overlap) throw new Error("This time slot overlaps with an existing slot.");
      const { error } = await supabase.from("availability").insert({
        tutor_id: tutorProfileId,
        specific_date: input.specific_date,
        day_of_week: day,
        start_time: input.start_time,
        end_time: input.end_time,
        is_recurring: input.is_recurring ?? false,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tutor-availability"] }),
  });
}

export function useUpdateSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: SlotInput & { id: string }) => {
      const day = new Date(input.specific_date + "T00:00:00").getDay();
      const { error } = await supabase
        .from("availability")
        .update({
          specific_date: input.specific_date,
          day_of_week: day,
          start_time: input.start_time,
          end_time: input.end_time,
          is_recurring: input.is_recurring ?? false,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tutor-availability"] }),
  });
}

export function useDeleteSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tutor-availability"] }),
  });
}
