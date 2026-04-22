import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks/useBookings";
import { useGetMeetingToken, useEndMeeting, useCreateMeetingRoom, MeetingTokenError } from "@/hooks/useMeetingToken";
import { WaitingRoom } from "@/components/call/WaitingRoom";
import { VideoCallRoom } from "@/components/call/VideoCallRoom";
import { toast } from "sonner";


export default function SessionCall() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: booking, isLoading, refetch } = useBooking(id);
  const getToken = useGetMeetingToken();
  const createRoom = useCreateMeetingRoom();
  const endMeeting = useEndMeeting();

  const [tokenData, setTokenData] = useState<{ token: string; url: string } | null>(null);
  const [errorState, setErrorState] = useState<MeetingTokenError | null>(null);
  const hasAttemptedRef = useRef(false);

  const tutorName = (booking as any)?.tutor?.full_name as string | undefined;

  // Auto-attempt token on load — runs exactly once per booking id
  useEffect(() => {
    if (!booking || tokenData) return;
    if (hasAttemptedRef.current) return;
    hasAttemptedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        // Auto-provision room if missing (legacy bookings or failed booking-time provision)
        if (!(booking as any).meeting_room_name) {
          try {
            await createRoom.mutateAsync(booking.id);
            await refetch();
          } catch (provisionErr: any) {
            const msg = provisionErr?.message || "Failed to provision meeting room. Please contact support.";
            if (!cancelled) setErrorState({ error: msg });
            return;
          }
        }
        const res = await getToken.mutateAsync(booking.id);
        if (!cancelled) setTokenData({ token: res.token, url: res.url });
      } catch (e: any) {
        if (cancelled) return;
        // Differentiate FunctionsFetchError (network/CORS/not deployed) vs structured rejection
        const isStructured = e && typeof e === "object" && "error" in e && typeof e.error === "string";
        if (isStructured) {
          setErrorState(e as MeetingTokenError);
        } else {
          const msg = e?.message?.includes("Failed to send")
            ? "Could not reach the meeting service. Please check your connection and try again."
            : (e?.message || "Failed to reach meeting service");
          setErrorState({ error: msg });
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id]);


  const joinAt = useMemo(() => {
    if (!booking) return null;
    return new Date(new Date(booking.scheduled_at).getTime() - 15 * 60 * 1000).toISOString();
  }, [booking]);

  const handleLeave = async (durationSec: number) => {
    try {
      await endMeeting.mutateAsync({ bookingId: id, durationSec });
      toast.success("Session ended");
    } catch {
      toast.error("Could not record session end");
    }
    navigate(`/dashboard/sessions/${id}`);
  };

  const handleRetry = async () => {
    setErrorState(null);
    hasAttemptedRef.current = false;
    try {
      // Re-provision if needed
      if (booking && !(booking as any).meeting_room_name) {
        await createRoom.mutateAsync(id);
        await refetch();
      }
      const res = await getToken.mutateAsync(id);
      setTokenData({ token: res.token, url: res.url });
    } catch (e: any) {
      const isStructured = e && typeof e === "object" && "error" in e;
      setErrorState(isStructured ? (e as MeetingTokenError) : { error: e?.message || "Failed to reach meeting service" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-screen w-full rounded-2xl" />
      </div>
    );
  }

  if (!booking) {
    return <ErrorScreen title="Session not found" message="We couldn't load this session." onBack={() => navigate("/dashboard")} />;
  }

  // In a call
  if (tokenData) {
    return (
      <VideoCallRoom
        url={tokenData.url}
        token={tokenData.token}
        bookingId={id}
        onLeave={handleLeave}
        onError={(msg) => {
          // If Daily itself rejects, surface as an error screen on next render
          setTokenData(null);
          setErrorState({ error: msg });
        }}
      />
    );
  }

  // Waiting (too early)
  if (errorState?.reason === "too_early" && joinAt) {
    return (
      <WaitingRoom
        scheduledAt={booking.scheduled_at}
        joinAt={errorState.joinAt || joinAt}
        tutorName={tutorName}
        subject={booking.subject}
        onReady={handleRetry}
      />
    );
  }

  // Specific reasons → friendly messages
  if (errorState) {
    const msg =
      errorState.reason === "expired" ? "This session has ended."
      : errorState.reason === "cancelled" ? "This session was cancelled."
      : errorState.reason === "awaiting_payment" ? "This session is awaiting payment confirmation. Once payment is confirmed, you'll be able to join."
      : errorState.error || "Unable to join this session.";
    return (
      <ErrorScreen
        title="Cannot join"
        message={msg}
        onBack={() => navigate(`/dashboard/sessions/${id}`)}
        onRetry={errorState.reason === "awaiting_payment" ? undefined : handleRetry}
      />
    );
  }

  // Loading token
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm">Preparing your session…</p>
      </div>
    </div>
  );
}

function ErrorScreen({ title, message, onBack, onRetry }: { title: string; message: string; onBack: () => void; onRetry?: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{message}</p>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          {onRetry && <Button onClick={onRetry}>Try again</Button>}
        </div>
      </div>
    </div>
  );
}
