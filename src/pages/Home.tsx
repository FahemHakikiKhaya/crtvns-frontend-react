import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { enqueueSnackbar } from "notistack";
import api from "@/api/axiosConfig";
import { useAuth } from "@/provider/AuthProvider";
import { useNavigate } from "react-router";

const Home: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const speak = () => {
    if (!text) return;
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.voice =
      voices.find((voice) => voice.name === selectedVoice) || null;
    utterance.volume = volume;
    utterance.onend = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    console.log(window.speechSynthesis.speaking);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const save = async () => {
    if (!auth.token) {
      navigate("/login");
    }
    setLoadingSave(true);
    try {
      await api.post("/user-histories", {
        text,
        rate,
        voiceName: selectedVoice,
        pitch,
        volume,
      });

      enqueueSnackbar("Successfuly saved to history", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-[500px] flex flex-col space-y-4">
        <Textarea
          rows={4}
          placeholder="Enter text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Select
          value={selectedVoice}
          onValueChange={(value) => setSelectedVoice(value)}
        >
          <SelectTrigger className="w-[350px]">
            <SelectValue placeholder="Select a voice language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {React.Children.toArray(
                voices.map((voice) => (
                  <SelectItem value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Slider
          defaultValue={[1]}
          max={2}
          step={0.1}
          onValueChange={(value) => setRate(value[0])}
        />
        <span>Rate: {rate}</span>
        <Slider
          defaultValue={[1]}
          max={2}
          step={0.1}
          value={[pitch]}
          onValueChange={(value) => setPitch(value[0])}
        />
        <span>Pitch: {pitch}</span>
        <Slider
          defaultValue={[1]}
          max={2}
          step={0.1}
          value={[volume]}
          onValueChange={(value) => setVolume(value[0])}
        />
        <span>Volume: {volume}</span>

        <Button onClick={save} disabled={loadingSave}>
          Save
        </Button>
        <Button onClick={speak} disabled={isSpeaking}>
          Speak
        </Button>
        <Button onClick={pause} disabled={!isSpeaking}>
          Pause
        </Button>
        <Button onClick={resume} disabled={!isSpeaking}>
          Resume
        </Button>
        <Button onClick={stop} disabled={!isSpeaking}>
          Stop
        </Button>
      </div>
    </div>
  );
};

export default Home;
