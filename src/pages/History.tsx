import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/AuthProvider";
import { History as HistoryType } from "@/type/History";
import { useEffect, useState } from "react";

const History = () => {
  const auth = useAuth();
  const [histories, setHistories] = useState<HistoryType[]>();
  const [isPlaying, setIsPlaying] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  const replayVoice = (item: HistoryType) => {
    if (isPlaying) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.rate = item.rate;
    utterance.pitch = item.pitch;
    utterance.volume = item.volume;
    utterance.voice =
      speechSynthesis
        .getVoices()
        .find((voice) => voice.name === item.voiceName) || null;
    speechSynthesis.speak(utterance);
    setIsPlaying(utterance);
  };

  const fetchHistories = async () => {
    const response = await api.get("/user-histories");

    setHistories(response.data.data);
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Text to Speech List</h2>
      <div className="space-y-4">
        {histories?.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-medium">{item.text}</p>
              <p className="text-sm text-gray-500">
                Rate: {item.rate}, Pitch: {item.pitch}, Volume: {item.volume}
              </p>
            </div>
            <Button onClick={() => replayVoice(item)}>Replay</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
