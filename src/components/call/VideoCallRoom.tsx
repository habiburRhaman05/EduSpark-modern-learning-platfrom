import { useEffect, useState, useCallback } from "react";
import {
  DailyProvider,
  useDaily,
  useDailyEvent,
  useParticipantIds,
  useLocalSessionId,
  useVideoTrack,
  useAudioTrack,
  useParticipantProperty,
  useNetwork,
} from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MonitorOff, Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  url: string;
  token: string;
  bookingId: string;
  onLeave: (durationSec: number) => void;
}

/** Top-level wrapper that owns the Daily call object lifecycle. */
export function VideoCallRoom(props: Props) {
  const [call, setCall] = useState<DailyCall | null>(null);

  useEffect(() => {
    const c = DailyIframe.createCallObject({
      audioSource: true,
      videoSource: true,
      dailyConfig: { useDevicePreferenceCookies: true },
    });
    setCall(c);
    c.join({ url: props.url, token: props.token }).catch((e) => console.error("join error", e));
    return () => {
      c.leave().catch(() => null);
      c.destroy().catch(() => null);
      setCall(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url, props.token]);

  if (!call) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-muted-foreground">
        Connecting...
      </div>
    );
  }

  return (
    <DailyProvider callObject={call}>
      <CallUI bookingId={props.bookingId} onLeave={props.onLeave} />
    </DailyProvider>
  );
}

function CallUI({ bookingId, onLeave }: { bookingId: string; onLeave: (s: number) => void }) {
  const daily = useDaily();
  const localId = useLocalSessionId();
  const ids = useParticipantIds();
  const remoteIds = ids.filter((id) => id !== localId);
  const [startedAt] = useState(() => Date.now());
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const network = useNetwork();

  useDailyEvent("error", (e) => console.error("Daily error:", e));

  const handleLeave = useCallback(() => {
    const dur = Math.floor((Date.now() - startedAt) / 1000);
    onLeave(dur);
  }, [startedAt, onLeave]);

  useDailyEvent("left-meeting", handleLeave);

  const toggleMic = () => {
    const next = !micOn;
    daily?.setLocalAudio(next);
    setMicOn(next);
  };
  const toggleCam = () => {
    const next = !camOn;
    daily?.setLocalVideo(next);
    setCamOn(next);
  };
  const toggleScreen = async () => {
    if (!daily) return;
    if (screenOn) {
      await daily.stopScreenShare();
      setScreenOn(false);
    } else {
      await daily.startScreenShare();
      setScreenOn(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live session
        </div>
        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{ids.length}</span>
          <NetworkPill quality={network.quality} threshold={network.threshold} />
          <CallTimer startedAt={startedAt} />
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 p-4 grid gap-4 grid-cols-1 md:grid-cols-2 auto-rows-fr">
        {remoteIds.length === 0 && (
          <div className="md:col-span-2 flex items-center justify-center text-white/50 text-sm">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center animate-pulse">
                <Users className="w-7 h-7" />
              </div>
              <div>Waiting for the other participant to join…</div>
            </div>
          </div>
        )}
        {remoteIds.map((id) => <Tile key={id} sessionId={id} />)}
        {localId && <Tile key={localId} sessionId={localId} isLocal />}
      </div>

      {/* Controls */}
      <div className="p-4 bg-black/40 backdrop-blur border-t border-white/5 flex items-center justify-center gap-3">
        <ControlBtn active={micOn} onClick={toggleMic} label={micOn ? "Mute" : "Unmute"}>
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </ControlBtn>
        <ControlBtn active={camOn} onClick={toggleCam} label={camOn ? "Stop video" : "Start video"}>
          {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </ControlBtn>
        <ControlBtn active={!screenOn} onClick={toggleScreen} label={screenOn ? "Stop sharing" : "Share screen"}>
          {screenOn ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </ControlBtn>
        <Button
          size="lg"
          variant="destructive"
          className="rounded-full px-6 gap-2"
          onClick={() => daily?.leave()}
        >
          <PhoneOff className="w-4 h-4" /> Leave
        </Button>
      </div>
    </div>
  );
}

function ControlBtn({
  active, onClick, label, children,
}: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
        active ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500/90 text-white hover:bg-red-500"
      }`}
    >
      {children}
    </button>
  );
}

function Tile({ sessionId, isLocal }: { sessionId: string; isLocal?: boolean }) {
  const videoTrack = useVideoTrack(sessionId);
  const audioTrack = useAudioTrack(sessionId);
  const userName = useParticipantProperty(sessionId, "user_name") as string | undefined;
  const videoEl = useCallback((node: HTMLVideoElement | null) => {
    if (node && videoTrack.persistentTrack) {
      node.srcObject = new MediaStream([videoTrack.persistentTrack]);
    }
  }, [videoTrack.persistentTrack]);
  const audioEl = useCallback((node: HTMLAudioElement | null) => {
    if (node && audioTrack.persistentTrack && !isLocal) {
      node.srcObject = new MediaStream([audioTrack.persistentTrack]);
    }
  }, [audioTrack.persistentTrack, isLocal]);

  const initials = (userName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-video shadow-2xl border border-white/5">
      {videoTrack.persistentTrack && !videoTrack.isOff ? (
        <video
          ref={videoEl}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        </div>
      )}
      {!isLocal && <audio ref={audioEl} autoPlay />}
      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-white text-xs font-medium flex items-center gap-1.5">
        {audioTrack.isOff && <MicOff className="w-3 h-3 text-red-400" />}
        {userName || "Guest"} {isLocal && "(You)"}
      </div>
    </div>
  );
}

function CallTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const s = Math.floor((now - startedAt) / 1000);
  const m = Math.floor(s / 60);
  return <span className="tabular-nums">{String(m).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</span>;
}

function NetworkPill({ quality, threshold }: { quality: number; threshold: string }) {
  const color = threshold === "good" ? "text-green-400" : threshold === "low" ? "text-yellow-400" : "text-red-400";
  return (
    <span className={`flex items-center gap-1 ${color}`}>
      <Wifi className="w-3.5 h-3.5" /> {quality}%
    </span>
  );
}
