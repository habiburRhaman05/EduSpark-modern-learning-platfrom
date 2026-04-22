import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Local pre-call camera/mic preview with mute toggles + mic level meter. */
export function DevicePreview() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        // Mic level meter
        const AC = (window.AudioContext || (window as any).webkitAudioContext);
        const ctx = new AC();
        audioCtxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        src.connect(analyser);
        const buf = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (let i = 0; i < buf.length; i++) {
            const v = (buf[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / buf.length);
          setLevel(Math.min(1, rms * 3));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      } catch (e: any) {
        setError(e?.message || "Camera/microphone access denied");
      }
    })();
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => null);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setCamOn(track.enabled); }
  };
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-muted/20">
      <div className="relative aspect-video bg-black">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        {!camOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-muted-foreground text-sm">
            Camera off
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-destructive text-sm p-4 text-center">
            {error}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3 bg-card">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-muted-foreground">Mic</span>
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-75"
              style={{ width: `${level * 100}%` }}
            />
          </div>
        </div>
        <Button size="sm" variant={micOn ? "secondary" : "destructive"} onClick={toggleMic}>
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant={camOn ? "secondary" : "destructive"} onClick={toggleCam}>
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
